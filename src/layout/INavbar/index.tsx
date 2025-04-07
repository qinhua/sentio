import { NavBar } from 'antd-mobile'
import { useAtom } from 'jotai'
import { navbarAtom } from '@/store/system'
import { useLocation } from 'react-router-dom'
import { PATH } from '@/constants/path'
import styles from './index.module.scss'
import classNames from 'classnames'

const INavbar = () => {
  const { pathname } = useLocation()
  const [navbarConfig] = useAtom(navbarAtom)
  const showNavbar = navbarConfig.show && [PATH.chatDetail].includes(pathname)

  if (!showNavbar) return null

  return (
    <NavBar
      className={classNames('i-navbar', styles.iNavbar)}
      right={navbarConfig.right}
      onBack={navbarConfig.onBack}
    >
      {navbarConfig.title}
    </NavBar>
  )
}

export default INavbar
