import { TabBar } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { PATH } from '@/constants/path'
import classNames from 'classnames'
import styles from './index.module.scss'

const tabs = [
  {
    key: 'doctor-list',
    title: 'Doctor',
    icon: (_active: boolean) => (
      // <SvgIcon icon={`tabbar-home${active ? '_active' : ''}`} />
      // <img className="tabbar-icon-img" src={IconHome} />
      <Icon icon="fa6-solid:user-doctor" />
    )
  },
  {
    key: 'chat-list',
    title: 'Chat',
    icon: (_active: boolean) => <Icon icon="ant-design:message-filled" />
  },
  // {
  //   key: 'course-list',
  //   title: 'Course',
  //   icon: (_active: boolean) => <i className="fa fa-book" />
  // },
  {
    key: 'profile',
    title: 'My',
    icon: (_active: boolean) => <Icon icon="fa-solid:user" />
  }
]

const theme = 'light'

const ITabbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const showTabbar = [
    PATH.doctorList,
    PATH.chatList,
    PATH.courseList,
    PATH.profile
  ].includes(pathname)

  if (!showTabbar) return null

  const setRouteActive = (value: string) => {
    if (!value) return
    if (value === 'add') {
      alert('Add')
    } else {
      navigate(value)
    }
  }

  return (
    <TabBar
      className={classNames('i-tabbar', styles.iTabbar, {
        // dark: theme === 'dark',
        // [styles.isDark]: theme === 'dark'
      })}
      safeArea
      activeKey={pathname}
      onChange={value => setRouteActive(value)}
    >
      {tabs.map(item => (
        <TabBar.Item
          className={'tab-item_' + item.key}
          // data-badge-new={item.key === 'shop' ? 'New' : ''}
          key={`/${item.key}`}
          icon={item.icon}
          title={item.title}
        />
      ))}
    </TabBar>
  )
}

export default ITabbar
