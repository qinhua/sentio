import React from 'react'
import { Avatar, Tag } from 'antd-mobile'
import { MessageItem } from '../../types'
import classNames from 'classnames'
import dayjs from 'dayjs'
import styles from './index.module.scss'

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
  const { isLoading, isFirstOfDay, avatar, sender, text, date, time } = data
  console.log('MessageCard rendering:', { sender, text, avatar }) // 添加日志

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
        className={classNames(styles.messageCardWrapper, {
          [styles.userMessage]: sender === 'user'
        })}
      >
        {sender === 'counselor' && (
          <Avatar className={styles.avatar} src={avatar} alt="avatar" />
        )}
        {sender === 'user' && (
          <Avatar className={styles.avatar} src={avatar} alt="user avatar" />
        )}
        <div className={styles.messageContent}>
          <div
            className={classNames(styles.bubble, {
              [styles.userBubble]: sender === 'user',
              [styles.counselorBubble]: sender === 'counselor',
              [styles.loadingBubble]: isLoading
            })}
          >
            {isLoading ? (
              <div className={styles.loadingIndicator}>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
              </div>
            ) : (
              text
            )}
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
