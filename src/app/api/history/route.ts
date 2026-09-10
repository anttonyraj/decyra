import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('queries_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('[Query History API] Could not fetch queries_history table:', error.message)
      return NextResponse.json({ history: [] })
    }

    return NextResponse.json({ history: data || [] })
  } catch (err: any) {
    console.error('History GET error:', err)
    return NextResponse.json({ history: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.question || !body.sql) {
      return NextResponse.json({ error: 'Missing question or sql' }, { status: 400 })
    }

    const { question, sql, intent, rowCount = 0, connectionId = 'demo', connectionName = 'Demo Database' } = body

    const { data, error } = await supabase
      .from('queries_history')
      .insert({
        user_id: user.id,
        question,
        sql,
        intent: intent || '',
        row_count: Number(rowCount) || 0,
        is_favorite: false,
        connection_id: String(connectionId || 'demo'),
        connection_name: String(connectionName || 'Demo Database')
      })
      .select()
      .single()

    if (error) {
      console.warn('[Query History API] Insert error:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 200 })
    }

    return NextResponse.json({ success: true, item: data })
  } catch (err: any) {
    console.error('History POST error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { id, isFavorite } = body

    const { data, error } = await supabase
      .from('queries_history')
      .update({ is_favorite: Boolean(isFavorite) })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, item: data })
  } catch (err: any) {
    console.error('History PATCH error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    if (id === 'all') {
      const { error } = await supabase
        .from('queries_history')
        .delete()
        .eq('user_id', user.id)

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase
      .from('queries_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('History DELETE error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
