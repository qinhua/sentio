import { EnumUserGender } from '@/enum/common'

export interface MessageItem {
  id: string
  sender: 'counselor' | 'user'
  text: string
  time: string
  date: string
  avatar: string
  gender: EnumUserGender
  isFirstOfDay: boolean
  isLoading?: boolean
}

export interface DoctorItem {
  id: number
  name: string
  gender: EnumUserGender
  avatar: string
  style: string
  color: string
  method: string
  expertise: string[]
  bio: string
  prompt_style: string[]
  prompt: string
}
