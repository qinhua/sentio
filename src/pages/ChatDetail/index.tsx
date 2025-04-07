import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

const ChatDetail: React.FC = () => {
  const [message, setMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState([
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

  const handleSendMessage = () => {
    if (message.trim() === '') return
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'long'
      }),
      isFirstOfDay: false
    }
    setMessages([...messages, newMessage])
    setMessage('')
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 w-full max-w-[500px] bg-white shadow-sm z-10 px-4 py-3">
        <div className="flex items-center">
          <div onClick={handleBack} className="cursor-pointer mr-3">
            <i className="fa fa-arrow-left text-gray-700"></i>
          </div>
          <div className="flex items-center flex-1">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage
                src="https://readdy.ai/api/search-image?query=Professional male Chinese psychologist portrait, mid 30s, warm smile, glasses, soft lighting, high quality portrait, isolated on light background, centered composition, realistic style&width=80&height=80&seq=11&orientation=squarish"
                alt="张澜"
                className="object-cover"
              />
              <AvatarFallback>张</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-gray-900">张雅琪</h2>
              <Badge className="bg-gray-200 text-gray-700 font-normal text-xs px-2 py-0.5 rounded-full border-none">
                温柔倾听型
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 h-8 w-8 p-0 rounded-full cursor-pointer !rounded-button"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Button>
        </div>
      </div>
      {/* 聊天内容区域 */}
      <ScrollArea className="flex-1 pt-16 pb-20 px-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-2">
          {messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              {msg.isFirstOfDay && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {msg.date}
                  </span>
                </div>
              )}
              <div
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } items-start space-x-2`}
              >
                {msg.sender === 'counselor' && (
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                    <AvatarImage
                      src="https://readdy.ai/api/search-image?query=Professional male Chinese psychologist portrait, mid 30s, warm smile, glasses, soft lighting, high quality portrait, isolated on light background, centered composition, realistic style&width=80&height=80&seq=11&orientation=squarish"
                      alt="张澜"
                      className="object-cover"
                    />
                    <AvatarFallback>张</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col max-w-[70%]">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 self-start">
                      {msg.time}
                    </span>
                    {msg.sender === 'user' && (
                      <span className="text-xs text-gray-500 ml-2">
                        {index === messages.length - 1 ? '已读' : '已送达'}
                      </span>
                    )}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                    <AvatarImage
                      src="https://public.readdy.ai/ai/img_res/56d87db85d3adf95ccda80beb0055e59.jpg"
                      alt="我"
                      className="object-cover"
                    />
                    <AvatarFallback>我</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      {/* 底部输入区域 */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 h-10 w-10 p-0 rounded-full flex-shrink-0 cursor-pointer !rounded-button"
          >
            <i className="fa fa-microphone text-lg"></i>
          </Button>
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你想说的..."
            className="flex-1 py-2 px-4 border-gray-200 rounded-full focus:ring-2 focus:ring-primary/30 bg-gray-100 border-none"
          />
          <Button
            onClick={handleSendMessage}
            variant="ghost"
            size="sm"
            className="text-primary h-10 w-10 p-0 rounded-full flex-shrink-0 cursor-pointer !rounded-button"
            disabled={message.trim() === ''}
          >
            <i
              className={`fa fa-paper-plane text-lg ${
                message.trim() === '' ? 'text-gray-300' : ''
              }`}
            ></i>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default ChatDetail
