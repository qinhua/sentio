import { IAccountInfo } from '@/providers/AuthProvider'

export const TOKEN_KEY = 'line-banana:user:token'
export const ACCOUNT_INFO_KEY = 'line-banana:account'

class AuthTokenManagerClass {
  token: string
  accountInfo: IAccountInfo | null

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || ''
    this.accountInfo = JSON.parse(
      localStorage.getItem(ACCOUNT_INFO_KEY) || 'null'
    )
  }
  setSession(account_info: IAccountInfo) {
    const { token } = account_info
    this.token = token
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(account_info))
  }
  clearSession() {
    this.token = ''
    this.accountInfo = null

    // 是否能清除所有数据？
    // localStorage.removeItem(TOKEN_KEY)
    localStorage.clear()
    sessionStorage.clear()
  }
}

export const AuthTokenManager = new AuthTokenManagerClass()
