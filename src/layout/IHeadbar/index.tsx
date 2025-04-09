import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ImgLogo } from '@/constants/file'
import { PATH } from '@/constants/path'
import classNames from 'classnames'
import styles from './index.module.scss'

const IHeadbar = ({ title }: { title?: string | ReactNode }) => {
  const { pathname } = useLocation()

  const shouldShowHeader = [
    PATH.doctorList,
    PATH.chatList,
    PATH.courseList,
    PATH.profile
  ].includes(pathname as any)

  if (!shouldShowHeader) return null

  const getBgColor = () => {
    if (pathname === PATH.profile) {
      return {
        background: '#e9c2fe'
      }
    }

    if (pathname === PATH.doctorList) {
      return {
        background: '#f5f5f5'
      }
    }

    return { background: '#fff' }
  }

  return (
    <div
      className={classNames('i-headbar', styles.iHeadbar)}
      style={getBgColor()}
    >
      <div className={styles.logo}>
        <img src={ImgLogo} alt="logo" />
        <p>Sentio</p>
      </div>
      <div className={styles.rightCon}>{title}</div>
    </div>
  )
}

export default IHeadbar
