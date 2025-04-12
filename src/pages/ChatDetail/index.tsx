import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { Avatar, Input, Toast, Dialog } from 'antd-mobile'
import MessageCard from './component/MessageCard'
import { Icon } from '@iconify/react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useChatList } from '../ChatList/hooks/useChatList'
import { useVoice } from './hooks/useVoice'
import { useChat } from './hooks/useChat'
import { useGPT } from './hooks/useGPT'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { DoctorItem } from './types'
import styles from './index.module.scss'

const ChatDetail: React.FC = () => {
  const location = useLocation()
  const doctor = location.state?.doctor as DoctorItem
  const messageListRef = useRef<HTMLDivElement>(null)
  const [inputMessage, setInputMessage] = useState('')
  const { isLoaded, updateChat, getChatById } = useChatList()
  const [isInitialized, setIsInitialized] = useState(false)
  const navigate = useNavigate()

  // 如果没有通过路由参数传递doctor，尝试从chatList获取
  useEffect(() => {
    if (!doctor && isLoaded) {
      const chatId = parseInt(location.pathname.split('/').pop() || '-1', 10)
      if (chatId > 0) {
        const chatItem = getChatById(chatId)
        if (chatItem) {
          // 构建doctor对象
          const foundDoctor: DoctorItem = {
            id: chatItem.id,
            name: chatItem.name,
            avatar: chatItem.avatar,
            style: chatItem.style,
            color: chatItem.color,
            method: chatItem.method,
            expertise: chatItem.expertise,
            bio: chatItem.bio,
            prompt_style: chatItem.prompt_style,
            prompt: chatItem.prompt
          }
          // 设置状态
          setDoctorState(foundDoctor)
        } else {
          // 找不到对应的聊天，返回列表页
          toast.error('Can not find the chat')
          navigate('/')
        }
      }
    } else if (doctor) {
      setIsInitialized(true)
    }
  }, [isLoaded, location.pathname, doctor, navigate, getChatById])

  // 设置医生状态
  const [doctorState, setDoctorState] = useState<DoctorItem | null>(
    doctor || null
  )

  const {
    isTyping,
    isUserTyping,
    messages,
    sendMessage: addMessage
  } = useChat(doctorState as DoctorItem)

  const {
    isRecording,
    recordingTime,
    transcribedText,
    isProcessing,
    startRecording,
    stopRecording,
    formatTime,
    clearTranscribedText
  } = useVoice()

  const { isLoading, error, sendMessage: sendGPTMessage } = useGPT()

  // 显示错误提示
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // 更新聊天列表
  useEffect(() => {
    if (messages.length > 0 && doctorState && isInitialized) {
      const lastMessage = messages[messages.length - 1]
      updateChat({
        chat_id: doctorState.id,
        ...doctorState,
        last_message: lastMessage.text,
        time: Date.now(),
        unread: lastMessage.sender === 'counselor' ? 1 : 0
      })
    }
  }, [messages, doctorState, updateChat, isInitialized])

  const handleBack = useCallback(() => {
    // 停止所有语音播放
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    navigate(-1)
  }, [navigate])

  const handleFileClick = useCallback(() => {
    console.log('file')
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!doctorState) {
      toast.error('Chat initialization failed')
      return
    }

    if (inputMessage.trim() === '') return

    const messageToSend = inputMessage.trim()
    setInputMessage('')

    try {
      // 添加用户消息
      await addMessage(messageToSend)

      // 获取 GPT 回复
      const response = await sendGPTMessage(messageToSend)
      if (response) {
        // GPT 回复由 useChat 中的流式更新处理，不需要这里添加
      }
    } catch (err) {
      console.error('Error sending message:', err)
      // 错误已经在 hooks 中处理
    }
  }, [inputMessage, addMessage, sendGPTMessage, doctorState])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  const handleVoiceRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording()
    } else {
      try {
        await startRecording()
      } catch (err) {
        Toast.show({
          content: 'Can not start recording, please check your microphone',
          position: 'center'
        })
      }
    }
  }, [isRecording, startRecording, stopRecording])

  const handleInputChange = useCallback((val: string) => {
    setInputMessage(val)
  }, [])

  // 当语音转文字完成时，自动发送消息
  useEffect(() => {
    if (transcribedText && !isProcessing) {
      setInputMessage(transcribedText)
      clearTranscribedText()
    }
  }, [transcribedText, isProcessing, clearTranscribedText])

  // 滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  // 监听页面可见性变化，在页面隐藏时停止语音播放
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 停止所有语音播放
        const speechSynthesis = window.speechSynthesis
        if (speechSynthesis) {
          speechSynthesis.cancel()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 重试发送消息
  const handleRetry = useCallback(async () => {
    // 清除之前的错误消息
    // 弹出提示，重新发起请求
    toast.info('正在重试...')
    try {
      await sendGPTMessage(messages[messages.length - 2]?.text || '')
    } catch (err) {
      console.error('Error retrying message:', err)
    }
  }, [messages, sendGPTMessage])

  // 使用 useMemo 缓存消息列表，避免不必要的重新渲染
  const messageCards = useMemo(() => {
    return messages.map(msg => (
      <MessageCard
        key={msg.id}
        data={msg}
        onRetry={msg.sender === 'counselor' ? handleRetry : undefined}
      />
    ))
  }, [messages, handleRetry])

  if (!doctorState) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.headerBar}>
        <Icon
          className={styles.backButton}
          icon="fa-solid:arrow-left"
          onClick={handleBack}
        />
        <div className={styles.doctorInfo}>
          <Avatar
            className={styles.avatar}
            src={doctorState.avatar}
            alt={doctorState.name}
          />
          <div className={styles.info}>
            <div className={styles.name}>{doctorState.name}</div>
            <div
              className={styles.style}
              style={{
                backgroundColor: doctorState.color
              }}
            >
              {doctorState.style}
            </div>
          </div>
        </div>
        <Icon className={styles.moreButton} icon="nrk:more" />
      </div>

      {/* 聊天内容区域 */}
      <div className={styles.messageList} ref={messageListRef}>
        {messageCards}
        {messages.length === 0 && isTyping && (
          <div className={styles.loadingMessage}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* 底部输入区域 */}
      <div className={styles.inputArea}>
        <button
          className={classNames(styles.actionButton, styles.fileButton, {
            [styles.disabled]: isRecording
          })}
          onClick={handleFileClick}
          disabled={isRecording}
        >
          <Icon icon="fa-solid:paperclip" />
        </button>
        <button
          className={classNames(styles.actionButton, styles.micButton, {
            [styles.recording]: isRecording
          })}
          onClick={handleVoiceRecording}
        >
          <Icon
            className={styles.micButtonIcon}
            icon={isRecording ? 'pajamas:stop' : 'fa-solid:microphone'}
          />
          {isRecording && (
            <span className={styles.recordingTime}>
              {formatTime(recordingTime)}
            </span>
          )}
        </button>
        <Input
          className={styles.inputer}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message…"
          disabled={isRecording || isProcessing || isLoading || isUserTyping}
        />
        <button
          className={classNames(styles.actionButton, styles.sendButton)}
          disabled={
            inputMessage.trim() === '' ||
            isRecording ||
            isProcessing ||
            isLoading ||
            isUserTyping ||
            !doctorState
          }
          onClick={handleSendMessage}
        >
          <Icon icon="fa-solid:paper-plane" />
        </button>
      </div>
    </div>
  )
}

export default React.memo(ChatDetail)
