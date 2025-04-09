import { useState, useEffect, useCallback } from 'react'
import { ChatItem } from '../types'

const STORAGE_KEY = 'chat_list'

export const useChatList = () => {
  const [chatList, setChatList] = useState<ChatItem[]>([])

  // 从本地存储加载聊天列表
  useEffect(() => {
    const storedChats = localStorage.getItem(STORAGE_KEY)
    if (storedChats) {
      try {
        setChatList(JSON.parse(storedChats))
      } catch (error) {
        console.error('Error parsing stored chat list:', error)
        setChatList([])
      }
    }
  }, [])

  // 保存聊天列表到本地存储
  const saveChatList = useCallback((chats: ChatItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  }, [])

  // 添加或更新聊天
  const updateChat = useCallback(
    (chat: ChatItem) => {
      setChatList(prevList => {
        const index = prevList.findIndex(item => item.chat_id === chat.chat_id)
        let newList: ChatItem[]

        if (index === -1) {
          // 新聊天
          newList = [chat, ...prevList]
        } else {
          // 更新现有聊天
          newList = [...prevList]
          newList[index] = {
            ...newList[index],
            last_message: chat.last_message,
            time: chat.time,
            unread: chat.unread
          }
        }

        saveChatList(newList)
        return newList
      })
    },
    [saveChatList]
  )

  // 删除聊天
  const deleteChat = useCallback(
    (chatId: number) => {
      setChatList(prevList => {
        const newList = prevList.filter(chat => chat.chat_id !== chatId)
        saveChatList(newList)
        return newList
      })
    },
    [saveChatList]
  )

  // 标记聊天为已读
  const markAsRead = useCallback(
    (chatId: number) => {
      setChatList(prevList => {
        const newList = prevList.map(chat =>
          chat.chat_id === chatId ? { ...chat, unread: 0 } : chat
        )
        saveChatList(newList)
        return newList
      })
    },
    [saveChatList]
  )

  // 搜索聊天
  const searchChats = useCallback(
    (query: string) => {
      if (!query) return chatList

      const lowercaseQuery = query.toLowerCase()
      return chatList.filter(
        chat =>
          chat.name.toLowerCase().includes(lowercaseQuery) ||
          chat.last_message.toLowerCase().includes(lowercaseQuery)
      )
    },
    [chatList]
  )

  return {
    chatList,
    updateChat,
    deleteChat,
    markAsRead,
    searchChats
  }
}
