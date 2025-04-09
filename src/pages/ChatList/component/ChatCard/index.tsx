import React from 'react'
import { Avatar, Tag } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import { ChatItem } from '../../index'
interface ChatCardProps {
  data: ChatItem
  className?: string
  onClick?: (data: ChatItem) => void
}

const ChatCard: React.FC<ChatCardProps> = ({ data, className, onClick }) => {
  const { avatar, name, style, color, last_message, unread, time } = data

  return (
    <div
      className={classNames('chat-card', styles.chatCard, className)}
      onClick={onClick ? () => onClick(data) : undefined}
    >
      <div className={styles.leftCon}>
        <Avatar className={styles.avatar} src={avatar} alt="doctor avatar" />
      </div>
      <div className={styles.middleCon}>
        <div className={styles.nameCon}>
          <div className={styles.nameWrap}>
            <h2 className={styles.name}>{name}</h2>
            <Tag
              className={styles.style}
              style={{
                color: '#fff',
                '--background-color': color,
                '--border-color': color
              }}
            >
              {style}
            </Tag>
          </div>

          <p className={styles.time}>
            {dayjs(time).format('YYYY/MM/DD HH:mm:ss')}
          </p>
        </div>

        <p className={styles.message}>{last_message}</p>
      </div>
      {/* <div className={styles.rightCon}>
        <p className={styles.time}>
          {dayjs(time).format('YYYY/MM/DD HH:mm:ss')}
        </p>
        <div className={styles.unread}>{unread}</div>
      </div> */}
    </div>
  )
}

export default ChatCard
