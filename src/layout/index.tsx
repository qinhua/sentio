import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import IHeadbar from 'src/layout/IHeadbar'
import INavbar from 'src/layout/INavbar'
import IContent from './IContent'
import ITabbar from './ITabbar'
import { PATH } from '@/constants/path'
// import { COMMON_EVENTS } from '@/enum/events'
// import { useEvent } from '@/hooks/useEvent'

const Layout = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const getHeaderTitle = () => {
    switch (currentPath) {
      case PATH.doctorList:
        return 'Doctor'
      case PATH.chatList:
        return 'Chat'
      case PATH.chatDetail():
        return ''
      case PATH.courseList:
        return 'Course'
      case PATH.profile:
        return 'My'
      case PATH.editProfile:
        return 'Edit Profile'
      default:
        return ''
    }
  }

  useLayoutEffect(() => {
    // 处理 WebApp 安全区滚动问题
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        document.body.style.height = `${window.visualViewport?.height || 0}px`
      })
    }

    // 阻止默认的触摸行为
    document.body.addEventListener(
      'touchmove',
      e => {
        if (e.target === document.body) {
          e.preventDefault()
        }
      },
      { passive: false }
    )

    // 清理函数
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', () => {})
      }
      document.body.removeEventListener('touchmove', () => {})
    }
  }, [])

  // useEvent(COMMON_EVENTS.XXX, () => {
  // })

  return (
    <div className="layout">
      <IHeadbar title={getHeaderTitle()} />
      <INavbar />
      <IContent />
      <ITabbar />
    </div>
  )
}

export default Layout
