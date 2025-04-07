import { request } from '@/request'
import {
  DoLotteryInfo,
  LotteryInfo,
  ResDoClick,
  ShareInfo
} from '@/types/module/home'
import { ReqClaimLottery } from '@/types/request/home'

type DoLotteryDto = {
  banana_info: DoLotteryInfo
  remain_lottery_count: number
}

export async function doLottery() {
  const res = await request.api.post<DoLotteryDto>('/do_lottery', {
    data: {}
  })
  return res as DoLotteryDto
}

export function claimLottery(data: ReqClaimLottery) {
  return request.api.post<LotteryInfo>('/claim_lottery', { data })
}

export async function doClick(data: { clickCount: number }) {
  const res = await request.api.post<ResDoClick>('/do_click', { data })
  return res as ResDoClick
}

export async function fetchLotteryInfo() {
  // const currTime = Date.now();
  const res = (await request.api.get<LotteryInfo>(
    '/get_lottery_info'
  )) as LotteryInfo
  // const timeDiffNew = res.current_time - currTime;
  // if (timeDiffNew > 1000 * 60 * 3) { // 相差3分钟以上才更新
  //   localStorage.setItem('timeDiffNew', timeDiffNew.toString());
  // } else {
  //   localStorage.setItem('timeDiffNew', '0');
  // }
  return res
}

type DoSpeedUpDto = {
  can_view_ads: boolean
  lottery_info: {
    countdown_end: boolean
    countdown_interval: number
    last_countdown_start_time: number
    remain_lottery_count: number
  }
}
export async function doSpeedUp() {
  const res = await request.api.post('/do_speedup', { data: {} })
  return res as DoSpeedUpDto
}

export function getShareInfo() {
  return request.api.get<ShareInfo>('/get_share_info')
}

export function doShare(banana_id: number) {
  return request.api.post<ShareInfo>('/do_share', {
    data: { banana_id }
  })
}
