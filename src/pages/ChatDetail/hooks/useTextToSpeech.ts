import { useState, useCallback, useRef, useEffect } from 'react'
import { EnumUserGender } from '@/enum/common'

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化语音合成
  const initSpeechSynthesis = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis

      // 加载可用的声音
      const loadVoices = () => {
        const availableVoices = speechSynthesisRef.current?.getVoices() || []
        setVoices(availableVoices)
      }

      // 某些浏览器需要等待声音加载
      if (speechSynthesisRef.current?.getVoices().length) {
        loadVoices()
      } else {
        speechSynthesisRef.current?.addEventListener(
          'voiceschanged',
          loadVoices
        )
      }

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

  // 根据性别选择合适的声音
  const selectVoiceByGender = useCallback(
    (gender: EnumUserGender) => {
      if (!voices.length) return null

      // 按语言过滤声音
      const chineseVoices = voices.filter(
        voice =>
          voice.lang.includes('zh') || voice.lang.toLowerCase().includes('cn')
      )

      console.log('chineseVoices', chineseVoices)

      if (!chineseVoices.length) return null

      // 根据性别选择声音
      if (gender === EnumUserGender.MALE) {
        // 尝试找到中文男声
        const maleVoice = chineseVoices.find(
          voice =>
            voice.name.toLowerCase().includes('male') ||
            voice.name.toLowerCase().includes('男')
        )
        if (maleVoice) return maleVoice
      } else if (gender === EnumUserGender.FEMALE) {
        // 尝试找到中文女声
        const femaleVoice = chineseVoices.find(
          voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('女')
        )
        if (femaleVoice) return femaleVoice
      }

      // 如果没有找到匹配的声音，返回第一个中文声音
      return chineseVoices[0]
    },
    [voices]
  )

  // 播放文本
  const speak = useCallback(
    (
      text: string,
      gender: EnumUserGender = EnumUserGender.FEMALE,
      lang = 'zh-CN'
    ) => {
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
      if (gender === EnumUserGender.MALE) {
        utterance.lang = lang
        utterance.rate = 1.2
        utterance.pitch = 0.1
        utterance.volume = 1.0
      } else {
        utterance.lang = lang
        utterance.rate = 1.2
        utterance.pitch = 1.2
        utterance.volume = 1.0
      }

      // 根据性别选择声音
      const selectedVoice = selectVoiceByGender(gender)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

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
    [isSpeaking, initSpeechSynthesis, stopSpeaking, selectVoiceByGender]
  )

  // 在组件卸载时停止语音
  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [stopSpeaking])

  return {
    speak,
    stopSpeaking,
    isSpeaking
  }
}
