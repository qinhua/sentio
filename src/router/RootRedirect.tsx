import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthProviderContext } from '@/providers/AuthProvider'
import { PATH } from '@/constants/path'

/**
 * RootRedirect component that redirects based on login status
 * - If logged in: redirects to /course-list
 * - If not logged in: redirects to /welcome
 */
const RootRedirect: React.FC = () => {
  const { isLogin } = useAuthProviderContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLogin) {
      // If user is logged in, redirect to course list
      navigate(PATH.courseList)
    } else {
      // If user is not logged in, redirect to welcome page
      navigate(PATH.welcome)
    }
  }, [isLogin, navigate])

  // Return null or a loading indicator while redirecting
  return null
}

export default RootRedirect
