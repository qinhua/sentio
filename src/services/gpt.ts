import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

type MessageContent =
  | string
  | Array<{
      type: 'text' | 'image_url'
      text?: string
      image_url?: {
        url: string
        detail?: 'low' | 'high'
      }
    }>

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: MessageContent
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
    msg =>
      msg.role === 'system' &&
      typeof msg.content === 'string' &&
      msg.content.includes('中文回复')
  )

  if (!hasChineseInstruction) {
    // 添加到消息列表末尾
    return [...messages, chineseInstruction]
  }

  return messages
}

// 将图片转换为 base64
const imageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert image to base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const chat = async (params: {
  messages: Message[]
  onStreamUpdate?: (content: string) => void
  attachments?: File[]
}): Promise<ChatResponse> => {
  const maxRetries = 2
  const timeoutMs = 30000 // 30秒超时
  let retries = 0

  // 处理附件
  let messagesWithAttachments = [...params.messages]
  if (params.attachments && params.attachments.length > 0) {
    const lastMessage =
      messagesWithAttachments[messagesWithAttachments.length - 1]
    if (lastMessage.role === 'user') {
      const attachmentContents = await Promise.all(
        params.attachments.map(async file => {
          const base64 = await imageToBase64(file)
          return {
            type: 'image_url' as const,
            image_url: {
              url: base64,
              detail: 'low' as const
            }
          }
        })
      )

      // 如果最后一条消息是纯文本，将其转换为数组格式
      if (typeof lastMessage.content === 'string') {
        lastMessage.content = [
          {
            type: 'text' as const,
            text: lastMessage.content
          },
          ...attachmentContents
        ]
      } else {
        lastMessage.content = [...lastMessage.content, ...attachmentContents]
      }
    }
  }

  // 添加中文系统提示
  const messagesWithInstruction = ensureChineseInstruction(
    messagesWithAttachments
  )

  while (retries <= maxRetries) {
    try {
      if (params.onStreamUpdate) {
        // 流式响应
        const stream = await withTimeout(
          openai.chat.completions.create({
            ...MODEL_CONFIG,
            messages: messagesWithInstruction as any, // 由于 OpenAI 类型定义的限制，这里需要类型断言
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
            if (params.onStreamUpdate) {
              params.onStreamUpdate(fullResponse)
            }
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
            messages: messagesWithInstruction as any // 由于 OpenAI 类型定义的限制，这里需要类型断言
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

export const sendGPTMessage = async (
  message: string,
  attachments: File[] = []
) => {
  try {
    const response = await chat({
      messages: [{ role: 'user', content: message }],
      attachments,
      onStreamUpdate: (_content: string) => {
        // Handle stream updates if necessary
      }
    })
    return response
  } catch (error) {
    console.error('Error sending GPT message:', error)
    throw error
  }
}
