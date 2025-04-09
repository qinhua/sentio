import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageItem, Doctor } from '../types'
import dayjs from 'dayjs'
import { chat } from '@/services/gpt'
import { useAuthProviderContext } from '@/providers/AuthProvider'

type MessageRole = 'system' | 'user' | 'assistant'

const STORAGE_KEY_PREFIX = 'chat_history_'

export const useChat = (doctor: Doctor) => {
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
    [doctor.id]
  )

  const addMessage = useCallback(
    (content: string, sender: 'user' | 'counselor', isLoading = false) => {
      const now = dayjs()
      const newMessage: MessageItem = {
        id: Date.now(),
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
          sender === 'counselor' ? doctor.avatar : profile?.avatar_url || '',
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
    [saveMessages, doctor.avatar, profile?.avatar_url]
  )

  // 更新消息内容
  const updateMessage = useCallback(
    (messageId: number, content: string, isLoading = false) => {
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
            content: `You are a professional counselor named ${
              doctor.name
            }. Your expertise is in ${doctor.expertise.join(
              ', '
            )}. Your counseling style is ${
              doctor.style
            }. Please introduce yourself to the user in a warm and professional manner, mentioning your expertise and how you can help them. Keep your introduction concise but informative.`
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
  }, [addMessage, doctor.name, doctor.expertise, doctor.style])

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
  }, [doctor.id])

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

      let hasError = false
      let userMessageId: number | null = null

      try {
        isProcessingRef.current = true
        setIsUserTyping(true)

        // 添加用户消息（带加载状态）
        const userMessage = addMessage(content, 'user', true)
        userMessageId = userMessage.id

        // 模拟用户消息发送延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        // 更新用户消息，移除加载状态
        updateMessage(userMessageId, content, false)
        setIsUserTyping(false)

        // 显示正在输入状态
        setIsTyping(true)

        // 添加GPT正在输入的消息
        const gptLoadingMessage = addMessage('正在思考...', 'counselor', true)
        const gptLoadingMessageId = gptLoadingMessage.id

        // 准备发送给 GPT 的消息
        const messagesToSend = [
          {
            role: 'system' as MessageRole,
            content: `You are a professional counselor named ${
              doctor.name
            }. Your expertise is in ${doctor.expertise.join(
              ', '
            )}. Your counseling style is ${
              doctor.style
            }. Please provide counseling in a warm and professional manner, tailored to your expertise and style.`
          },
          ...messagesRef.current
            .filter(msg => !msg.isLoading) // 排除加载中的消息
            .map(msg => ({
              role: (msg.sender === 'user'
                ? 'user'
                : 'assistant') as MessageRole,
              content: msg.text
            })),
          {
            role: 'user' as MessageRole,
            content: userMessage.text
          }
        ]

        // 调用 GPT API
        const response = await chat({
          messages: messagesToSend
        })

        if (!response || !response.choices || response.choices.length === 0) {
          throw new Error('Invalid response from GPT')
        }

        // 更新 GPT 回应
        const gptResponse = response.choices[0].message.content
        updateMessage(gptLoadingMessageId, gptResponse, false)
      } catch (error) {
        console.error('Error sending message:', error)
        hasError = true

        // 如果有加载中的GPT消息，更新为错误消息
        const loadingMessage = messagesRef.current.find(
          msg => msg.isLoading && msg.sender === 'counselor'
        )
        if (loadingMessage) {
          updateMessage(
            loadingMessage.id,
            '抱歉，我遇到了一些问题。请稍后再试。',
            false
          )
        }
      } finally {
        // 隐藏正在输入状态
        setIsTyping(false)
        isProcessingRef.current = false
        setIsUserTyping(false)
      }
    },
    [
      addMessage,
      updateMessage,
      doctor.id,
      doctor.name,
      doctor.expertise,
      doctor.style
    ]
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
