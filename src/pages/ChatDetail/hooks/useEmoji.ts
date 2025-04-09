import { useState, useCallback } from 'react'

export const useEmoji = () => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const toggleEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen(prev => !prev)
  }, [])

  const closeEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen(false)
  }, [])

  const onEmojiSelect = useCallback(
    (emoji: string) => {
      // 这里可以添加选择表情后的处理逻辑
      console.log('Selected emoji:', emoji)
      closeEmojiPicker()
    },
    [closeEmojiPicker]
  )

  return {
    isEmojiPickerOpen,
    toggleEmojiPicker,
    closeEmojiPicker,
    onEmojiSelect
  }
}
