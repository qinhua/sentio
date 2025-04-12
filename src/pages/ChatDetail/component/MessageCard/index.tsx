import React, { useEffect } from 'react'
import { Avatar } from 'antd-mobile'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'
import { EnumUserGender } from '@/enum/common'
import { MessageItem } from '../../types'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import styles from './index.module.scss'

interface MessageCardProps {
  data: MessageItem
  className?: string
  onClick?: (data: MessageItem) => void
  onRetry?: () => void
}

const MessageCard: React.FC<MessageCardProps> = ({
  data,
  className,
  onClick,
  onRetry
}) => {
  const { isLoading, isFirstOfDay, avatar, gender, sender, text, date, time } =
    data
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech()
  const isError =
    text.includes('Sorry, something went wrong') ||
    text.includes('Message send failed')

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
      speak(text, gender)
    }
  }

  const handleRetryClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRetry) {
      onRetry()
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
              [styles.loadingBubble]: isLoading && !text,
              [styles.errorBubble]: isError
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
                {isError && onRetry && (
                  <button
                    className={styles.retryButton}
                    onClick={handleRetryClick}
                    title="重试"
                  >
                    <Icon icon="mdi:refresh" className={styles.retryIcon} />
                  </button>
                )}
                {sender === 'counselor' && text && !isError && (
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
