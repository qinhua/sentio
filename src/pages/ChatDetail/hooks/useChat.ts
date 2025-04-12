import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthProviderContext } from '@/providers/AuthProvider'
import { MessageItem, DoctorItem } from '../types'
import { chat } from '@/services/gpt'
import dayjs from 'dayjs'
import { EnumUserGender } from 'src/enum/common'

type MessageRole = 'system' | 'user' | 'assistant'

const STORAGE_KEY_PREFIX = 'chat_history_'
const MAX_CONTEXT_MESSAGES = 20 // 限制上下文消息数量

export const useChat = (doctor: DoctorItem) => {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const messagesRef = useRef<MessageItem[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const isProcessingRef = useRef(false)
  const { profile } = useAuthProviderContext()
  const hasLoadedRef = useRef(false)
  const introductionSentRef = useRef(false)
  const chatIdRef = useRef(`${doctor.id}-${Date.now()}`) // 确保每个会话有唯一标识

  // 从本地存储加载消息历史
  useEffect(() => {
    if (!doctor?.id || hasLoadedRef.current) return

    hasLoadedRef.current = true
    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`

    try {
      const storedMessages = localStorage.getItem(storageKey)
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as MessageItem[]
        // 验证消息格式
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          // 清除任何可能的加载状态
          const cleanedMessages = parsedMessages.map(msg => ({
            ...msg,
            isLoading: false
          }))
          setMessages(cleanedMessages)
          messagesRef.current = cleanedMessages
          introductionSentRef.current = true
        } else {
          console.log('No valid messages found in storage')
          setMessages([])
          messagesRef.current = []
        }
      } else {
        setMessages([])
        messagesRef.current = []
      }
    } catch (error) {
      console.error('Error loading stored messages:', error)
      setMessages([])
      messagesRef.current = []
    }
  }, [doctor?.id])

  // 保存消息到本地存储 - 防抖版本
  const saveMessagesDebounced = useCallback(
    (messagesToSave: MessageItem[]) => {
      if (!doctor?.id) return

      const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
      // 只保存非加载状态的消息
      const filteredMessages = messagesToSave.filter(msg => !msg.isLoading)

      try {
        localStorage.setItem(storageKey, JSON.stringify(filteredMessages))
      } catch (error) {
        console.error('Error saving messages to localStorage:', error)
      }
    },
    [doctor?.id]
  )

  // 创建新消息对象
  const createMessageObject = useCallback(
    (
      content: string,
      sender: 'user' | 'counselor',
      isLoading = false
    ): MessageItem => {
      const now = dayjs()
      const prevMessages = messagesRef.current

      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender,
        avatar:
          sender === 'counselor' ? doctor?.avatar : profile?.avatar_url || '',
        gender:
          sender === 'counselor'
            ? doctor.gender
            : profile?.gender || EnumUserGender.OTHER,
        text: content,
        time: now.format('HH:mm'),
        date: now.format('YYYY/MM/DD'),
        isFirstOfDay:
          prevMessages.length === 0 ||
          !dayjs(prevMessages[prevMessages.length - 1].date).isSame(now, 'day'),
        isLoading
      }
    },
    [doctor?.avatar, profile?.avatar_url]
  )

  // 添加新消息
  const addMessage = useCallback(
    (content: string, sender: 'user' | 'counselor', isLoading = false) => {
      const newMessage = createMessageObject(content, sender, isLoading)

      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage]
        messagesRef.current = updatedMessages

        // 只有非加载状态的消息才保存到本地存储
        if (!isLoading) {
          saveMessagesDebounced(updatedMessages)
        }

        return updatedMessages
      })

      return newMessage
    },
    [createMessageObject, saveMessagesDebounced]
  )

  // 更新消息内容
  const updateMessage = useCallback(
    (messageId: string, content: string, isLoading = false) => {
      setMessages(prevMessages => {
        // 找到消息索引
        const messageIndex = prevMessages.findIndex(msg => msg.id === messageId)

        if (messageIndex === -1) {
          console.warn(`Message with id ${messageId} not found`)
          return prevMessages
        }

        // 创建更新后的消息数组
        const updatedMessages = [...prevMessages]
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          text: content,
          isLoading
        }

        messagesRef.current = updatedMessages

        // 只有非加载状态的消息才保存到本地存储
        if (!isLoading) {
          saveMessagesDebounced(updatedMessages)
        }

        return updatedMessages
      })
    },
    [saveMessagesDebounced]
  )

  // 准备发送给 GPT 的消息上下文
  const prepareMessagesForGPT = useCallback((): {
    role: MessageRole
    content: string
  }[] => {
    // 过滤掉加载中的消息，并限制数量
    const contextMessages = messagesRef.current
      .filter(msg => !msg.isLoading)
      .slice(-MAX_CONTEXT_MESSAGES)
      .map(msg => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as MessageRole,
        content: msg.text
      }))

    // 添加系统提示
    return [
      {
        role: 'system' as MessageRole,
        content: doctor.prompt
      },
      ...contextMessages
    ]
  }, [doctor.prompt])

  // 发送医生的介绍
  const sendDoctorIntroduction = useCallback(async () => {
    if (introductionSentRef.current) return

    setIsTyping(true)
    introductionSentRef.current = true

    try {
      const response = await chat({
        messages: [
          {
            role: 'system' as MessageRole,
            content: doctor.prompt
          },
          {
            role: 'user' as MessageRole,
            content: '请介绍你自己。'
          }
        ]
      })

      if (!response || !response.choices || response.choices.length === 0) {
        throw new Error('Invalid response from GPT')
      }

      const introduction = response.choices[0].message.content
      addMessage(introduction, 'counselor')
    } catch (error) {
      console.error('Error sending doctor introduction:', error)
      addMessage(
        'Sorry, something went wrong. Please try again later.',
        'counselor'
      )
    } finally {
      setIsTyping(false)
    }
  }, [addMessage, doctor.prompt])

  // 如果是第一次聊天，发送医生的介绍
  useEffect(() => {
    if (!hasLoadedRef.current) return
    if (messages.length === 0 && !introductionSentRef.current) {
      sendDoctorIntroduction()
    }
  }, [messages.length, sendDoctorIntroduction])

  // 发送消息
  const sendMessage = useCallback(
    async (content: string) => {
      // 防止重复处理
      if (isProcessingRef.current) {
        console.log('Message is being processed, please wait...')
        return
      }

      let userMessageId: string | null = null
      let gptLoadingMessageId: string | null = null
      let hasError = false

      try {
        isProcessingRef.current = true
        setIsUserTyping(true)

        // 添加用户消息（不带加载状态）
        const userMessage = addMessage(content, 'user', false)
        userMessageId = userMessage.id
        setIsUserTyping(false)

        // 显示正在输入状态
        setIsTyping(true)

        // 添加GPT正在输入的消息
        const gptLoadingMessage = addMessage('', 'counselor', true)
        gptLoadingMessageId = gptLoadingMessage.id

        // 准备发送给 GPT 的消息
        const messagesToSend = [
          ...prepareMessagesForGPT(),
          {
            role: 'user' as MessageRole,
            content // 添加当前用户消息
          }
        ]

        // 使用单独的作用域处理流式响应
        try {
          let finalResponse = ''

          await chat({
            messages: messagesToSend,
            onStreamUpdate: streamContent => {
              // 流式更新 GPT 消息内容
              if (gptLoadingMessageId && !hasError) {
                finalResponse = streamContent
                updateMessage(gptLoadingMessageId, streamContent, true)
              }
            }
          })

          // 流式输出完成后，将消息标记为完成
          if (gptLoadingMessageId) {
            updateMessage(gptLoadingMessageId, finalResponse, false)
          }
        } catch (streamError) {
          hasError = true
          console.error('Stream error:', streamError)

          // 处理流式响应错误
          if (gptLoadingMessageId) {
            updateMessage(
              gptLoadingMessageId,
              '抱歉，我遇到了一些问题。请稍后再试。',
              false
            )
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        hasError = true

        // 更新错误状态的消息
        setMessages(prevMessages => {
          const newMessages = prevMessages.map(msg => {
            if (msg.isLoading) {
              if (msg.sender === 'counselor') {
                return {
                  ...msg,
                  text: '抱歉，我遇到了一些问题。请稍后再试。',
                  isLoading: false
                }
              }
            }
            return msg
          })

          messagesRef.current = newMessages
          saveMessagesDebounced(newMessages)
          return newMessages
        })
      } finally {
        // 隐藏正在输入状态
        setIsTyping(false)
        isProcessingRef.current = false
        setIsUserTyping(false)
      }
    },
    [addMessage, updateMessage, prepareMessagesForGPT, saveMessagesDebounced]
  )

  // 清除所有消息
  const clearMessages = useCallback(() => {
    setMessages([])
    messagesRef.current = []

    if (doctor?.id) {
      const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
      localStorage.removeItem(storageKey)
    }

    introductionSentRef.current = false
    chatIdRef.current = `${doctor.id}-${Date.now()}`
  }, [doctor?.id])

  return {
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    isUserTyping,
    chatId: chatIdRef.current
  }
}
