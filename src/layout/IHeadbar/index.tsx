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

  return (
    <div className={classNames('i-headbar', styles.iHeadbar)}>
      <div className={styles.logo}>
        <img src={ImgLogo} alt="logo" />
        <p>Sentio</p>
      </div>
      <div className={styles.rightCon}>{title}</div>
    </div>
  )
}

export default IHeadbar
