import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Input, Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import styles from './index.module.scss'
import MessageCard from './component/MessageCard'

export interface MessageItem {
  id: number
  sender: 'counselor' | 'user'
  text: string
  time: string
  date: string
  isFirstOfDay: boolean
}

const ChatDetail: React.FC = () => {
  const [message, setMessage] = useState('')
  const messageListRef = useRef<HTMLDivElement>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingText, setRecordingText] = useState('')
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      sender: 'counselor',
      text: '你好，我是张雅琪，温柔倾听型心理咨询师。很高兴能和你交流，请告诉我你最近的困扰或想聊的话题。',
      time: '17:02',
      date: '2025年4月6日星期日',
      isFirstOfDay: true
    },
    {
      id: 2,
      sender: 'user',
      text: '张老师您好，我最近工作压力很大，经常感到焦虑，晚上也很难入睡。',
      time: '17:05',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 3,
      sender: 'counselor',
      text: '我能理解你的感受。工作压力和睡眠问题确实会让人感到焦虑。你能具体描述一下是什么样的工作压力让你感到特别困扰吗？',
      time: '17:08',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 4,
      sender: 'user',
      text: '主要是项目deadline很紧，我担心完不成任务。而且我是团队负责人，如果我做不好，会连累整个团队。这种责任感让我感到很大压力。',
      time: '17:12',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 5,
      sender: 'counselor',
      text: '作为团队负责人，你承担了很大的责任，这份责任感是很珍贵的品质。不过，过度的责任感有时也会转化为不必要的压力。你有没有尝试过一些减压的方法？',
      time: '17:15',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 6,
      sender: 'user',
      text: '我试过深呼吸和冥想，但效果不太明显。工作一忙起来就顾不上了。',
      time: '17:18',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 7,
      sender: 'counselor',
      text: "了解。深呼吸和冥想确实需要一定的坚持才能看到效果。我想给你推荐一种情绪管理方法，叫'5-4-3-2-1'感官练习，它可以帮助你在紧张时快速回到当下。",
      time: '17:22',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 8,
      sender: 'counselor',
      text: '具体做法是：找出你能看到的5样东西，能听到的4种声音，能触摸到的3样物品，能闻到的2种气味，和能尝到的1种味道。这个练习可以帮助你将注意力从焦虑中转移出来。',
      time: '17:23',
      date: '2025年4月6日星期日',
      isFirstOfDay: false
    },
    {
      id: 9,
      sender: 'counselor',
      text: '您好，关于上次我们讨论的情绪管理方法，您有尝试过吗？',
      time: '09:45',
      date: '2025年4月7日星期一',
      isFirstOfDay: true
    }
  ])
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  // const handleSendMessage = () => {
  //   if (message.trim() === '') return
  //   const newMessage: MessageItem = {
  //     id: messages.length + 1,
  //     sender: 'user',
  //     text: message,
  //     time: new Date().toLocaleTimeString('zh-CN', {
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     }),
  //     date: new Date().toLocaleDateString('zh-CN', {
  //       year: 'numeric',
  //       month: 'numeric',
  //       day: 'numeric',
  //       weekday: 'long'
  //     }),
  //     isFirstOfDay: false
  //   }
  //   setMessages([...messages, newMessage])
  //   setMessage('')
  // }

  const handleFileClick = () => {
    console.log('file')
  }
  const handleMicClick = () => {
    console.log('mic')
    setIsRecording(true)
  }
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedDoctor) return
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
    // 添加用户消息
    const newUserMessage = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user' as const,
      timestamp: currentTime
    }
    setMessages([...messages, newUserMessage])
    setInputMessage('')
    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        '我理解你的感受，能详细说说这件事是怎么发生的吗？',
        '听起来这个情况对你影响很大，你觉得最让你困扰的部分是什么？',
        '这确实是个复杂的情况，我们可以一起探索一下背后的原因。你之前有没有遇到过类似的情况？',
        '谢谢你的分享。面对这样的情况，你通常会怎么应对呢？',
        '我注意到你提到了这个问题，你能告诉我当时的感受是什么样的吗？'
      ]
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)]
      const newDoctorMessage = {
        id: messages.length + 2,
        content: randomResponse,
        sender: 'doctor' as const,
        timestamp: currentTime
      }
      setMessages(prevMessages => [...prevMessages, newDoctorMessage])
    }, 1000)
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  // 模拟录音波形动画效果
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording) {
      let dots = 0
      timer = setInterval(() => {
        dots = (dots + 1) % 4
        setRecordingText(`正在录音${'.'.repeat(dots)}`)
      }, 500)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRecording])

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

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
            src="https://readdy.ai/api/search-image?query=Professional male Chinese psychologist portrait, mid 30s, warm smile, glasses, soft lighting, high quality portrait, isolated on light background, centered composition, realistic style&width=80&height=80&seq=11&orientation=squarish"
            alt="张雅琪"
          />
          <div className={styles.info}>
            <div className={styles.name}>张雅琪</div>
            <div
              className={styles.style}
              style={{
                backgroundColor: 'red'
              }}
            >
              温柔倾听型
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
      </div>

      {/* 底部输入区域 */}
      <div className={styles.inputArea}>
        <div className={styles.fileButton} onClick={handleFileClick}>
          <Icon icon="fa-solid:paperclip" />
        </div>
        <div className={styles.micButton} onClick={handleMicClick}>
          <Icon icon="fa-solid:microphone" />
        </div>
        <Input
          className={styles.inputer}
          value={message}
          onChange={val => setMessage(val)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message…"
        />
        <div
          className={styles.sendButton}
          style={{ opacity: message.trim() === '' ? 0.5 : 1 }}
          onClick={handleSendMessage}
        >
          <Icon icon="fa-solid:paper-plane" />
        </div>
      </div>
    </div>
  )
}

export default ChatDetail
