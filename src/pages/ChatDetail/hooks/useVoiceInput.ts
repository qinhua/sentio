import { useState, useCallback } from 'react'

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceText, setVoiceText] = useState('')

  const startRecording = useCallback(() => {
    setIsRecording(true)
    // 这里可以添加实际的录音逻辑
    // 模拟录音过程
    setTimeout(() => {
      setVoiceText('这是一段模拟的语音转文字内容')
      setIsRecording(false)
    }, 2000)
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
  }, [])

  const clearVoiceText = useCallback(() => {
    setVoiceText('')
  }, [])

  return {
    isRecording,
    voiceText,
    startRecording,
    stopRecording,
    clearVoiceText
  }
}
