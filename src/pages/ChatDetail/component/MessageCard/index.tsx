import React from 'react'
import { Avatar, Tag } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import { MessageItem } from '../../index'

interface MessageCardProps {
  data: MessageItem
  className?: string
  onClick?: (data: MessageItem) => void
}

const MessageCard: React.FC<MessageCardProps> = ({
  data,
  className,
  onClick
}) => {
  const { isFirstOfDay, sender, text, message, date, time } = data

  return (
    <div
      className={classNames('message-card', styles.messageCard, className)}
      onClick={onClick ? () => onClick(data) : undefined}
    >
      {isFirstOfDay && (
        <div className={styles.dateDivider}>
          <span className={styles.dateText}>{date}</span>
        </div>
      )}
      <div
        className={`${styles.messageCardWrapper} ${
          sender === 'user' ? styles.userMessage : ''
        }`}
      >
        {sender === 'counselor' && (
          <Avatar
            className={styles.avatar}
            src="https://readdy.ai/api/search-image?query=Professional male Chinese psychologist portrait, mid 30s, warm smile, glasses, soft lighting, high quality portrait, isolated on light background, centered composition, realistic style&width=80&height=80&seq=11&orientation=squarish"
            alt="avatar"
          />
        )}
        {sender === 'user' && (
          <Avatar
            className={styles.avatar}
            src="https://public.readdy.ai/ai/img_res/56d87db85d3adf95ccda80beb0055e59.jpg"
            alt="user avatar"
          />
        )}
        <div className={styles.messageContent}>
          <div
            className={`${styles.bubble} ${
              sender === 'user' ? styles.userBubble : styles.counselorBubble
            }`}
          >
            {text}
          </div>
          <div className={styles.time}>
            {time}
            {/* {sender === 'user' && (
              <span style={{ marginLeft: '8px' }}>
                {index === messages.length - 1 ? '已读' : '已送达'}
              </span>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageCard
