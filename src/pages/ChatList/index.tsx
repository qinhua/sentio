import React, { useMemo, useState, useRef } from 'react'
import { SearchBar, Empty, InputRef } from 'antd-mobile'
import ChatCard from './component/ChatCard'
import { DOCTOR_LIST } from 'src/constants/common'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/constants/path'
import { DoctorItem } from '../DoctorList'
import styles from './index.module.scss'

export interface ChatItem extends DoctorItem {
  chat_id: number
  last_message: string
  time: number
  unread: number
}

const ChatList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [chatList, setChatList] = useState<ChatItem[]>([
    {
      chat_id: 1,
      ...DOCTOR_LIST[0],
      last_message: '您好，关于上次我们讨论的情绪管理方法，您有尝试过吗？',
      time: Date.now(),
      unread: 2
    },
    {
      chat_id: 2,
      ...DOCTOR_LIST[1],
      last_message: '下周二下午三点，我们继续上次的沟通技巧训练，您看可以吗？',
      time: Date.now(),
      unread: 0
    },
    {
      chat_id: 3,
      ...DOCTOR_LIST[4],
      last_message: '呼吸练习做得如何？有没有感觉到焦虑有所缓解？',
      time: Date.now(),
      unread: 1
    },
    {
      chat_id: 4,
      ...DOCTOR_LIST[3],
      last_message:
        '家庭成员之间的理解和支持是很重要的，我们下次可以深入探讨。',
      time: Date.now(),
      unread: 0
    },
    {
      chat_id: 1,
      ...DOCTOR_LIST[0],
      last_message: '您好，关于上次我们讨论的情绪管理方法，您有尝试过吗？',
      time: Date.now(),
      unread: 2
    },
    {
      chat_id: 2,
      ...DOCTOR_LIST[1],
      last_message: '下周二下午三点，我们继续上次的沟通技巧训练，您看可以吗？',
      time: Date.now(),
      unread: 0
    },
    {
      chat_id: 3,
      ...DOCTOR_LIST[4],
      last_message: '呼吸练习做得如何？有没有感觉到焦虑有所缓解？',
      time: Date.now(),
      unread: 1
    },
    {
      chat_id: 4,
      ...DOCTOR_LIST[3],
      last_message:
        '家庭成员之间的理解和支持是很重要的，我们下次可以深入探讨。',
      time: Date.now(),
      unread: 0
    }
  ])
  const searchRef = useRef<InputRef | null>(null)
  const navigate = useNavigate()

  const filteredChats = useMemo(() => {
    return chatList.filter(chat => {
      if (!searchQuery) return true

      return (
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.last_message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery, chatList])

  const handleOnSearch = (val: string) => {
    setSearchQuery(val)
  }
  const handleOnClick = (chat: any) => {
    navigate(PATH.chatDetail(chat.chat_id))
  }

  return (
    <div className={styles.container}>
      {/* 搜索区域 */}
      <div className={styles.searchBar}>
        <SearchBar
          ref={searchRef}
          placeholder="Search"
          onChange={handleOnSearch}
        />
      </div>
      {/* 聊天列表 */}
      <div className={styles.chatListCon}>
        {filteredChats.length > 0 ? (
          <div className={styles.chatList}>
            {filteredChats.map(chat => (
              <ChatCard
                key={chat.id}
                data={chat}
                onClick={() => handleOnClick(chat)}
              />
            ))}
          </div>
        ) : (
          <Empty
            style={{ paddingTop: '70px' }}
            imageStyle={{ width: 80 }}
            description="No Results"
          />
        )}
      </div>
    </div>
  )
}
export default ChatList
