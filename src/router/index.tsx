import { Navigate, useRoutes } from 'react-router-dom'
import RootRedirect from '@/router/RootRedirect'
import RequireAuth from '@/router/RequireAuth'
import AuthGuard from '@/router/AuthGuard'
import { IS_DEV_ENV } from '@/config/env'
import {
  PageLogin,
  PageWelcome,
  PageCompleteInfo,
  PageDoctorList,
  PageChatList,
  PageChatDetail,
  // PageCourseList,
  PageProfile,
  PageEditProfile,
  Page404,
  PageComps
} from './pages'

export default function Router() {
  const routers = [
    {
      path: '/',
      element: <RootRedirect />
    },
    {
      path: 'welcome',
      element: (
        <AuthGuard>
          <PageWelcome />
        </AuthGuard>
      )
    },
    {
      path: 'complete-info',
      element: (
        <AuthGuard>
          <PageCompleteInfo />
        </AuthGuard>
      )
    },
    {
      path: 'doctor-list',
      element: (
        <RequireAuth>
          <PageDoctorList />
        </RequireAuth>
      )
    },
    {
      path: 'chat-list',
      element: (
        <RequireAuth>
          <PageChatList />
        </RequireAuth>
      )
    },
    {
      path: 'chat-detail/:doctorId',
      element: (
        <RequireAuth>
          <PageChatDetail />
        </RequireAuth>
      )
    },
    // {
    //   path: 'course-list',
    //   element: (
    //     <RequireAuth>
    //       <PageCourseList />
    //     </RequireAuth>
    //   )
    // },
    {
      path: 'profile',
      element: (
        <RequireAuth>
          <PageProfile />
        </RequireAuth>
      )
    },
    {
      path: 'edit-profile',
      element: (
        <RequireAuth>
          <PageEditProfile />
        </RequireAuth>
      )
    },
    {
      path: '404',
      element: <Page404 />
    },
    {
      path: '*',
      element: <Navigate to="/404" />
    }
  ]

  if (IS_DEV_ENV) {
    routers.push({
      path: 'comps',
      element: <PageComps />
    })
  }

  return useRoutes(routers)
}
