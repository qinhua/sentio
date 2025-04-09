import { useState, useCallback } from 'react'

export interface Message {
  id: string
  content: string
  type: 'text' | 'voice'
  isUser: boolean
  timestamp: number
}

export const useMessage = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = useCallback(
    (content: string, type: 'text' | 'voice' = 'text') => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        type,
        isUser: true,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, newMessage])
    },
    []
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    sendMessage,
    clearMessages
  }
}
