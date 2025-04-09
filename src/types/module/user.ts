export interface IUserProfile {
  user_id: string
  nickname: string
  gender: string
  bio: string
  avatar_index: number
  avatar_url?: string
  token?: string
  created_at: number
}

export enum EnumWalletType {
  KAIA_WALLET = 'KAIA_WALLET',
  TON_WALLET = 'TON_WALLET',
  BINANCE_TON_WALLET = 'BINANCE_TON_WALLET'
}
