import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'

interface Doctor {
  id: string
  name: string
  avatar: string
  style: string
  expertise: string[]
  description: string
}
interface ChatHistory {
  doctorId: string
  lastMessage: string
  timestamp: string
  unread: number
}
interface UserProfile {
  name: string
  avatar: string
  gender: string
}
const DoctorList: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [messages, setMessages] = useState<
    {
      id: number
      content: string
      sender: 'user' | 'doctor'
      timestamp: string
    }[]
  >([])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingText, setRecordingText] = useState('')
  const [activeTab, setActiveTab] = useState<
    'doctors' | 'chats' | 'courses' | 'profile'
  >('doctors')
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '李明',
    avatar:
      'https://public.readdy.ai/ai/img_res/f21cdcf583957069f851986c4495d205.jpg',
    gender: '男'
  })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const doctors: Doctor[] = [
    {
      id: 'doc_lin',
      name: '林澜',
      avatar:
        'https://public.readdy.ai/ai/img_res/e9a889e1bce178310451dee451c2e09e.jpg',
      style: '温柔倾听型',
      expertise: ['焦虑', '情绪调节', '自我认同'],
      description:
        '人本主义疗法，擅长倾听、焦点、情绪调节、自我认同，你不需要立刻变得更好，你现在的样子已经很得被理解'
    },
    {
      id: 'doc_jiang',
      name: '江行',
      avatar:
        'https://public.readdy.ai/ai/img_res/56177e3f4cad7ed3873dbc5ba000a4e4.jpg',
      style: '理性分析型',
      expertise: ['职场压力', '思维困扰', '拖延'],
      description:
        '认知行为疗法（CBT），擅长倾听、积极应对、思维困扰，我们可以一起分析这种痛苦的想法，看看它是如何影响你的行为的'
    },
    {
      id: 'doc_zhou',
      name: '洛尘',
      avatar:
        'https://public.readdy.ai/ai/img_res/369a326c9b137031304a8dc0ba59ed81.jpg',
      style: '灵性启发型',
      expertise: ['自我探索', '情绪创伤', '存在困扰'],
      description:
        '正念疗法 + ACT，思考你的不满意之处的原因，简单先学会与痛苦的自己和平相处'
    },
    {
      id: 'doc_su',
      name: '苏桐',
      avatar:
        'https://public.readdy.ai/ai/img_res/4664bafa455026dcac68fc8b01b53f91.jpg',
      style: '温和教练型',
      expertise: ['亲密关系', '情绪表达', '人际沟通'],
      description:
        '叙事疗法，如果我们把一个问题看做是段关系，会不会有新的理解？'
    },
    {
      id: 'doc_chen',
      name: '黎晗',
      avatar:
        'https://public.readdy.ai/ai/img_res/13ac2cf5e2c0613bfe7a6eecec1c1ef6.jpg',
      style: '洞察深刻型',
      expertise: ['童年创伤', '反思情绪模式', '自我释放'],
      description:
        '精神分析，有时，你不是在回应现在的情境，而是在回应过去的伤口'
    }
  ]
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
    // 初始化对话
    setMessages([
      {
        id: 1,
        content: `你好，我是${doctor.name}，${doctor.style}心理咨询师。很高兴能和你交流，请告诉我你最近的困扰或想聊的话题。`,
        sender: 'doctor',
        timestamp: currentTime
      }
    ])
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
  const formatDate = () => {
    const today = new Date()
    return today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {!selectedDoctor ? (
        // 心理医生选择页面
        <div className="flex flex-col h-full">
          <div className="fixed top-0 w-full bg-white shadow-sm z-10 px-4 py-3">
            <h1 className="text-xl font-semibold text-center">
              选择你的心理医生
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1">
              {formatDate()}
            </p>
          </div>
          <div className="mt-20 mb-4 px-4">
            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="space-y-4 py-2">
                {doctors.map(doctor => (
                  <Card
                    key={doctor.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-full border-2 border-primary/10">
                        <AvatarImage
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {doctor.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">{doctor.name}</h3>
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-none"
                          >
                            {doctor.style}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doctor.expertise.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {doctor.description}
                        </p>
                        <Button
                          onClick={() => handleSelectDoctor(doctor)}
                          className="w-full mt-3 !rounded-button"
                        >
                          开始对话
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        // 对话页面
        <div className="flex flex-col h-full">
          <div className="fixed top-0 w-full bg-white shadow-sm z-10 px-4 py-3">
            <div className="flex items-center">
              <button
                className="text-gray-600 cursor-pointer"
                onClick={() => setSelectedDoctor(null)}
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              <div className="flex items-center mx-auto">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                  />
                  <AvatarFallback>
                    {selectedDoctor.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base font-medium">
                    {selectedDoctor.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary border-none"
                  >
                    {selectedDoctor.style}
                  </Badge>
                </div>
              </div>
              <button className="text-gray-600 cursor-pointer">
                <i className="fa fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <ScrollArea className="flex-1 pt-20 pb-16">
            <div className="px-4 py-2">
              <div className="text-center mb-6">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {formatDate()}
                </span>
              </div>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  {message.sender === 'doctor' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage
                        src={selectedDoctor.avatar}
                        alt={selectedDoctor.name}
                      />
                      <AvatarFallback>
                        {selectedDoctor.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarImage
                        src="https://public.readdy.ai/ai/img_res/6fa1c28f2a2073532e68249a5d03e792.jpg"
                        alt="用户"
                      />
                      <AvatarFallback>我</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isRecording) {
                    // 停止录音
                    setIsRecording(false)
                    setRecordingText('') // 清空录音提示
                    // 模拟语音转文字结果
                    setTimeout(() => {
                      setInputMessage(
                        inputMessage +
                          '今天我感到有些焦虑，不知道该如何缓解这种情绪。'
                      )
                    }, 500)
                  } else {
                    // 开始录音
                    setIsRecording(true)
                    setRecordingText('正在录音...')
                  }
                }}
                className={`text-gray-500 h-10 w-10 flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-100 text-red-500 animate-pulse'
                    : 'bg-gray-100'
                } rounded-full cursor-pointer relative`}
              >
                <i
                  className={`fa ${isRecording ? 'fa-stop' : 'fa-microphone'}`}
                ></i>
                {recordingText && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    {recordingText}
                  </span>
                )}
              </button>
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入你想说的..."
                  className="w-full pr-10 py-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer ${
                  inputMessage.trim()
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default DoctorList
