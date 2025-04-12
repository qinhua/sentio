import { DoctorItem } from '../ChatDetail/types'
import { EnumUserGender } from '@/enum/common'

export interface ChatItem extends DoctorItem {
  chat_id: number
  last_message: string
  time: number
  unread: number
  gender: EnumUserGender
}
