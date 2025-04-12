import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// 模型配置
const MODEL_CONFIG = {
  model: 'gpt-4o',
  temperature: 1,
  max_tokens: 600
}

// 超时控制函数
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([promise, timeout])
}

// 确保中文系统提示被添加
const ensureChineseInstruction = (messages: Message[]): Message[] => {
  const chineseInstruction: Message = {
    role: 'system',
    content: '请始终使用中文回复。'
  }

  // 检查是否已经包含中文系统提示
  const hasChineseInstruction = messages.some(
    msg => msg.role === 'system' && msg.content.includes('中文回复')
  )

  if (!hasChineseInstruction) {
    // 添加到消息列表末尾
    return [...messages, chineseInstruction]
  }

  return messages
}

export const chat = async (params: {
  messages: Message[]
  onStreamUpdate?: (content: string) => void
}): Promise<ChatResponse> => {
  const maxRetries = 2
  const timeoutMs = 30000 // 30秒超时
  let retries = 0

  // 添加中文系统提示
  const messagesWithInstruction = ensureChineseInstruction(params.messages)

  while (retries <= maxRetries) {
    try {
      if (params.onStreamUpdate) {
        // 流式响应
        const stream = await withTimeout(
          openai.chat.completions.create({
            ...MODEL_CONFIG,
            messages: messagesWithInstruction,
            stream: true
          }),
          timeoutMs
        )

        let fullResponse = ''
        let hasReceivedContent = false

        // 处理流式响应
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            hasReceivedContent = true
            fullResponse += content
            // 调用回调函数更新UI
            params.onStreamUpdate(fullResponse)
          }
        }

        // 确保最后一次更新被调用
        if (fullResponse && params.onStreamUpdate) {
          params.onStreamUpdate(fullResponse)
        }

        // 如果没有收到任何内容，抛出错误
        if (!hasReceivedContent) {
          throw new Error('No content received from GPT')
        }

        // 返回完整响应
        return {
          choices: [
            {
              message: {
                content: fullResponse
              }
            }
          ]
        }
      } else {
        // 非流式响应
        const completion = await withTimeout(
          openai.chat.completions.create({
            ...MODEL_CONFIG,
            messages: messagesWithInstruction
          }),
          timeoutMs
        )

        return completion as unknown as ChatResponse
      }
    } catch (error) {
      retries++
      console.error(
        `Error calling GPT API (attempt ${retries}/${maxRetries + 1}):`,
        error
      )

      // 如果已达到最大重试次数，则抛出错误
      if (retries > maxRetries) {
        throw error
      }

      // 否则等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * retries))
    }
  }

  // 这行代码应该永远不会执行，但TypeScript需要它
  throw new Error('Unexpected error in chat function')
}
