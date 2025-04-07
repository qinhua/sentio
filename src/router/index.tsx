import { useRoutes } from 'react-router-dom'
import {
  PageLogin,
  PageDoctorList,
  PageChatList,
  PageChatDetail,
  PageCourseList,
  PageProfile,
  Page404
  // PageComps
} from './pages'
// import { IS_DEV_ENV } from '@/config/env'

export default function Router() {
  const routers = [
    {
      path: '/',
      element: <PageLogin />
    },
    {
      path: 'login',
      element: <PageLogin />
    },
    {
      path: 'doctor-list',
      element: <PageDoctorList />
    },
    {
      path: 'chat-list',
      element: <PageChatList />
    },
    {
      path: 'chat-detail',
      element: <PageChatDetail />
    },
    {
      path: 'course-list',
      element: <PageCourseList />
    },
    {
      path: 'profile',
      element: <PageProfile />
    },
    // ...(IS_DEV_ENV
    //   ? [
    //       {
    //         path: "comps",
    //         element: <PageComps />,
    //       }
    //     ]
    //   : []),
    {
      path: '*',
      element: <Page404 />
    }
  ]

  return useRoutes(routers)
}
