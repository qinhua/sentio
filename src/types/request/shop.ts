import {
  PaymentHistoryItem,
  IBananaMintItem,
  BananaProductItem,
  BananaSeedProductItem
} from '../module/shop'

export interface ResGetSeedBalance {
  user_id: string
  seed_balance: number
}

export interface ResGetBananaProduct {
  products: BananaProductItem[]
}

export interface ResGetSeedProduct {
  is_first: boolean // 是否首次充值
  products: BananaSeedProductItem[]
}

export interface ResBuySeedProduct {
  shop_order: {
    shop_order_id: number
    product_id: number
  }
  banana: {
    id: number
    name: string
    ripeness: string
    image_url: string
  }
}

export interface ReqCreateOrder {
  product_id: number
  currency: 'usd' | 'krw' | 'jpy' | 'twd' | 'thb' | 'kaia'
  price: number
}

export interface ResCreateOrder {
  payment_id: string
}

export interface ResGetOrder {
  payment_id: string
  status: string // CREATED | STARTED | REGISTERED_ON_PG | CAPTURED | CONFIRMED | CONFIRM_FAILED | FINALIZED | CANCELED
  created_time: string
  updated_time: string
}

export interface ResPaymentHistory {
  orders: PaymentHistoryItem[]
}

export interface ResGetBananaMintList {
  mint_list: IBananaMintItem[]
}

export interface ReqPaymentReason {
  reasons: { payment_id: string; reason: string }[]
}
