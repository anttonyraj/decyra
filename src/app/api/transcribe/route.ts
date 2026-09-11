import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.DECYRA_API_KEY || process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const audio = body?.audio
    const mimeType = body?.mimeType || 'audio/webm'
    const language = body?.language || 'auto'

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json({ error: 'Audio base64 data is required' }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'AI transcription service key is missing' }, { status: 500 })
    }

    const cleanBase64 = audio.includes('base64,') ? audio.split('base64,')[1] : audio

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0,
      },
    })

    const prompt = `You are an expert audio speech-to-text transcriber for business intelligence.
Listen carefully to this voice audio.
Target spoken language: ${language === 'ar' ? 'Arabic' : language}.
Return ONLY a valid JSON object with exact keys:
{
  "transcript": "<exact verbatim words spoken in the original language, e.g. in Arabic or English>",
  "detectedLanguage": "<detected language name, e.g. Arabic, English, Spanish>",
  "englishTranslation": "<faithful English translation of the question if spoken in Arabic or another language. If already in English, repeat the transcript here>"
}
Do not write markdown backticks or extra words. Output only valid JSON.`

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType.split(';')[0] || 'audio/webm',
          data: cleanBase64,
        },
      },
      prompt,
    ])

    const rawText = result.response.text().trim()
    let parsed: any = null

    try {
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
      parsed = JSON.parse(cleanJson)
    } catch {
      parsed = {
        transcript: rawText,
        englishTranslation: rawText,
        detectedLanguage: language,
      }
    }

    return NextResponse.json({
      transcript: parsed.transcript || rawText,
      englishTranslation: parsed.englishTranslation || parsed.transcript || rawText,
      detectedLanguage: parsed.detectedLanguage || language,
    })
  } catch (err: any) {
    console.error('Audio transcription API error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
