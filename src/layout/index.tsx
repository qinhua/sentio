import { useLayoutEffect } from 'react'
import ITabbar from './ITabbar'
import IContent from './IContent'
// import { COMMON_EVENTS } from '@/enum/events'
// import { useEvent } from '@/hooks/useEvent'

const Layout = () => {
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

  // useEvent(COMMON_EVENTS.BIND_WALLET, () => {
  //   handleBindKaiaWallet()
  // })

  return (
    <div className="layout">
      <IContent />
      <ITabbar />
    </div>
  )
}

export default Layout
