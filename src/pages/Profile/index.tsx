import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('learning')
  const formatDate = () => {
    const today = new Date('2025-04-06')
    return today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  const learningStats = [
    { title: '学习天数', value: 28, icon: 'fa-calendar' },
    { title: '已完成课程', value: 5, icon: 'fa-graduation-cap' },
    { title: '收藏课程', value: 12, icon: 'fa-bookmark' },
    { title: '学习时长', value: '42小时', icon: 'fa-clock-o' }
  ]
  const myCourses = [
    {
      id: 'course1',
      title: '职场压力与心理健康',
      cover:
        'https://readdy.ai/api/search-image?query=Professional psychology course cover with office setting in background and meditation pose silhouette in foreground, teal gradient background, minimalist design, high quality digital illustration, centered composition, soft lighting, modern and clean aesthetic&width=320&height=180&seq=14&orientation=landscape',
      progress: 65,
      lastStudyTime: '昨天'
    },
    {
      id: 'course2',
      title: '亲密关系与情感连接',
      cover:
        'https://public.readdy.ai/ai/img_res/2c15e6912589f648389fadbda1597f30.jpg',
      progress: 25,
      lastStudyTime: '3 天前'
    }
  ]
  const favoritesCourses = [
    {
      id: 'fav1',
      title: '情绪管理与压力缓解',
      cover:
        'https://readdy.ai/api/search-image?query=Professional psychology course cover with calm blue gradient background, showing a stylized brain icon with waves representing calmness, minimalist design, high quality digital illustration, centered composition, soft lighting, modern and clean aesthetic&width=320&height=180&seq=10&orientation=landscape',
      instructor: '张雅琪',
      addedDate: '2025-03-20'
    },
    {
      id: 'fav2',
      title: '焦虑情绪管理',
      cover:
        'https://public.readdy.ai/ai/img_res/7b6b29bf2a15af3dc7a08a96b7e6267d.jpg',
      instructor: '赵天成',
      addedDate: '2025-03-28'
    },
    {
      id: 'fav3',
      title: '自我认知与成长',
      cover:
        'https://public.readdy.ai/ai/img_res/2c15e6912589f648389fadbda1597f30.jpg',
      instructor: '林雨晴',
      addedDate: '2025-04-01'
    }
  ]
  const historyRecords = [
    {
      id: 'hist1',
      title: '职场压力与心理健康',
      cover:
        'https://readdy.ai/api/search-image?query=Professional psychology course cover with office setting in background and meditation pose silhouette in foreground, teal gradient background, minimalist design, high quality digital illustration, centered composition, soft lighting, modern and clean aesthetic&width=320&height=180&seq=14&orientation=landscape',
      lastStudyTime: '今天',
      duration: '45 分钟'
    },
    {
      id: 'hist2',
      title: '亲密关系与情感连接',
      cover:
        'https://readdy.ai/api/search-image?query=Professional psychology course cover with two hearts connected by golden thread, soft pink gradient background, minimalist design, high quality digital illustration, centered composition, soft lighting, modern and clean aesthetic&width=320&height=180&seq=18&orientation=landscape',
      lastStudyTime: '昨天',
      duration: '30 分钟'
    },
    {
      id: 'hist3',
      title: '情绪管理与压力缓解',
      cover:
        'https://readdy.ai/api/search-image?query=Professional psychology course cover with calm blue gradient background, showing a stylized brain icon with waves representing calmness, minimalist design, high quality digital illustration, centered composition, soft lighting, modern and clean aesthetic&width=320&height=180&seq=10&orientation=landscape',
      lastStudyTime: '3 天前',
      duration: '20 分钟'
    }
  ]
  const weeklyLearningData = [
    { day: '周一', minutes: 35 },
    { day: '周二', minutes: 45 },
    { day: '周三', minutes: 20 },
    { day: '周四', minutes: 60 },
    { day: '周五', minutes: 30 },
    { day: '周六', minutes: 15 },
    { day: '周日', minutes: 45 }
  ]
  const maxMinutes = Math.max(...weeklyLearningData.map(item => item.minutes))
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部用户信息区域 */}
      <div className="fixed top-0 w-full bg-white shadow-sm z-10 pt-4 pb-5 px-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage
              src="https://public.readdy.ai/ai/img_res/f46ad8fac2d7880c86a20372540c2dac.jpg"
              alt="用户头像"
              className="object-cover"
            />
            <AvatarFallback>陈</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-xl font-medium">陈美玲</h2>
                <i className="fa fa-venus ml-1 text-pink-500" title="女性"></i>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-3 py-1 h-8 border-gray-200 !rounded-button"
              >
                <i className="fa fa-edit mr-1 text-gray-500"></i>
                编辑资料
              </Button>
            </div>
            <p className="text-left text-gray-500 text-sm mt-1">
              每天进步一点点，心理更健康
            </p>
            <div className="flex items-center mt-1">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
                <i className="fa fa-crown text-yellow-500 mr-1"></i>
                心灵成长会员
              </Badge>
              <span className="text-xs text-gray-400 ml-2">
                有效期至：2025-12-31
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 内容区域 */}
      <ScrollArea className="flex-1 pt-32 pb-4">
        {/* 学习数据统计 */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-4 gap-2 bg-white rounded-xl p-3 shadow-sm">
            {learningStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center py-2"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  <i className={`fa ${stat.icon} text-primary`}></i>
                </div>
                <div className="font-medium text-lg">{stat.value}</div>
                <div className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                  {stat.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 学习进度追踪 */}
        <div className="px-4 mb-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">本周学习概览</h3>
              <span className="text-sm text-primary cursor-pointer">详情</span>
            </div>
            <div className="flex items-end justify-between h-24 mb-1">
              {weeklyLearningData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 bg-primary/80 rounded-t-sm"
                    style={{
                      height: `${(item.minutes / maxMinutes) * 100}%`,
                      minHeight: '4px',
                      opacity: item.day === '周日' ? 1 : 0.7
                    }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-sm text-gray-500">本周目标</div>
                <div className="font-medium">5 小时</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">已完成</div>
                <div className="font-medium text-primary">4.2 小时</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">完成率</div>
                <div className="font-medium">84%</div>
              </div>
            </div>
          </Card>
        </div>
        {/* 功能选项卡 */}
        <div className="px-4 mb-4">
          <Tabs
            defaultValue="learning"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="learning" className="px-1 py-1">
                我的学习
              </TabsTrigger>
              <TabsTrigger value="favorites" className="px-1 py-1">
                我的收藏
              </TabsTrigger>
              <TabsTrigger value="history" className="px-1 py-1">
                学习记录
              </TabsTrigger>
            </TabsList>
            <TabsContent value="learning" className="mt-0">
              <div className="space-y-3">
                <a
                  href="https://readdy.ai/home/bea5e568-cad4-4137-843c-ef3e1daaeb3c/75167409-5b72-4b75-95f2-c970bfe558b2"
                  data-readdy="true"
                  className="block"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">进行中的课程</h3>
                    <span className="text-sm text-primary cursor-pointer">
                      查看全部
                    </span>
                  </div>
                </a>
                {myCourses.map(course => (
                  <Card
                    key={course.id}
                    className="overflow-hidden cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 overflow-hidden">
                        <img
                          src={
                            course.id === 'course1'
                              ? 'https://public.readdy.ai/ai/img_res/7b6b29bf2a15af3dc7a08a96b7e6267d.jpg'
                              : course.cover
                          }
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h4 className="font-medium line-clamp-1">
                          {course.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <i className="fa fa-clock-o mr-1"></i>
                          <span>上次学习：{course.lastStudyTime}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>学习进度</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites" className="mt-0">
              <div className="space-y-3">
                {favoritesCourses.map(course => (
                  <Card
                    key={course.id}
                    className="overflow-hidden cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 overflow-hidden">
                        <img
                          src={
                            course.id === 'course1'
                              ? 'https://public.readdy.ai/ai/img_res/7b6b29bf2a15af3dc7a08a96b7e6267d.jpg'
                              : course.cover
                          }
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h4 className="font-medium line-clamp-1">
                          {course.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <i className="fa fa-user-alt mr-1"></i>
                          <span>讲师：{course.instructor}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            <i className="fa fa-calendar mr-1"></i>
                            <span>
                              收藏于{' '}
                              {new Date(course.addedDate).toLocaleDateString(
                                'zh-CN'
                              )}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-gray-500 !rounded-button"
                          >
                            <i className="fa fa-bookmark text-primary"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <div className="space-y-3">
                {historyRecords.map(record => (
                  <Card
                    key={record.id}
                    className="overflow-hidden cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 overflow-hidden">
                        <img
                          src={record.cover}
                          alt={record.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h4 className="font-medium line-clamp-1">
                          {record.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <i className="fa fa-clock-o mr-1"></i>
                          <span>学习时长：{record.duration}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            <i className="fa fa-calendar mr-1"></i>
                            <span>{record.lastStudyTime}学习</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-gray-500 !rounded-button"
                          >
                            <i className="fa fa-play-circle"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* 功能模块区域 */}
        <div className="px-4 mb-4">
          <h3 className="font-medium mb-3">我的服务</h3>
          <div className="grid grid-cols-4 gap-4">
            <a
              href="https://readdy.ai/home/bea5e568-cad4-4137-843c-ef3e1daaeb3c/75167409-5b72-4b75-95f2-c970bfe558b2"
              data-readdy="true"
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
                <i className="fa fa-book text-primary text-xl"></i>
              </div>
              <span className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                我的课程
              </span>
            </a>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-1">
                <i className="fa fa-sticky-note text-blue-500 text-xl"></i>
              </div>
              <span className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                学习笔记
              </span>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-1">
                <i className="fa fa-certificate text-yellow-500 text-xl"></i>
              </div>
              <span className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                我的证书
              </span>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-1">
                <i className="fa fa-cog text-green-500 text-xl"></i>
              </div>
              <span className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                设置
              </span>
            </div>
          </div>
        </div>
        {/* 会员专区 */}
        <div className="px-4 mb-6">
          <Card className="p-0 overflow-hidden">
            <div className="relative h-[136px] w-full overflow-hidden">
              <img
                src="https://public.readdy.ai/ai/img_res/c8bcde61d9bc1a650eb082c114924347.jpg"
                alt="会员专区"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent p-4 flex flex-col justify-center">
                <h3 className="text-white font-medium text-lg">
                  心灵成长会员专区
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  解锁全部高级课程与专属服务
                </p>
                <Button className="mt-2 bg-white text-primary hover:bg-white/90 w-28 h-8 !rounded-button">
                  了解详情
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
export default Profile
