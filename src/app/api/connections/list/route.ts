import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch connections (selecting everything except password_encrypted for security)
    const { data, error } = await supabase
      .from('connections')
      .select('id, name, type, connection_type, host, port, database_name, username, ssl_enabled, status, last_tested_at, created_at, account, warehouse, schema_name, role')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch connections:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (err: any) {
    console.error('List connections error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
