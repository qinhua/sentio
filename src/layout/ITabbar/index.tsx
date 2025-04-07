import { TabBar } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
// import IconFriends from '@/assets/icon/tabbar/friends.png'
// import IconTasks from '@/assets/icon/tabbar/tasks.png'
// import IconHome from '@/assets/icon/tabbar/home.png'
// import IconShop from '@/assets/icon/tabbar/shop.png'
import { PATH } from '@/constants/path'
import classNames from 'classnames'
import styles from './index.module.scss'

const tabs = [
  {
    key: 'doctor-list',
    title: 'Doctors',
    icon: (_active: boolean) => (
      // <SvgIcon icon={`tabbar-home${active ? '_active' : ''}`} />
      <i className="fa fa-user-md" />
      // <img className="tabbar-icon-img" src={IconHome} />
    )
  },
  {
    key: 'chat-list',
    title: 'Chats',
    icon: (_active: boolean) => (
      <i className="fa fa-comment" />
      // <img className="tabbar-icon-img" src={IconTasks} />
    )
  },
  {
    key: 'course-list',
    title: 'Courses',
    icon: (_active: boolean) => (
      <i className="fa fa-book" />
      // <img className="tabbar-icon-img" src={IconShop} />
    )
  },
  {
    key: 'profile',
    title: 'Profile',
    icon: (_active: boolean) => (
      <i className="fa fa-user" />
      // <img className="tabbar-icon-img" src={IconFriends} />
    )
  }
]

const ITabbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const showTabbar = [
    PATH.doctorList,
    PATH.chatList,
    PATH.courseList,
    PATH.profile
  ]
    // .map(path => `/${path.replace(/^\//, '')}`)
    .includes(pathname)

  if (!showTabbar) return null

  const theme = 'light'

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
