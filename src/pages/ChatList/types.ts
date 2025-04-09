import { DoctorItem } from '../ChatDetail/types'

export interface ChatItem extends DoctorItem {
  chat_id: number
  last_message: string
  time: number
  unread: number
}
