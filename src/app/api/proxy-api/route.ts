import { NextRequest, NextResponse } from 'next/server'

/**
 * Secure Server-Side REST API Proxy
 * Bypasses browser CORS restrictions to allow fetching data from Stripe, Shopify, GitHub,
 * Jira, or internal corporate microservices.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, method = 'GET', headers = {}, requestBody } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 })
    }

    // Security check: validate protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json({ error: 'URL must start with http:// or https://' }, { status: 400 })
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Decyra-API-Connector/1.0',
        ...headers,
      },
    }

    if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && requestBody) {
      fetchOptions.body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody)
      if (!fetchOptions.headers || !('Content-Type' in fetchOptions.headers)) {
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json'
      }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API endpoint returned HTTP ${response.status}: ${errorText.slice(0, 300)}` },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const jsonData = await response.json()
      return NextResponse.json({ data: jsonData })
    } else {
      const textData = await response.text()
      try {
        const parsed = JSON.parse(textData)
        return NextResponse.json({ data: parsed })
      } catch {
        return NextResponse.json(
          { error: 'Endpoint returned non-JSON text. Expected JSON response.' },
          { status: 400 }
        )
      }
    }
  } catch (err: any) {
    console.error('REST API proxy error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to connect to REST API endpoint.' },
      { status: 500 }
    )
  }
}
