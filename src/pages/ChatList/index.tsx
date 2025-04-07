import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

const ChatList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [chatList, setChatList] = useState([
    {
      id: 1,
      name: '张雅琪 心理咨询师',
      avatar:
        'https://public.readdy.ai/ai/img_res/722ccb4765c7ff30496088ab33b19e90.jpg',
      lastMessage: '您好，关于上次我们讨论的情绪管理方法，您有尝试过吗？',
      time: '09:45',
      unread: 2,
      isOnline: true
    },
    {
      id: 2,
      name: '刘明哲 心理咨询师',
      avatar:
        'https://public.readdy.ai/ai/img_res/72138cd589daf0273e0259303fbc20c1.jpg',
      lastMessage: '下周二下午三点，我们继续上次的沟通技巧训练，您看可以吗？',
      time: '昨天',
      unread: 0,
      isOnline: false
    },
    {
      id: 3,
      name: '王思远 职场心理专家',
      avatar:
        'https://public.readdy.ai/ai/img_res/82bb37149999e95e09daeb8d50c443aa.jpg',
      lastMessage: '职场压力是很常见的，我们可以一起探讨一些应对策略。',
      time: '周五',
      unread: 1,
      isOnline: true
    },
    {
      id: 4,
      name: '林雨晴 情绪管理专家',
      avatar:
        'https://public.readdy.ai/ai/img_res/3416bbf9919ca00d8df6498504db5a3f.jpg',
      lastMessage: '您最近的情绪日记记录得很好，我们下次可以详细分析一下。',
      time: '周四',
      unread: 0,
      isOnline: false
    },
    {
      id: 5,
      name: '陈佳怡 亲密关系咨询师',
      avatar:
        'https://public.readdy.ai/ai/img_res/789a919d25337b77b8c59c7ee746f185.jpg',
      lastMessage: '关系中的沟通很重要，我们可以讨论一些有效的表达方式。',
      time: '4月3日',
      unread: 0,
      isOnline: true
    },
    {
      id: 6,
      name: '赵天成 焦虑情绪专家',
      avatar:
        'https://public.readdy.ai/ai/img_res/036da42c716c2e56b335d23f96b0cfea.jpg',
      lastMessage: '呼吸练习做得如何？有没有感觉到焦虑有所缓解？',
      time: '4月2日',
      unread: 0,
      isOnline: false
    },
    {
      id: 7,
      name: '李婉容 家庭关系咨询师',
      avatar:
        'https://public.readdy.ai/ai/img_res/c3f4a5d2e7b9a8c1d6f3e2a5b8c7d9e0.jpg',
      lastMessage: '家庭成员之间的理解和支持是很重要的，我们下次可以深入探讨。',
      time: '3月30日',
      unread: 0,
      isOnline: true
    },
    {
      id: 8,
      name: '吴子明 青少年心理专家',
      avatar:
        'https://public.readdy.ai/ai/img_res/a7b9c8d6e5f4a3b2c1d0e9f8a7b6c5d4.jpg',
      lastMessage: '青春期的情绪波动是正常的，我们可以讨论一些应对方法。',
      time: '3月28日',
      unread: 0,
      isOnline: false
    }
  ])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const swipedItemRef = useRef<number | null>(null)
  const [swipeStates, setSwipeStates] = useState<Record<number, boolean>>({})
  const handleTouchStart = (e: React.TouchEvent, chatId: number) => {
    touchStartX.current = e.touches[0].clientX
    // Reset other swiped items
    if (swipedItemRef.current !== null && swipedItemRef.current !== chatId) {
      setSwipeStates(prev => ({
        ...prev,
        // @ts-ignore
        [swipedItemRef.current]: false
      }))
    }
  }
  const handleTouchMove = (e: React.TouchEvent, chatId: number) => {
    if (!touchStartX.current) return
    const currentX = e.touches[0].clientX
    const diff = touchStartX.current - currentX
    // Only allow left swipe (positive diff)
    if (diff > 0) {
      // Prevent default to stop scrolling when swiping
      if (diff > 30) {
        e.preventDefault()
      }
      // Update swipe state if swipe distance is significant
      if (diff > 50) {
        setSwipeStates(prev => ({
          ...prev,
          [chatId]: true
        }))
        swipedItemRef.current = chatId
      }
    }
  }
  const handleTouchEnd = (e: React.TouchEvent, chatId: number) => {
    touchEndX.current = e.changedTouches[0].clientX
    if (touchStartX.current && touchEndX.current) {
      const diff = touchStartX.current - touchEndX.current
      // If swipe distance is not significant, reset the state
      if (diff < 50) {
        setSwipeStates(prev => ({
          ...prev,
          [chatId]: false
        }))
        if (swipedItemRef.current === chatId) {
          swipedItemRef.current = null
        }
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }
  const resetSwipe = (chatId: number) => {
    setSwipeStates(prev => ({
      ...prev,
      [chatId]: false
    }))
    if (swipedItemRef.current === chatId) {
      swipedItemRef.current = null
    }
  }
  const confirmDelete = (chatId: number) => {
    setChatToDelete(chatId)
    setDeleteDialogOpen(true)
  }
  const handleDelete = () => {
    if (chatToDelete !== null) {
      setChatList(prev => prev.filter(chat => chat.id !== chatToDelete))
      resetSwipe(chatToDelete)
      setChatToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  const filteredChats = chatList.filter(chat => {
    if (!searchQuery) return true
    return (
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 w-full bg-white shadow-sm z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-8"></div>
          <h1 className="text-xl font-semibold">聊天</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-8 w-8 p-0 rounded-full cursor-pointer !rounded-button"
          >
            <i className="fa fa-plus text-lg"></i>
          </Button>
        </div>
      </div>
      {/* 搜索区域 */}
      <div className="fixed top-14 w-full bg-white z-10 px-4 py-3 shadow-sm">
        <div className="relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索咨询师或聊天内容"
            className="pl-10 pr-4 py-2 w-full border-gray-200 rounded-full focus:ring-2 focus:ring-primary/30 bg-gray-100 border-none"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>
      {/* 聊天列表 */}
      <ScrollArea className="flex-1 pt-28 pb-8 w-full bg-white">
        <div className="px-2 space-y-1">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <React.Fragment key={chat.id}>
                <div
                  className="relative overflow-hidden"
                  onTouchStart={e => handleTouchStart(e, chat.id)}
                  onTouchMove={e => handleTouchMove(e, chat.id)}
                  onTouchEnd={e => handleTouchEnd(e, chat.id)}
                >
                  {/* Delete button (revealed on swipe) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 flex items-center bg-red-500 text-white px-6 h-full"
                    onClick={() => confirmDelete(chat.id)}
                  >
                    <i className="fa fa-trash-alt"></i>
                  </div>
                  {/* Chat item */}
                  <a
                    href="https://readdy.ai/home/bea5e568-cad4-4137-843c-ef3e1daaeb3c/997cd8bc-08ef-470f-8f73-ff70917a6dad"
                    data-readdy="true"
                    className={`flex items-center py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg bg-white transition-transform duration-200 ease-out w-full`}
                    style={{
                      transform: swipeStates[chat.id]
                        ? 'translateX(-80px)'
                        : 'translateX(0)'
                    }}
                    onClick={e => {
                      if (swipeStates[chat.id]) {
                        e.preventDefault()
                        resetSwipe(chat.id)
                      }
                    }}
                  >
                    <div className="relative mr-3 flex-shrink-0">
                      <Avatar className="h-12 w-12 border border-gray-200">
                        <AvatarImage
                          src={chat.avatar}
                          alt={chat.name}
                          className="object-cover"
                        />
                        <AvatarFallback>{chat.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex justify-between items-center mb-1 w-full">
                        <h3 className="font-medium text-gray-900 truncate max-w-[65%]">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-gray-600 truncate max-w-[75%] overflow-hidden text-ellipsis">
                          {chat.lastMessage}
                        </span>
                        {chat.unread > 0 && (
                          <Badge className="bg-primary text-white h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 border-none flex-shrink-0">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
                <Separator />
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fa fa-search text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">未找到相关聊天</p>
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个聊天吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (chatToDelete) resetSwipe(chatToDelete)
                setChatToDelete(null)
              }}
              className="!rounded-button"
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 !rounded-button"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
export default ChatList
