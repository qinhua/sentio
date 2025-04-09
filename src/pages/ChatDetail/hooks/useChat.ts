import { useState, useCallback } from 'react'
import { MessageItem } from '../types'
import dayjs from 'dayjs'

// @ts-ignore
export const useChat = (doctor: any) => {
  const [messages, setMessages] = useState<MessageItem[]>([])

  const sendMessage = useCallback(
    (content: string) => {
      const now = dayjs()
      const newMessage: MessageItem = {
        id: Date.now(),
        sender: 'user',
        text: content,
        date: now.format('YYYY-MM-DD'),
        time: now.format('HH:mm'),
        isFirstOfDay:
          messages.length === 0 ||
          messages[messages.length - 1].date !== now.format('YYYY-MM-DD')
      }

      setMessages(prev => [...prev, newMessage])
    },
    [messages]
  )

  return {
    messages,
    sendMessage
  }
}
