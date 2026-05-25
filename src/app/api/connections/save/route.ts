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

    const { name, host, port, databaseName, username, password, sslEnabled } = body

    if (!name || !host || !port || !databaseName || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 3. Connect to user's database to verify connection before saving
    client = new Client({
      host,
      port: Number(port) || 5432,
      database: databaseName,
      user: username,
      password,
      connectionTimeoutMillis: 10000, // 10s timeout
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    })

    await client.connect()

    // 4. Run simple test query
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

    // Format schema info as a structured text block for the AI prompt
    const tablesMap: Record<string, string[]> = {}
    for (const row of schemaRes.rows) {
      const tableIdentifier = `${row.table_schema}.${row.table_name}`
      if (!tablesMap[tableIdentifier]) {
        tablesMap[tableIdentifier] = []
      }
      tablesMap[tableIdentifier].push(`  ${row.column_name} (${row.data_type})`)
    }

    let schemaInfoText = ""
    for (const [table, columns] of Object.entries(tablesMap)) {
      schemaInfoText += `TABLE ${table}\n${columns.join('\n')}\n\n`
    }

    // 6. Save connection record in Supabase (authenticated user client adheres to connections_user RLS policy)
    const { data, error: dbError } = await supabase.from('connections').insert({
      user_id: user.id,
      name,
      type: 'postgres',
      host,
      port: Number(port),
      database_name: databaseName,
      username,
      password_encrypted: password, // stores password directly in RLS-protected table for MVP
      ssl_enabled: sslEnabled === true,
      schema_info: schemaInfoText,
      status: 'active',
      last_tested_at: new Date().toISOString()
    }).select('id').single()

    if (dbError) {
      console.error('Failed to save connection in Supabase connections table:', dbError)
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      connectionId: data.id,
    })

  } catch (err: any) {
    console.error('Database connection test/save failed:', err)
    return NextResponse.json({
      success: false,
      error: err.message || 'Verification failed. Please check credentials.'
    }, { status: 500 })
  } finally {
    if (client) {
      await client.end().catch((e) => console.error('Error closing save client:', e))
    }
  }
}
