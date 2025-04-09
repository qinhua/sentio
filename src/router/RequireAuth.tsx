import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthProviderContext } from '@/providers/AuthProvider'
import { PATH } from '@/constants/path'

interface RequireAuthProps {
  children: React.ReactNode
}

/**
 * RequireAuth component that redirects non-logged-in users to the welcome page
 * for routes that require authentication
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLogin } = useAuthProviderContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // List of paths that require authentication
    const authRequiredPaths = [
      PATH.doctorList,
      PATH.chatList,
      PATH.chatDetail(),
      PATH.courseList,
      PATH.profile
    ]

    // Check if current path requires auth and user is not logged in
    if (!isLogin && authRequiredPaths.includes(location.pathname as any)) {
      navigate(PATH.welcome)
    }
  }, [isLogin, location.pathname, navigate])

  return <>{children}</>
}

export default RequireAuth
