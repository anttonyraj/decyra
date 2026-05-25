import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let client: Client | null = null
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body & validate
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { host, port, databaseName, username, password, sslEnabled } = body

    if (!host || !port || !databaseName || !username || !password) {
      return NextResponse.json({ error: 'Missing required credentials' }, { status: 400 })
    }

    // 3. Connect to user's database
    client = new Client({
      host,
      port: Number(port) || 5432,
      database: databaseName,
      user: username,
      password,
      connectionTimeoutMillis: 10000, // 10s connection timeout
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    })

    await client.connect()

    // 4. Run test query
    await client.query('SELECT 1 as test')

    // 5. Introspect schema
    const schemaRes = await client.query(`
      SELECT
        table_schema,
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name, ordinal_position
    `)

    // Extract table count
    const uniqueTables = new Set(schemaRes.rows.map(row => `${row.table_schema}.${row.table_name}`))
    const tableCount = uniqueTables.size

    return NextResponse.json({
      success: true,
      tableCount,
      tables: Array.from(uniqueTables),
    })

  } catch (err: any) {
    console.error('Database connection test failed:', err)
    return NextResponse.json({
      success: false,
      error: err.message || 'Database connection failed. Please check your network and credentials.'
    }, { status: 500 })
  } finally {
    if (client) {
      await client.end().catch((e) => console.error('Error closing test client:', e))
    }
  }
}
