import { lazy } from 'react'
import Loadable from './Loadable'

// Welcome
export const PageWelcome = Loadable(lazy(() => import('@/pages/Welcome/index')))

// CompleteInfo
export const PageCompleteInfo = Loadable(
  lazy(() => import('@/pages/CompleteInfo/index'))
)

// DoctorList
export const PageDoctorList = Loadable(
  lazy(() => import('@/pages/DoctorList/index'))
)

// ChatList
export const PageChatList = Loadable(
  lazy(() => import('@/pages/ChatList/index'))
)

// ChatDetail
export const PageChatDetail = Loadable(
  lazy(() => import('@/pages/ChatDetail/index'))
)

// CourseList
// export const PageCourseList = Loadable(
//   lazy(() => import('@/pages/CourseList/index'))
// )

// Profile
export const PageProfile = Loadable(lazy(() => import('@/pages/Profile/index')))

// EditProfile
export const PageEditProfile = Loadable(
  lazy(() => import('@/pages/EditProfile/index'))
)

// Comps
export const PageComps = Loadable(lazy(() => import('@/pages/Comps/index')))

// 404
export const Page404 = Loadable(lazy(() => import('@/pages/404')))
