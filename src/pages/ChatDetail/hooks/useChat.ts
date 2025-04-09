import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageItem, DoctorItem } from '../types'
import dayjs from 'dayjs'
import { chat } from '@/services/gpt'
import { useAuthProviderContext } from '@/providers/AuthProvider'

type MessageRole = 'system' | 'user' | 'assistant'

const STORAGE_KEY_PREFIX = 'chat_history_'

export const useChat = (doctor: DoctorItem) => {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const messagesRef = useRef<MessageItem[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const isProcessingRef = useRef(false)
  const { profile } = useAuthProviderContext()
  const hasLoadedRef = useRef(false)
  const introductionSentRef = useRef(false)

  // 保存消息到本地存储
  const saveMessages = useCallback(
    (newMessages: MessageItem[]) => {
      const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
      localStorage.setItem(storageKey, JSON.stringify(newMessages))
    },
    [doctor?.id]
  )

  const addMessage = useCallback(
    (content: string, sender: 'user' | 'counselor', isLoading = false) => {
      const now = dayjs()
      const newMessage: MessageItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender,
        text: content,
        time: now.format('HH:mm'),
        date: now.format('YYYY/MM/DD'),
        isFirstOfDay:
          messagesRef.current.length === 0 ||
          !dayjs(
            messagesRef.current[messagesRef.current.length - 1].date
          ).isSame(now, 'day'),
        avatar:
          sender === 'counselor' ? doctor?.avatar : profile?.avatar_url || '',
        isLoading
      }

      setMessages(prevMessages => {
        const newMessages = [...prevMessages, newMessage]
        messagesRef.current = newMessages
        if (!isLoading) {
          saveMessages(newMessages)
        }
        return newMessages
      })

      return newMessage
    },
    [saveMessages, doctor?.avatar, profile?.avatar_url]
  )

  // 更新消息内容
  const updateMessage = useCallback(
    (messageId: string, content: string, isLoading = false) => {
      setMessages(prevMessages => {
        const newMessages = prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, text: content, isLoading } : msg
        )
        messagesRef.current = newMessages
        if (!isLoading) {
          saveMessages(newMessages)
        }
        return newMessages
      })
    },
    [saveMessages]
  )

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
            content: 'Please introduce yourself.'
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
      addMessage('抱歉，我遇到了一些问题。请稍后再试。', 'counselor')
    } finally {
      setIsTyping(false)
    }
  }, [addMessage, doctor])

  // 从本地存储加载消息历史
  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
    const storedMessages = localStorage.getItem(storageKey)

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        setMessages(parsedMessages)
        messagesRef.current = parsedMessages
        introductionSentRef.current = true
      } catch (error) {
        console.error('Error parsing stored messages:', error)
        setMessages([])
        messagesRef.current = []
        introductionSentRef.current = false
      }
    } else {
      setMessages([])
      messagesRef.current = []
      introductionSentRef.current = false
    }
  }, [doctor?.id])

  // 如果是第一次聊天，发送医生的介绍
  useEffect(() => {
    if (!hasLoadedRef.current) return
    if (messages.length === 0 && !introductionSentRef.current) {
      sendDoctorIntroduction()
    }
  }, [messages.length, sendDoctorIntroduction])

  const sendMessage = useCallback(
    async (content: string) => {
      if (isProcessingRef.current) {
        console.log('Message is being processed, please wait...')
        return
      }

      let userMessageId: string | null = null
      let gptLoadingMessageId: string | null = null

      try {
        isProcessingRef.current = true
        setIsUserTyping(true)

        // 添加用户消息（带加载状态）
        const userMessage = addMessage(content, 'user', true)
        userMessageId = userMessage.id

        // 立即更新用户消息，移除加载状态
        updateMessage(userMessageId, content, false)
        setIsUserTyping(false)

        // 显示正在输入状态
        setIsTyping(true)

        // 添加GPT正在输入的消息
        const gptLoadingMessage = addMessage('', 'counselor', true)
        gptLoadingMessageId = gptLoadingMessage.id

        // 准备发送给 GPT 的消息，确保消息顺序正确
        const messagesToSend = [
          {
            role: 'system' as MessageRole,
            content: doctor.prompt
          },
          ...messagesRef.current
            .filter(msg => !msg.isLoading && msg.id !== userMessageId) // 排除加载中的消息和当前用户消息
            .map(msg => ({
              role: (msg.sender === 'user'
                ? 'user'
                : 'assistant') as MessageRole,
              content: msg.text
            })),
          {
            role: 'user' as MessageRole,
            content: content // 使用原始内容而不是从消息中获取
          }
        ]

        // 调用 GPT API 并处理流式响应
        let finalResponse = ''
        let hasError = false

        try {
          await chat({
            messages: messagesToSend,
            onStreamUpdate: streamContent => {
              // 更新 GPT 消息内容，但在流式输出时保持 isLoading 为 true
              if (gptLoadingMessageId && !hasError) {
                finalResponse = streamContent
                updateMessage(gptLoadingMessageId, streamContent, true)
              }
            }
          })
        } catch (streamError) {
          hasError = true
          console.error('Stream error:', streamError)
          throw streamError // 重新抛出错误以便外层 catch 块处理
        }

        // 流式输出完成后，将最后一条消息的 isLoading 设置为 false
        if (gptLoadingMessageId && !hasError) {
          // 使用最终响应内容，而不是从消息列表中获取
          updateMessage(gptLoadingMessageId, finalResponse, false)
        }
      } catch (error) {
        console.error('Error sending message:', error)

        // 更新错误状态的消息，确保消息分配给正确的发送者
        setMessages(prevMessages => {
          const newMessages = prevMessages.map(msg => {
            // 只处理加载中的消息
            if (msg.isLoading) {
              // 根据发送者类型设置不同的错误消息
              if (msg.sender === 'user') {
                return {
                  ...msg,
                  text: '消息发送失败，请重试',
                  isLoading: false
                }
              } else if (msg.sender === 'counselor') {
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
          saveMessages(newMessages)
          return newMessages
        })
      } finally {
        // 隐藏正在输入状态
        setIsTyping(false)
        isProcessingRef.current = false
        setIsUserTyping(false)
      }
    },
    [addMessage, updateMessage, doctor.prompt, saveMessages]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    messagesRef.current = []
    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
    localStorage.removeItem(storageKey)
    introductionSentRef.current = false
  }, [doctor.id])

  return {
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    isUserTyping
  }
}
