import { useState, useCallback, useEffect } from 'react'

// 添加 Web Speech API 的类型定义
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
  prototype: SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export const useVoice = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcribedText, setTranscribedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'zh-CN'

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        console.log('event', event)
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')

        console.log('transcript', transcript)
        setTranscribedText(transcript)
      }

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setTranscribedText('语音识别出错，请重试')
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (!recognition) {
      setTranscribedText('您的浏览器不支持语音识别')
      return
    }
    try {
      recognition.start()
      setIsRecording(true)
      setRecordingTime(0)
      setTranscribedText('')

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setTranscribedText('无法启动语音识别，请重试')
    }
  }, [recognition])

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop()
      setIsRecording(false)
    }
  }, [recognition, isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearTranscribedText = useCallback(() => {
    setTranscribedText('')
  }, [])

  return {
    isRecording,
    recordingTime,
    transcribedText,
    isProcessing,
    startRecording,
    stopRecording,
    formatTime,
    clearTranscribedText
  }
}
