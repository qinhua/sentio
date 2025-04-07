/* eslint-disable @typescript-eslint/no-explicit-any*/
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  Dispatch
} from 'react'
// import { Space, SpinLoading, Toast } from 'antd-mobile'
import { AuthTokenManager } from '@/request/authTokenManager'
import { getUserInfo, userLogin } from '@/apis/user'
import { IUserProfile } from '@/types/module/user'
import { useLocation, useNavigate } from 'react-router-dom'
// import { PATH } from '@/constants/path'
// import { debounce } from 'lodash-es'

export interface IAccountInfo {
  token: string
  chainId: number
  address: string
}
interface IAuthProviderContext {
  loading: boolean
  isLogin: boolean
  account: IAccountInfo | null
  profile: IUserProfile | null
  login?: () => Promise<void>
  getUserProfile?: (token?: string) => Promise<IUserProfile | void>
  setUserProfile?: Dispatch<React.SetStateAction<IUserProfile | null>>
  setAccount?: (data: IAccountInfo, fetchUser?: boolean) => void
  clearAccount?: () => void
}

const DefaultValue = {
  loading: true,
  isInClient: false,
  isLogin: false,
  isConnected: false,
  isWhiteListPage: false,
  turnstileToken: '',
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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accountInfo = AuthTokenManager.accountInfo
  const [account, setAccount] = useState<IAccountInfo | null>(null)
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(!!accountInfo)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // @ts-ignore
  const login = useCallback(async (invite_code?: string) => {
    // try {
    //   if (!turnstileToken) {
    //     setShowTurnstile(true)
    //     return
    //   }
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
    //     token: res.token,
    //     chainId: import.meta.env.VITE_KAIA_CHAIN_ID,
    //     address: ''
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
  }

  // useEffect(
  //   debounce(() => {
  //     if (isWhiteListPage) return

  //     const init = async () => {
  //       setLoading(true)
  //       await getUserProfile()
  //       setAccount(accountInfo)
  //       setIsLogin(true)
  //       setTimeout(() => {
  //         setLoading(false)
  //       }, 500)
  //     }
  //     if (!accountInfo) return

  //     init()
  //   }, 100),
  //   [isWhiteListPage, accountInfo]
  // )

  // useEffect(() => {
  //   if (isWhiteListPage) return

  //   const searchParams = new URLSearchParams(location.search)
  //   const liffState = searchParams.get('liff.state')
  //   const urlPage = liffState
  //     ? new URLSearchParams(liffState).get('page')
  //     : searchParams.get('page')

  //   if (isInClient) {
  //     const inviteCode = searchParams.get('referral') || ''

  //     if (accountInfo?.token) {
  //       if (inviteCode) {
  //         console.log('登录时，有邀请码')
  //         // 已登录 & 有邀请码，重新登录一次，记录邀请
  //         login(inviteCode)
  //       } else {
  //         console.log('登录时，无邀请码')
  //         // 已登录 & 无邀请码，只更新用户信息
  //         // getUserProfile()
  //       }
  //     } else {
  //       // 未登录时
  //       console.log('未登录时')
  //       login(inviteCode)
  //     }
  //   }

  //   // 原页面重定向
  //   if (urlPage) {
  //     if (urlPage === 'tasks') {
  //       navigate(PATH.tasks)
  //     }
  //   }
  // }, [isWhiteListPage, accountInfo?.token, turnstileToken])

  // // 为了确保数据准备，每次进首页都获取一次用户信息
  // useEffect(() => {
  //   if (isLogin && !isFirstLoad && pathname.includes(PATH.home)) {
  //     getUserProfile()
  //   } else {
  //     setIsFirstLoad(false) // 第一次加载后设置为 false
  //   }
  // }, [pathname, isLogin, isFirstLoad])

  // if (isInClient && !isWhiteListPage && (!accessToken || !idToken))
  //   return (
  //     <Space
  //       align="center"
  //       justify="center"
  //       style={{
  //         width: '100vw',
  //         height: '100vh'
  //       }}
  //     >
  //       <SpinLoading color="default" />
  //     </Space>
  //   )

  return (
    <AuthProviderContext.Provider
      value={{
        isLogin,
        loading,
        account,
        profile,
        login,
        getUserProfile,
        setUserProfile: setProfile,
        setAccount: handleSetAccount,
        clearAccount: handleClearAccount
      }}
    >
      {children}
      {/* <>
        {isWhiteListPage || !isInClient || (isInClient && isLogin)
          ? children
          : null}
        <DialogTurnstile
          visible={showTurnstile}
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
          onClose={() => setShowTurnstile(false)}
        />
      </> */}
    </AuthProviderContext.Provider>
  )
}

export default AuthProvider
