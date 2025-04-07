/* eslint-disable @typescript-eslint/no-explicit-any */
import { PeelHistory, USDTHistory } from '../module/home'
import { EnumWalletType } from '../module/user'

export interface ReqUserLogin {
  login_type: 'line' | 'wallet'
  id_token?: string
  access_token?: string
  text?: string
  signature?: string
  wallet_addr?: string
  invite_code?: string
}

export interface ReqGetAuthUrl {
  type: 'protocol' | 'twitter'
  redirectUrl?: string
}

export interface ResTonWalletsPayload {
  payload: string
}

export interface ResSignatureText {
  text: string
}

export interface ReqCheckTonWalletsProof {
  wallet_type: EnumWalletType
  address: string
  network: number
  proof: any
}

export interface ReqBindWallets {
  signature: string
  text: string
  wallet_addr: string
}

export interface ReqSendOTP {
  email: string
}

export interface ReqVerifyOTP {
  otp: string
}

export interface ReqWithdraw {
  wallet_type: EnumWalletType
  // recaptchaToken: string
}

export interface ReqGetUSDTHistory {
  pageNum: number
  pageSize: number
}

export interface ResGetUSDTHistory {
  total: number
  list: USDTHistory[]
}

export interface ReqGetPeelsHistory {
  pageNum: number
  pageSize: number
}

export interface ResGetPeelsHistory {
  total: number
  list: PeelHistory[]
}

export interface ReqAuthWallet {
  signature: string
  message: string
  ticket: string
}

export interface ResAuthWallet {
  address: string
  token: string
  expires_at: string
}
export interface ReqGetAuthTicket {
  chain_id?: bigint
  address: string
}

export interface ResGetAuthTicket {
  message: string
  ticket: string
}

export interface ReqUpdateUserInfo {
  name: string
  avatar_url: string
}

export interface ReqChatJoinVerify {
  verify_token: string
}

export interface ResChatJoinVerify {
  code: number
  message: string
  detail: string
}
