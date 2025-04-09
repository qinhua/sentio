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
}): Promise<ChatResponse> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '请始终使用中文回复。' },
        ...params.messages
      ],
      temperature: 1,
      max_tokens: 500
    })

    return completion as unknown as ChatResponse
  } catch (error) {
    console.error('Error calling GPT API:', error)
    throw error
  }
}
