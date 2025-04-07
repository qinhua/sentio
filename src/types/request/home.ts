import { ClaimLotteryType } from '../module/home'

export interface ResClaimLottery {
  remain_lottery_count: number
  last_countdown_start_time: number
  countdown_interval: number
  countdown_end: boolean
}

export interface ReqClaimLottery {
  claimLotteryType: ClaimLotteryType
}
