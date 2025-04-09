import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  Dispatch
} from 'react'
import { Space, SpinLoading } from 'antd-mobile'
import { AuthTokenManager } from '@/request/authTokenManager'
import { useLocation, useNavigate } from 'react-router-dom'
import { USER_AVATAR_URL } from '@/constants/common'
import { getUserInfo, userLogin } from '@/apis/user'
import { IUserProfile } from '@/types/module/user'
import { v4 as uuidv4 } from 'uuid'

export interface IAccountInfo {
  token: string
}

export interface IUserProfileFormData {
  nickname: string
  gender: string
  // bio: string
  age: string
  avatar_index: number
  avatar_url: string
}

interface IAuthProviderContext {
  loading: boolean
  isLogin: boolean
  account: IAccountInfo | null
  profile: IUserProfile | null
  login?: () => Promise<void>
  registerUser?: (profileData: IUserProfileFormData) => Promise<void>
  getUserProfile?: (token?: string) => Promise<IUserProfile | void>
  updateUserProfile?: (
    profileData: Partial<IUserProfileFormData>
  ) => Promise<void>
  setUserProfile?: Dispatch<React.SetStateAction<IUserProfile | null>>
  setAccount?: (data: IAccountInfo, fetchUser?: boolean) => void
  clearAccount?: () => void
}

const DefaultValue = {
  loading: true,
  isLogin: false,
  account: null,
  profile: null
}

const AuthProviderContext = createContext<IAuthProviderContext>(DefaultValue)

export const useAuthProviderContext = () => {
  const context = useContext(AuthProviderContext)
  if (!context)
    throw new Error('useAuthProviderContext must be used inside AuthProvider')
  return context
}

const USER_PROFILE_KEY = 'sentio:user-profile'

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<IAccountInfo | null>(null)
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(!!AuthTokenManager.token)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Load user profile from localStorage on initial render
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const storedProfile = localStorage.getItem(USER_PROFILE_KEY)
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile)
          setProfile(parsedProfile)
        }
      } catch (error) {
        console.error('Error loading user profile from localStorage:', error)
      }
    }

    loadUserProfile()
  }, [])

  // @ts-ignore
  const login = useCallback(async (invite_code?: string) => {
    // try {
    //   const res = await userLogin(
    //     isInClient
    //       ? {
    //           login_type: 'line',
    //           id_token: idToken,
    //           access_token: accessToken,
    //           invite_code
    //         }
    //       : {
    //           login_type: 'wallet',
    //           text: '',
    //           signature: '',
    //           wallet_addr: ''
    //         },
    //     turnstileToken
    //   )
    //   await handleSetAccount({
    //     token: res.token
    //   })
    //   const user = await getUserProfile()
    //   if (user?.user_id) {
    //     // window?.gtm?.track('login', {
    //     //   platform: isInClient ? 'liff' : 'web',
    //     //   user_id: user.user_id
    //     // })
    //   }
    // } catch (error: any) {
    //   console.log(error)
    //   const errMsg = error?.msg || error?.message
    //   errMsg && Toast.show({ content: errMsg })
    // }
  }, [])

  const getUserProfile = async (token?: string) => {
    return getUserInfo(token)
      .then(res => {
        setProfile(res)
        return res
      })
      .catch(error => {
        setLoading(false)
        console.error(error)
      })
  }

  const handleSetAccount = async (data: IAccountInfo, fetchUser?: boolean) => {
    setAccount(data)
    AuthTokenManager.setSession(data)
    setIsLogin(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
    if (fetchUser) {
      getUserProfile()
    }
  }

  const handleClearAccount = () => {
    setAccount(null)
    setProfile(null)
    AuthTokenManager.clearSession()
    setIsLogin(false)
    localStorage.removeItem(USER_PROFILE_KEY)
  }

  const registerUser = async (
    profileData: IUserProfileFormData
  ): Promise<void> => {
    try {
      setLoading(true)
      const token = uuidv4()

      // Create a new user profile object
      const newProfile: IUserProfile = {
        user_id: uuidv4(),
        nickname: profileData.nickname,
        gender: profileData.gender,
        age: profileData.age,
        // bio: profileData.bio,
        avatar_index: profileData.avatar_index,
        avatar_url: USER_AVATAR_URL[profileData.avatar_index],
        token,
        created_at: Date.now()
      }

      // Save to state
      setProfile(newProfile)

      // Save to localStorage
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile))

      // Set login state
      setIsLogin(true)

      // Create a simple account info
      const accountData: IAccountInfo = {
        token
      }

      // Set account info
      handleSetAccount(accountData, false)
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (
    profileData: Partial<IUserProfileFormData>
  ): Promise<void> => {
    try {
      setLoading(true)

      if (!profile) {
        throw new Error('No user profile found')
      }

      // Create updated profile
      const updatedProfile: IUserProfile = {
        ...profile,
        nickname: profileData.nickname || profile.nickname,
        gender: profileData.gender || profile.gender,
        age: profileData.age || profile.age,
        // bio: profileData.bio || profile.bio,
        avatar_index: profileData.avatar_index || profile.avatar_index,
        avatar_url:
          profileData.avatar_index !== undefined
            ? USER_AVATAR_URL[profileData.avatar_index]
            : profile.avatar_url,
        token: profile.token,
        created_at: profile.created_at
      }

      // Update state
      setProfile(updatedProfile)

      // Update localStorage
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile))
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthProviderContext.Provider
      value={{
        isLogin,
        loading,
        account,
        profile,
        login,
        registerUser,
        getUserProfile,
        updateUserProfile,
        setUserProfile: setProfile,
        setAccount: handleSetAccount,
        clearAccount: handleClearAccount
      }}
    >
      {loading ? (
        <Space
          align="center"
          justify="center"
          style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)'
          }}
        >
          <SpinLoading color="default" />
        </Space>
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  )
}

export default AuthProvider
