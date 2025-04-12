import { request } from '@/request'
import { IUserProfile } from '@/types/module/user'
import { ReqUserLogin } from '@/types/request/user'

// 用户登录
export function userLogin(data: ReqUserLogin, _turnstileToken: string) {
  return request.api.post<{ token: string }>('/login', {
    data,
    noToast: true
    // headers: {
    //   'X-Turnstile-Token': turnstileToken
    // }
  })
}

// 获取用户信息
export function getUserInfo(token?: string) {
  return request.api.get<IUserProfile>('/get_user_info', {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
}
