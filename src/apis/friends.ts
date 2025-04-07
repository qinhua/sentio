import { request } from '@/request'
import { ReqGetInvitedList, ResGetInvitedList } from '@/types/request/friends'

export * from '@/types/request/friends'

// 已邀请的好友列表
export function getInvitedList(params: ReqGetInvitedList) {
  return request.api.get<ResGetInvitedList>('/get_invite_list', {
    params
  })
}

type ResClaimToGetUsdt = {
  banana_id: string
  banana_info: {
    banana_id: string
    name?: string
    url?: string
    rarity?: number
    ripeness?: string
  }
}
// 已邀请的好友列表
export function claimToGetUsdt(data: { task_id: string }) {
  return request.api.post<ResClaimToGetUsdt>('/claim_invite_task', {
    data
  })
}
