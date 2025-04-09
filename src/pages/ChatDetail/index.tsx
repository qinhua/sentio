import React, { useRef, useEffect } from 'react'
import { Avatar, Input, Toast, Dialog } from 'antd-mobile'
import MessageCard from './component/MessageCard'
import { Icon } from '@iconify/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useChatList } from '../ChatList/hooks/useChatList'
import { useVoice } from './hooks/useVoice'
import { useChat } from './hooks/useChat'
import { useGPT } from './hooks/useGPT'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { Doctor } from './types'
import styles from './index.module.scss'

const ChatDetail: React.FC = () => {
  const location = useLocation()
  const doctor = location.state?.doctor as Doctor
  const messageListRef = useRef<HTMLDivElement>(null)
  const [inputMessage, setInputMessage] = React.useState('')
  const navigate = useNavigate()
  const { messages, sendMessage: addMessage } = useChat(doctor)
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
  const {
    isLoading,
    error,
    sendMessage: sendGPTMessage
    // sendVoiceMessage
  } = useGPT()
  const { updateChat } = useChatList()

  // 显示错误提示
  useEffect(() => {
    if (error) {
      toast.error(error)
      // Dialog.alert({
      //   content: error,
      //   closeOnMaskClick: true
      //   // actions: [
      //   //   {
      //   //     key: 'confirm',
      //   //     text: '我知道了',
      //   //     onClick: () => {
      //   //       // 可以在这里添加重试逻辑
      //   //     }
      //   //   }
      //   // ]
      // })
    }
  }, [error])

  // 更新聊天列表
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      updateChat({
        chat_id: doctor.id,
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        style: doctor.style,
        color: doctor.color,
        expertise: doctor.expertise,
        description: doctor.description,
        last_message: lastMessage.text,
        time: Date.now(),
        unread: lastMessage.sender === 'counselor' ? 1 : 0
      })
    }
  }, [messages, doctor, updateChat])

  const handleBack = () => {
    navigate(-1)
  }

  const handleFileClick = () => {
    console.log('file')
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    // 添加用户消息到界面
    addMessage(inputMessage)
    setInputMessage('')

    try {
      // 获取 GPT 回复
      const response = await sendGPTMessage(inputMessage)
      if (response) {
        // 添加 GPT 回复到界面
        addMessage(response)
      }
    } catch (err) {
      // 错误已经在 useGPT 中处理，这里不需要额外处理
      console.error('Error sending message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      try {
        await startRecording()
      } catch (err) {
        Toast.show({
          content: '无法启动语音识别，请检查麦克风权限',
          position: 'center'
        })
      }
    }
  }

  // 当语音转文字完成时，自动发送消息
  useEffect(() => {
    if (transcribedText && !isProcessing) {
      setInputMessage(transcribedText)
      // handleSendMessage()
      clearTranscribedText()
    }
  }, [transcribedText, isProcessing])

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  if (!doctor) {
    return null
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
            src={doctor.avatar}
            alt={doctor.name}
          />
          <div className={styles.info}>
            <div className={styles.name}>{doctor.name}</div>
            <div
              className={styles.style}
              style={{
                backgroundColor: doctor.color
              }}
            >
              {doctor.style}
            </div>
          </div>
        </div>
        <Icon className={styles.moreButton} icon="nrk:more" />
      </div>

      {/* 聊天内容区域 */}
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map(msg => (
          <MessageCard key={msg.id} data={msg} />
        ))}
        {isLoading && (
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
          onChange={val => setInputMessage(val)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message…"
          disabled={isRecording || isProcessing || isLoading}
        />
        <button
          className={classNames(styles.actionButton, styles.sendButton)}
          disabled={
            inputMessage.trim() === '' ||
            isRecording ||
            isProcessing ||
            isLoading
          }
          onClick={handleSendMessage}
        >
          <Icon icon="fa-solid:paper-plane" />
        </button>
      </div>
    </div>
  )
}

export default ChatDetail
