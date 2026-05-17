import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface AIProvider {
  generateText(opts: { systemPrompt?: string; userPrompt: string; maxTokens?: number }): Promise<string>
}

export const aiProvider: AIProvider = {
  async generateText({ systemPrompt, userPrompt, maxTokens = 1024 }) {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.1,
      },
    })

    const result = await model.generateContent(userPrompt)
    const text = result.response.text()
    return text
  },
}
