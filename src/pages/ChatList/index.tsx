import React, { useMemo, useState, useRef } from 'react'
import { SearchBar, Empty, InputRef } from 'antd-mobile'
import ChatCard from './component/ChatCard'
import { DoctorItem } from '../ChatDetail/types'
import { useChatList } from './hooks/useChatList'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/constants/path'
import styles from './index.module.scss'

export interface ChatItem extends DoctorItem {
  chat_id: number
  last_message: string
  time: number
  unread: number
}

const ChatList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<InputRef | null>(null)
  const navigate = useNavigate()
  const { searchChats } = useChatList()

  const filteredChats = useMemo(() => {
    return searchChats(searchQuery)
  }, [searchQuery, searchChats])

  const handleOnSearch = (val: string) => {
    setSearchQuery(val)
  }

  const handleOnClick = (chat: any) => {
    navigate(PATH.chatDetail(chat.chat_id), {
      state: {
        doctor: {
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar,
          style: chat.style,
          color: chat.color,
          method: chat.method,
          expertise: chat.expertise,
          bio: chat.bio,
          prompt_style: chat.prompt_style,
          prompt: chat.prompt
        }
      }
    })
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
                key={chat.chat_id}
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
