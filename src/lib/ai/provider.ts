import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.DECYRA_API_KEY || process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export interface AIProvider {
  generateText(opts: { systemPrompt?: string; userPrompt: string; maxTokens?: number }): Promise<string>
}

// Fallback model list: use active Gemini 3.x Flash workhorse models
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
]

export const aiProvider: AIProvider = {
  async generateText({ systemPrompt, userPrompt, maxTokens = 1024 }) {
    let lastError: any = null

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.1,
          },
        })

        const result = await model.generateContent(userPrompt)
        const text = result.response.text()
        if (text) return text
      } catch (err: any) {
        console.warn(`Model ${modelName} call failed:`, err?.message || err)
        lastError = err
        // Continue to fallback model on 429 (quota exceeded), 404, or 503
        continue
      }
    }

    throw lastError || new Error('AI generation failed across all available models.')
  },
}

