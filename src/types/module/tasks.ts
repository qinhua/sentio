export interface TaskItem {
  quest_id: number
  quest_name: string
  quest_type: string
  icon_url: string
  show_seq_number: number
  description: string
  start_link: string
  peel: number
  claim_type: string
  claim_limit: number
  claimed_count: number
  is_achieved: boolean
  is_claimed: boolean
  args?: {
    banana_reward: BananaRewardInfo
  }
}

export interface BananaRewardInfo {
  banana_id: number
  count: number
  banana_info: {
    banana_id: number
    name: string
    url: string
    rarity: number
    ripeness: string
    ripeness_sub_level: number
    exclusive_icon_url?: string
    daily_peel_limit: number
    sell_exchange_peel: number
    sell_exchange_usdt: number
    count: number
  }
}
