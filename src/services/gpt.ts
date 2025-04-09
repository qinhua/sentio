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

export const chat = async (params: {
  messages: Message[]
  onStreamUpdate?: (content: string) => void
}): Promise<ChatResponse> => {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '请始终使用中文回复。' },
        ...params.messages
      ],
      stream: true,
      temperature: 1,
      max_tokens: 600
    })

    let fullResponse = ''
    let hasReceivedContent = false

    // 处理流式响应
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        hasReceivedContent = true
        fullResponse += content
        // 调用回调函数更新UI
        params.onStreamUpdate?.(fullResponse)
      }
    }

    // 确保最后一次更新被调用
    if (params.onStreamUpdate && fullResponse) {
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
  } catch (error) {
    console.error('Error calling GPT API:', error)
    // 确保错误被正确传播
    throw error
  }
}
