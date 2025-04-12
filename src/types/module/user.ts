import { EnumUserGender } from '@/enum/common'

export interface IUserProfile {
  user_id: string
  nickname: string
  gender: EnumUserGender
  // bio: string
  age: number
  avatar_index: number
  avatar_url?: string
  token?: string
  created_at: number
}
