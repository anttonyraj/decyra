import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, connector } = body
    if (!email || !connector) {
      return NextResponse.json({ error: 'Email and connector are required' }, { status: 400 })
    }

    console.log(`[Waitlist Capture] Email: ${email}, Connector: ${connector}`)

    // Attempt to record in Supabase waitlist table
    const supabase = await createClient()
    const { error: dbError } = await supabase.from('waitlist').insert({
      email,
      connector,
    })

    if (dbError) {
      console.warn('[Waitlist Database Warning] Failed to insert waitlist record (this is normal if the waitlist table is not created yet):', dbError.message)
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Waitlist capture route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
