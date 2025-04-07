import { BananaRewardInfo, TaskItem } from '../module/tasks'

export interface ReqAchieveQuest {
  quest_id: number
}

export interface ReqClaimQuest {
  quest_id: number
}

export interface ResClaimQuest {
  peel: number
  banana_reward: BananaRewardInfo
  total: number
  quest_info: TaskItem
  progress: string
  is_claimed: boolean
  completed: number
}

export interface ResQuestList {
  list: TaskItem[]
  total: number
  progress: string
  completed: number
}
