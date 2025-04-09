import React, { useEffect } from 'react'
import { Avatar } from 'antd-mobile'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'
import { MessageItem } from '../../types'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
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
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech()

  // 监听页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSpeaking) {
        stopSpeaking()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isSpeaking, stopSpeaking])

  const handleSpeakClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发卡片的点击事件
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(text)
    }
  }

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
              [styles.loadingBubble]: isLoading && !text
            })}
          >
            {isLoading && !text ? (
              <div className={styles.loadingIndicator}>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
              </div>
            ) : (
              <>
                <div className={styles.messageText}>
                  {text || (isLoading ? '正在思考...' : '')}
                </div>
                {sender === 'counselor' && text && (
                  <button
                    className={classNames(styles.speakButton, {
                      [styles.speaking]: isSpeaking
                    })}
                    onClick={handleSpeakClick}
                    title={isSpeaking ? 'Pause' : 'Play'}
                  >
                    <Icon
                      icon={isSpeaking ? 'mdi:pause' : 'mdi:play'}
                      className={styles.speakIcon}
                    />
                  </button>
                )}
              </>
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

// 使用 React.memo 包装组件，避免不必要的重新渲染
export default React.memo(MessageCard)
