export interface MessageItem {
  id: string
  sender: 'counselor' | 'user'
  text: string
  time: string
  date: string
  isFirstOfDay: boolean
  avatar: string
  isLoading?: boolean
}

export interface DoctorItem {
  id: number
  name: string
  avatar: string
  style: string
  color: string
  method: string
  expertise: string[]
  bio: string
  prompt_style: string[]
  prompt: string
}
