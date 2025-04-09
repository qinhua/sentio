import { useState, useCallback } from 'react'
import OpenAI from 'openai'

interface GPTMessage {
  role: 'user' | 'assistant'
  content: string
}

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 注意：在生产环境中应该通过后端代理
})

export const useGPT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<GPTMessage[]>(
    []
  )

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true)
      setError(null)

      try {
        // 添加用户消息到历史记录
        const userMessage: GPTMessage = { role: 'user', content: message }
        const updatedHistory = [...conversationHistory, userMessage]
        setConversationHistory(updatedHistory)

        // 调用 OpenAI API
        const completion = await openai.chat.completions.create({
          messages: updatedHistory,
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 1000
        })

        const response =
          completion.choices[0]?.message?.content || '抱歉，我现在无法回答。'

        // 添加助手回复到历史记录
        const assistantMessage: GPTMessage = {
          role: 'assistant',
          content: response
        }
        setConversationHistory(prev => [...prev, assistantMessage])

        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '发生错误，请重试'
        setError(errorMessage)
        console.error('GPT API Error:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [conversationHistory]
  )

  const clearHistory = useCallback(() => {
    setConversationHistory([])
  }, [])

  return {
    isLoading,
    error,
    sendMessage,
    clearHistory
  }
}
