import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiKey = process.env.DECYRA_API_KEY || process.env.GEMINI_API_KEY || ''
const groqKey = process.env.GROQ_API_KEY || ''
const genAI = new GoogleGenerativeAI(geminiKey)

export interface AIProvider {
  generateText(opts: { systemPrompt?: string; userPrompt: string; maxTokens?: number }): Promise<string>
}

// Ultra-fast Groq models (running on LPU silicon: 300ms - 900ms execution)
// Qwen 3.8 is the leading code/SQL generator on Groq's high-speed chips
const GROQ_CANDIDATE_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
]

// Fallback Gemini Flash models
const GEMINI_CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-3.6-flash',
]

async function tryGroq(opts: { systemPrompt?: string; userPrompt: string; maxTokens?: number }): Promise<string | null> {
  if (!groqKey) return null

  for (const model of GROQ_CANDIDATE_MODELS) {
    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = []
      if (opts.systemPrompt) {
        messages.push({ role: 'system', content: opts.systemPrompt })
      }
      messages.push({ role: 'user', content: opts.userPrompt })

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_completion_tokens: Math.min(opts.maxTokens || 400, 500),
          temperature: 0,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.warn(`Groq model ${model} returned ${res.status}:`, errText)
        continue
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content && typeof content === 'string') {
        return content
      }
    } catch (err: any) {
      console.warn(`Groq model ${model} fetch failed:`, err?.message || err)
      continue
    }
  }

  return null
}

export const aiProvider: AIProvider = {
  async generateText(opts) {
    // 1. Try ultra-fast Groq LPU engine first if key is present
    if (groqKey) {
      const groqResult = await tryGroq(opts)
      if (groqResult) {
        return groqResult
      }
      console.info('Groq call fell back to Google Gemini Flash...')
    }

    // 2. Gemini fallback
    let lastError: any = null

    for (const modelName of GEMINI_CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: opts.systemPrompt,
          generationConfig: {
            maxOutputTokens: opts.maxTokens || 1024,
            temperature: 0,
          },
        })

        const result = await model.generateContent(opts.userPrompt)
        const text = result.response.text()
        if (text) return text
      } catch (err: any) {
        console.warn(`Gemini model ${modelName} call failed:`, err?.message || err)
        lastError = err
        continue
      }
    }

    throw lastError || new Error('AI generation failed across all available models.')
  },
}
