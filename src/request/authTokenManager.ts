import { IAccountInfo } from '@/providers/AuthProvider'

export const TOKEN_KEY = 'sentio:user-token'

class AuthTokenManagerClass {
  token: string

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || ''
  }
  setSession(account_info: IAccountInfo) {
    const { token } = account_info
    this.token = token
    localStorage.setItem(TOKEN_KEY, token)
  }
  clearSession() {
    this.token = ''

    // 是否能清除所有数据？
    localStorage.clear()
    sessionStorage.clear()
  }
}

export const AuthTokenManager = new AuthTokenManagerClass()
