import { useState, useEffect } from 'react'
import { MessageItem, Doctor } from '../types'
import dayjs from 'dayjs'

const STORAGE_KEY_PREFIX = 'chat_history_'

export const useChat = (doctor: Doctor) => {
  const [messages, setMessages] = useState<MessageItem[]>([])

  // 从本地存储加载消息历史
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
    const storedMessages = localStorage.getItem(storageKey)
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error('Error parsing stored messages:', error)
        setMessages([])
      }
    }
  }, [doctor.id])

  // 保存消息到本地存储
  const saveMessages = (newMessages: MessageItem[]) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
    localStorage.setItem(storageKey, JSON.stringify(newMessages))
  }

  const sendMessage = (content: string) => {
    const now = dayjs()
    const newMessage: MessageItem = {
      id: Date.now(),
      sender: 'user',
      text: content,
      time: now.format('HH:mm'),
      date: now.format('YYYY/MM/DD'),
      isFirstOfDay:
        messages.length === 0 ||
        !dayjs(messages[messages.length - 1].date).isSame(now, 'day')
    }

    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    saveMessages(newMessages)
  }

  const clearMessages = () => {
    setMessages([])
    const storageKey = `${STORAGE_KEY_PREFIX}${doctor.id}`
    localStorage.removeItem(storageKey)
  }

  return {
    messages,
    sendMessage,
    clearMessages
  }
}
