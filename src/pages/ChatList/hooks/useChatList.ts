import { useState, useEffect, useCallback } from 'react'
import { EnumUserGender } from '@/enum/common'
import { ChatItem } from '../types'
import dayjs from 'dayjs'

const STORAGE_KEY = 'chat_list'
const MAX_CHATS = 50 // 限制聊天列表最大数量

export const useChatList = () => {
  const [chatList, setChatList] = useState<ChatItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从本地存储加载聊天列表
  useEffect(() => {
    const loadChatList = () => {
      try {
        const storedChats = localStorage.getItem(STORAGE_KEY)
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats) as ChatItem[]

          // 验证数据格式
          if (Array.isArray(parsedChats)) {
            // 确保所有必需字段都存在，并按时间排序
            const validChats = parsedChats
              .filter(
                chat =>
                  chat &&
                  typeof chat.chat_id === 'number' &&
                  typeof chat.name === 'string'
              )
              .sort((a, b) => b.time - a.time)

            setChatList(validChats)
          } else {
            console.error('Stored chat list is not an array')
            setChatList([])
          }
        }
      } catch (error) {
        console.error('Error loading stored chat list:', error)
        setChatList([])
      } finally {
        setIsLoaded(true)
      }
    }

    loadChatList()
  }, [])

  // 保存聊天列表到本地存储
  const saveChatList = useCallback((chats: ChatItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error('Error saving chat list to localStorage:', error)
    }
  }, [])

  // 添加或更新聊天
  const updateChat = useCallback(
    (chat: Partial<ChatItem> & { chat_id: number }) => {
      if (!isLoaded) {
        console.warn('Chat list not loaded yet, update postponed')
        return
      }

      setChatList(prevList => {
        const index = prevList.findIndex(item => item.chat_id === chat.chat_id)
        let newList: ChatItem[]

        const now = Date.now()

        if (index === -1) {
          // 确保新聊天有所有必需字段
          const newChat: ChatItem = {
            chat_id: chat.chat_id,
            id: chat.id || chat.chat_id,
            name: chat.name || 'Unknown',
            gender: chat.gender || EnumUserGender.OTHER,
            avatar: chat.avatar || '',
            style: chat.style || '',
            color: chat.color || '#ccc',
            method: chat.method || '',
            expertise: chat.expertise || [],
            bio: chat.bio || '',
            prompt_style: chat.prompt_style || [],
            prompt: chat.prompt || '',
            last_message: chat.last_message || '',
            time: chat.time || now,
            unread: chat.unread || 0
          }

          // 添加到列表开头
          newList = [newChat, ...prevList]

          // 如果超过最大数量，移除最旧的聊天
          if (newList.length > MAX_CHATS) {
            newList = newList.slice(0, MAX_CHATS)
          }
        } else {
          // 更新现有聊天
          newList = [...prevList]

          // 只更新提供的字段
          newList[index] = {
            ...newList[index],
            ...chat,
            // 确保更新时间戳
            time: chat.time || now
          }

          // 根据最新更新时间重新排序
          newList.sort((a, b) => b.time - a.time)
        }

        // 保存到本地存储
        saveChatList(newList)
        return newList
      })
    },
    [saveChatList, isLoaded]
  )

  // 删除聊天
  const deleteChat = useCallback(
    (chatId: number) => {
      if (!isLoaded) return

      setChatList(prevList => {
        const newList = prevList.filter(chat => chat.chat_id !== chatId)

        // 删除对应的聊天历史
        try {
          localStorage.removeItem(`chat_history_${chatId}`)
        } catch (error) {
          console.error(
            `Error deleting chat history for chat ${chatId}:`,
            error
          )
        }

        saveChatList(newList)
        return newList
      })
    },
    [saveChatList, isLoaded]
  )

  // 标记聊天为已读
  const markAsRead = useCallback(
    (chatId: number) => {
      if (!isLoaded) return

      setChatList(prevList => {
        const newList = prevList.map(chat =>
          chat.chat_id === chatId ? { ...chat, unread: 0 } : chat
        )
        saveChatList(newList)
        return newList
      })
    },
    [saveChatList, isLoaded]
  )

  // 搜索聊天
  const searchChats = useCallback(
    (query: string) => {
      if (!query) return chatList

      const lowercaseQuery = query.toLowerCase()
      return chatList.filter(
        chat =>
          chat.name.toLowerCase().includes(lowercaseQuery) ||
          (chat.last_message &&
            chat.last_message.toLowerCase().includes(lowercaseQuery))
      )
    },
    [chatList]
  )

  // 清理所有聊天数据
  const clearAllChats = useCallback(() => {
    try {
      // 清除聊天列表
      localStorage.removeItem(STORAGE_KEY)

      // 清除所有聊天历史
      chatList.forEach(chat => {
        try {
          localStorage.removeItem(`chat_history_${chat.chat_id}`)
        } catch (error) {
          console.error(
            `Error clearing history for chat ${chat.chat_id}:`,
            error
          )
        }
      })

      setChatList([])
    } catch (error) {
      console.error('Error clearing all chats:', error)
    }
  }, [chatList])

  // 获取聊天对象
  const getChatById = useCallback(
    (chatId: number) => {
      return chatList.find(chat => chat.chat_id === chatId) || null
    },
    [chatList]
  )

  // 格式化聊天时间
  const formatChatTime = useCallback((timestamp: number) => {
    const now = dayjs()
    const messageTime = dayjs(timestamp)

    if (now.isSame(messageTime, 'day')) {
      return messageTime.format('HH:mm')
    } else if (now.subtract(1, 'day').isSame(messageTime, 'day')) {
      return '昨天'
    } else if (now.isSame(messageTime, 'year')) {
      return messageTime.format('MM/DD')
    } else {
      return messageTime.format('YYYY/MM/DD')
    }
  }, [])

  return {
    chatList,
    updateChat,
    deleteChat,
    markAsRead,
    searchChats,
    clearAllChats,
    getChatById,
    formatChatTime,
    isLoaded
  }
}
