export interface IUserProfile {
  user_id: string
  username: string
  peel: number
  usdt: number
  equip_banana_id: number
  equip_banana: {
    banana_id: number
    name: string
    url: string
    ripeness: string
    daily_peel_limit: number
    sell_exchange_peel: number
    sell_exchange_usdt: number
    exclusive_icon_url: string
    count: number
  }
  max_click_count: number
  today_click_count: number
  invite_code: string
  lottery_info: {
    remain_lottery_count: number
    last_countdown_start_time: number
    countdown_interval: number
    countdown_end: false
    current_time: number
  }
  evm_wallet: string
  banana_count: number
  speedup_count: number

  // // 以下面为准
  // avatarUrl?: string
  // bio?: string
  // gender?: string
  // im?: {
  //   accessToken?: string
  //   provider?: string
  // }
  // nickname?: string
  // outId?: string
  // evm_wallet: string
}

export enum EnumWalletType {
  KAIA_WALLET = 'KAIA_WALLET',
  TON_WALLET = 'TON_WALLET',
  BINANCE_TON_WALLET = 'BINANCE_TON_WALLET'
}
