import { useState, useCallback, useRef } from 'react'

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化语音合成
  const initSpeechSynthesis = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis
      return true
    }
    return false
  }, [])

  // 停止当前语音
  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // 播放文本
  const speak = useCallback(
    (text: string, lang = 'zh-CN') => {
      // 如果已经在播放，先停止
      if (isSpeaking) {
        stopSpeaking()
      }

      // 初始化语音合成
      if (!speechSynthesisRef.current && !initSpeechSynthesis()) {
        console.error('Text-to-speech is not supported in this browser')
        return
      }

      // 创建新的语音合成实例
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 1.2
      utterance.pitch = 1.2
      utterance.volume = 1.0

      // 设置事件处理
      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = event => {
        console.error('Speech synthesis error:', event)
        setIsSpeaking(false)
      }

      // 保存引用以便后续可以停止
      utteranceRef.current = utterance

      // 开始播放
      speechSynthesisRef.current?.speak(utterance)
    },
    [isSpeaking, initSpeechSynthesis, stopSpeaking]
  )

  return {
    speak,
    stopSpeaking,
    isSpeaking
  }
}
