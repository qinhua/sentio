import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthProviderContext } from '@/providers/AuthProvider'
import { PATH } from '@/constants/path'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that redirects logged-in users away from specific routes
 * like welcome and complete-info pages
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLogin } = useAuthProviderContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // List of paths that should redirect logged-in users
    const redirectPaths = [PATH.welcome, PATH.completeInfo]

    // Check if current path is in the redirect list and user is logged in
    if (isLogin && redirectPaths.includes(location.pathname as any)) {
      // Redirect to doctor list
      navigate(PATH.doctorList)
    }
  }, [isLogin, location.pathname, navigate])

  return <>{children}</>
}

export default AuthGuard
