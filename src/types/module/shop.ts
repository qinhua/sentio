export interface BananaProductItem {
  id: number
  title: string
  description: string
  image_url: string
  show_above: boolean
  ripeness: string
  seed_price: number
  ordinal: number
}

export interface BananaSeedProductItem {
  id: number
  type: string
  name: string
  image_url: string
  usd_price: string
  krw_price: string
  jpy_price: string
  twd_price: string
  thb_price: string
  kaia_price: string
  amount: number
  gift_for_first: number
  gift: number
  ordinal: number
}

export interface PaymentHistoryItem {
  id: string
  user_id: string
  payment_id: string
  currency: string // usd | jpy | krw | TWD | THB | kaia
  price: number
  seed: number
  seed_balance: number // 订单完成才会有这个字段
  status: string // CREATED | STARTED | REGISTERED_ON_PG | CAPTURED | CONFIRMED | CONFIRM_FAILED | FINALZED | CANCELED
  created_time: string
  updated_time: string
}

export interface IBananaMintItem {
  cate_id: number
  cate_name: string
  legend_banana_info: ILegendBananaInfo
  collections: IBananaCollenctionItem[]
  can_mint: boolean
}

export interface ILegendBananaInfo {
  banana_id: number
  banana_name: string
  image_url: string
  peels: number
  usdt: number
  ripeness: string
  // 附加
  ripenessColor?: string
  ripenessTagImg?: string
  ripenessShadowColor?: string
  url?: string
  urlHalf?: string
  urlQuarter?: string
}

export interface IBananaCollenctionItem {
  banana_id: number
  banana_name: string
  image_url: string
  count: number
  ordinal: number
  ripeness: string
  // 附加
  ripenessColor?: string
  ripenessTagImg?: string
  ripenessShadowColor?: string
  url?: string
  urlHalf?: string
  urlQuarter?: string
}
