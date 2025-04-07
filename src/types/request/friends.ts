import { InviteItem } from '../module/friends'

export enum InviteType {
  Total = 1,
  Premium = 2
}

type InviteTaskItem = {
  task_id: string
  need_invite_count: number
  is_achieved: boolean
  is_claimed: boolean
}

export interface ReqGetInvitedList {
  pageNum: number
  pageSize: number
  inviteType: number
}

export interface ResGetInvitedList {
  claim: boolean
  receive_lottery_count: number
  claim_lottery_count: number
  total_invite: number
  invite_list: InviteItem[]
  invite_tasks: InviteTaskItem[]
}

