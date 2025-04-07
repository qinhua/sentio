import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const CourseList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const formatDate = () => {
    const today = new Date()
    return today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  const categories = [
    '全部',
    '热门',
    '最新',
    '已购',
    '免费',
    '情绪管理',
    '人际关系',
    '职场成长'
  ]
  const courses = [
    {
      id: 'course1',
      title: '情绪管理与压力缓解',
      cover:
        'https://public.readdy.ai/ai/img_res/a6aba56420ab7c77ce5f6c648a514435.jpg',
      description: '学习识别和管理负面情绪的有效方法',
      instructor: {
        name: '张雅琪',
        avatar:
          'https://public.readdy.ai/ai/img_res/722ccb4765c7ff30496088ab33b19e90.jpg'
      },
      price: 0,
      isFree: true,
      progress: 0,
      isPurchased: false,
      tags: ['情绪管理', '热门']
    },
    {
      id: 'course2',
      title: '人际关系修复与沟通技巧',
      cover:
        'https://public.readdy.ai/ai/img_res/bcc8b2839f84be2523066d6923579863.jpg',
      description: '建立健康的人际关系与有效沟通的核心技巧',
      instructor: {
        name: '刘明哲',
        avatar:
          'https://public.readdy.ai/ai/img_res/72138cd589daf0273e0259303fbc20c1.jpg'
      },
      price: 199,
      isFree: false,
      progress: 0,
      isPurchased: false,
      tags: ['人际关系', '最新']
    },
    {
      id: 'course3',
      title: '职场压力与心理健康',
      cover:
        'https://public.readdy.ai/ai/img_res/7e7dc3ab57dcc784d3b012e3ce43bf44.jpg',
      description: '应对职场压力与倦怠的心理调适方法',
      instructor: {
        name: '王思远',
        avatar:
          'https://public.readdy.ai/ai/img_res/82bb37149999e95e09daeb8d50c443aa.jpg'
      },
      price: 149,
      isFree: false,
      progress: 65,
      isPurchased: true,
      tags: ['职场成长', '已购']
    },
    {
      id: 'course4',
      title: '自我认知与成长',
      cover:
        'https://public.readdy.ai/ai/img_res/18c8ffe746fd304bebfe7817616cd722.jpg',
      description: '探索自我、发现内在力量的心理学之旅',
      instructor: {
        name: '林雨晴',
        avatar:
          'https://public.readdy.ai/ai/img_res/3416bbf9919ca00d8df6498504db5a3f.jpg'
      },
      price: 0,
      isFree: true,
      progress: 0,
      isPurchased: false,
      tags: ['情绪管理', '免费']
    },
    {
      id: 'course5',
      title: '亲密关系与情感连接',
      cover:
        'https://public.readdy.ai/ai/img_res/947867b18f29f49dee8221fe5bd687b0.jpg',
      description: '构建健康亲密关系的心理学基础',
      instructor: {
        name: '陈佳怡',
        avatar:
          'https://public.readdy.ai/ai/img_res/789a919d25337b77b8c59c7ee746f185.jpg'
      },
      price: 179,
      isFree: false,
      progress: 25,
      isPurchased: true,
      tags: ['人际关系', '已购']
    },
    {
      id: 'course6',
      title: '焦虑情绪管理',
      cover:
        'https://public.readdy.ai/ai/img_res/fa1b123279040e5f46d810652421fb86.jpg',
      description: '缓解焦虑情绪的实用技巧与方法',
      instructor: {
        name: '赵天成',
        avatar:
          'https://public.readdy.ai/ai/img_res/036da42c716c2e56b335d23f96b0cfea.jpg'
      },
      price: 129,
      isFree: false,
      progress: 0,
      isPurchased: false,
      tags: ['情绪管理', '热门']
    }
  ]
  const filteredCourses = courses.filter(course => {
    if (searchQuery) {
      return (
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeCategory === '全部') return true
    if (activeCategory === '热门') return course.tags.includes('热门')
    if (activeCategory === '最新') return course.tags.includes('最新')
    if (activeCategory === '已购') return course.isPurchased
    if (activeCategory === '免费') return course.isFree
    return course.tags.includes(activeCategory)
  })
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 w-full bg-white shadow-sm z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <a
            href="https://readdy.ai/home/bea5e568-cad4-4137-843c-ef3e1daaeb3c/30aaca23-5946-4aa9-9438-decb053ece3c"
            data-readdy="true"
            className="text-gray-600 cursor-pointer"
          >
            <i className="fa fa-arrow-left"></i>
          </a>
          <h1 className="text-xl font-semibold">心理课程</h1>
          <div className="w-8"></div>
        </div>
      </div>
      {/* 搜索区域 */}
      <div className="fixed top-14 w-full bg-white z-10 px-4 py-3 shadow-sm">
        <div className="relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索课程名称或关键词"
            className="pl-10 pr-4 py-2 w-full border-gray-200 rounded-full focus:ring-2 focus:ring-primary/30 bg-gray-100"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>
      {/* 分类筛选 */}
      <div className="fixed top-28 w-full bg-white z-10 shadow-sm">
        {/* @ts-ignore */}
        <ScrollArea className="w-full" orientation="horizontal">
          <div
            className="flex px-4 py-2 space-x-2 min-w-max"
            style={{
              touchAction: 'pan-x',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* 课程列表 */}
      <ScrollArea className="flex-1 pt-44 pb-4">
        <div className="px-4 py-2 space-y-4 mb-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative h-[180px] w-full overflow-hidden">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {course.isPurchased && (
                    <Badge className="absolute top-2 right-2 bg-primary/80 text-white border-none">
                      已购
                    </Badge>
                  )}
                  {course.isFree && !course.isPurchased && (
                    <Badge className="absolute top-2 right-2 bg-green-500/80 text-white border-none">
                      免费
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {course.instructor.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">
                        {course.instructor.name}
                      </span>
                    </div>
                    {!course.isFree && !course.isPurchased && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-none"
                      >
                        ¥{course.price}
                      </Badge>
                    )}
                  </div>
                  {course.isPurchased && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>学习进度</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fa fa-search text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">未找到相关课程</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
export default CourseList
