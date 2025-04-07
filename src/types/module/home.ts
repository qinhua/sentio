export enum ClaimLotteryType {
  COUNTDOWN = 1,
  INVITE = 2,
  PREMIUM = 3
}

export interface ResDoClick {
  speedup: number
  peel: number
  can_view_ads: boolean
  peel_total: number
  today_click_count: number
}

export interface DoLotteryInfo {
  id: number
  banana_id: number
  name: string
  url: string
  image_url?: string
  rarity: number
  ripeness: string
  ripeness_sub_level: number
  daily_peel_limit: number
  sell_exchange_peel: number
  sell_exchange_usdt: number
  count: number
}

export interface LotteryInfo {
  countdown_end: boolean
  countdown_interval: number
  last_countdown_start_time: number
  remain_lottery_count: number
  current_time: number
}

export interface USDTHistory {
  user_id: number
  source_type: 'sell_banana' | 'withdraw'
  usdt: number
  desc: string
  status: string
  time: number
}

export interface PeelHistory {
  user_id: number
  source_type: 'click' | 'quest' | 'share' | 'sell_banana'
  source_id: string
  count: number
  desc: string
  time: number
}

export interface ShareInfo {
  lottery: number
  peel: number
  share_count: number
  share_progress: number

  remain_lottery_count: number
  peel_total: number
}
