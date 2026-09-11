import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = 'en', sourceLang = 'auto' } = await req.json()

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required for translation' }, { status: 400 })
    }

    const cleanTarget = targetLang === 'auto' ? 'en' : targetLang
    const cleanSource = sourceLang || 'auto'

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      cleanSource
    )}&tl=${encodeURIComponent(cleanTarget)}&dt=t&q=${encodeURIComponent(text.trim())}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Google Translate service responded with error' }, { status: 502 })
    }

    const data = await res.json()

    // Google Translate returns: [[["translated_sentence_1", "orig_1"], ...], null, "detected_source_lang"]
    let translatedText = ''
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translatedText = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('')
    } else {
      translatedText = text
    }

    const detectedSource = (Array.isArray(data) && typeof data[2] === 'string') ? data[2] : cleanSource

    return NextResponse.json({
      translatedText,
      detectedSource,
      targetLang: cleanTarget,
      provider: 'Google Translate',
    })
  } catch (err: any) {
    console.error('Google Translate API error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to translate via Google Translate' },
      { status: 500 }
    )
  }
}
