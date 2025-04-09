export interface MessageItem {
  id: number
  sender: 'counselor' | 'user'
  text: string
  time: string
  date: string
  isFirstOfDay: boolean
  avatar: string
  isLoading?: boolean
}

export interface Doctor {
  id: number
  name: string
  avatar: string
  style: string
  color: string
  expertise: string[]
  description: string
}
