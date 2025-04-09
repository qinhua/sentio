import { useEffect } from 'react'
import { NavBar } from 'antd-mobile'
import { useAtom } from 'jotai'
import { navbarAtom } from '@/store/system'
import { useLocation } from 'react-router-dom'
import { PATH } from '@/constants/path'
import classNames from 'classnames'
import styles from './index.module.scss'

const INavbar = () => {
  const { pathname } = useLocation()
  const [navbarConfig, setNavbarConfig] = useAtom(navbarAtom)

  const shouldShowNavbar = [
    PATH.completeInfo,
    PATH.editProfile,
    PATH.chatDetail
  ].includes(pathname as any)

  useEffect(() => {
    let title = ''
    switch (pathname) {
      case PATH.completeInfo:
        title = 'Complete Profile'
        break
      case PATH.editProfile:
        title = 'Edit Profile'
        break
    }

    setNavbarConfig({
      ...navbarConfig,
      title
    })
  }, [pathname])

  if (!shouldShowNavbar) return null

  return (
    <NavBar
      className={classNames('i-navbar', styles.iNavbar)}
      left={navbarConfig.left}
      right={navbarConfig.right}
      onBack={navbarConfig.onBack}
    >
      {navbarConfig.title}
    </NavBar>
  )
}

export default INavbar
