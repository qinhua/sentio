import { request } from '@/request'
import { IUserProfile } from '@/types/module/user'
import {
  ReqGetAuthUrl,
  ReqSendOTP,
  ReqUserLogin,
  ReqVerifyOTP,
  ReqWithdraw,
  ReqBindWallets,
  ResSignatureText,
  ResTonWalletsPayload,
  ReqGetPeelsHistory,
  ReqGetUSDTHistory,
  ReqCheckTonWalletsProof,
  ResGetPeelsHistory,
  ResGetUSDTHistory,
  ResAuthWallet,
  ReqGetAuthTicket,
  ResGetAuthTicket,
  ReqChatJoinVerify,
  ResChatJoinVerify
} from '@/types/request/user'
import { ResGetSeedBalance } from '@/types/request/shop'
import { ReqAuthWallet } from '@/types/request/user'

// 用户登录
export function userLogin(data: ReqUserLogin, turnstileToken: string) {
  return request.api.post<{ token: string }>('/login', {
    data,
    noToast: true,
    headers: {
      'X-Turnstile-Token': turnstileToken,
      source: data.login_type === 'wallet' ? 'web' : 'liff'
    }
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

export function authWallet(data: ReqAuthWallet) {
  return request.api.post<ResAuthWallet>('/auth_tokens', {
    data: data
  })
}

export function getAuthTicketInfo(params: ReqGetAuthTicket) {
  return request.api.get<ResGetAuthTicket>('/auth_tokens/new', {
    params
  })
}

export function chatJoinVerify(data: ReqChatJoinVerify) {
  return request.api.post<ResChatJoinVerify>('/telegram/chat_join_verify', {
    data: data
  })
}

// 获取授权 url
export function getAuthUrl(params: ReqGetAuthUrl) {
  return request.api.get('/auth/url', { params })
}

// 获取 TonProof Payload
export function getTonWalletsPayload() {
  return request.api.get<ResTonWalletsPayload>('/get_ton_wallets_payload')
}

// 验证 TonProof
export function checkTonWalletsProof(data: ReqCheckTonWalletsProof) {
  return request.api.post('/check_ton_wallets_proof', { data })
}

// 获取签名文本
export function getSignatureText() {
  return request.api.get<ResSignatureText>('/get_signature_text')
}

// 绑定钱包
export function bindWallets(data: ReqBindWallets) {
  return request.api.post('/bind_wallets', { data, noToast: true })
}

// 发送验证码
export function sendOTP(data: ReqSendOTP) {
  return request.api.post('/send_otp', { data, rawResponse: true })
}

// 验证验证码
export function verifyOTP(data: ReqVerifyOTP) {
  return request.api.post('/verify_otp', { data, rawResponse: true })
}

// 提现
export function withdraw(data: ReqWithdraw) {
  return request.api.post('/do_withdraw', {
    data
  })
}

// 获取用户Seed余额
export function getSeedBalance() {
  return request.api.get<ResGetSeedBalance>('/user/seed/balance')
}

// 获取提现 USDT 记录
export function getUSDTHistory(params: ReqGetUSDTHistory) {
  return request.api.get<ResGetUSDTHistory>('/get_usdt_history', {
    params
  }) as Promise<ResGetUSDTHistory>
}

// 获取用户 Peels 记录
export function getPeelHistory(params: ReqGetPeelsHistory) {
  return request.api.get<ResGetPeelsHistory>('/get_peel_history', {
    params
  }) as Promise<ResGetPeelsHistory>
}
