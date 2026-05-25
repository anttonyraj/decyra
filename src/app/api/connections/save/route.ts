import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import { testSnowflakeConnection, getSnowflakeSchema } from '@/lib/connectors/snowflake'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let pgClient: Client | null = null
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

    const { 
      name, 
      host, 
      port, 
      databaseName, 
      username, 
      password, 
      sslEnabled,
      connectionType = 'postgres', // default to postgres
      account,
      warehouse,
      schemaName,
      role
    } = body

    if (!name || !username || !password || !databaseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let schemaInfoText = ""
    let insertData: Record<string, any> = {
      user_id: user.id,
      name,
      username,
      password_encrypted: password, // stores password directly in RLS table for MVP
      database_name: databaseName,
      status: 'active',
      last_tested_at: new Date().toISOString()
    }

    if (connectionType === 'snowflake') {
      if (!account || !warehouse) {
        return NextResponse.json({ error: 'Missing account identifier or warehouse details for Snowflake' }, { status: 400 })
      }

      const config = {
        account,
        username,
        password_encrypted: password,
        warehouse,
        database_name: databaseName,
        schema_name: schemaName || 'PUBLIC',
        role: role || undefined
      }

      // Verify connection before saving
      await testSnowflakeConnection(config)

      // Introspect schema
      const columns = await getSnowflakeSchema(config)
      const tablesMap: Record<string, string[]> = {}
      for (const row of columns) {
        const tableIdentifier = `${row.table_schema}.${row.table_name}`
        if (!tablesMap[tableIdentifier]) {
          tablesMap[tableIdentifier] = []
        }
        tablesMap[tableIdentifier].push(`  ${row.column_name} (${row.data_type})`)
      }

      for (const [table, columnsList] of Object.entries(tablesMap)) {
        schemaInfoText += `TABLE ${table}\n${columnsList.join('\n')}\n\n`
      }

      // Populate Snowflake specific columns
      insertData = {
        ...insertData,
        connection_type: 'snowflake',
        type: 'snowflake', // match standard list structure
        account,
        warehouse,
        schema_name: schemaName || 'PUBLIC',
        role: role || null,
        schema_info: schemaInfoText,
      }

    } else {
      // Postgres path
      if (!host || !port) {
        return NextResponse.json({ error: 'Missing host or port details for PostgreSQL' }, { status: 400 })
      }

      pgClient = new Client({
        host,
        port: Number(port) || 5432,
        database: databaseName,
        user: username,
        password,
        connectionTimeoutMillis: 10000,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      })

      await pgClient.connect()
      await pgClient.query('SELECT 1 as test')

      const schemaRes = await pgClient.query(`
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

      const tablesMap: Record<string, string[]> = {}
      for (const row of schemaRes.rows) {
        const tableIdentifier = `${row.table_schema}.${row.table_name}`
        if (!tablesMap[tableIdentifier]) {
          tablesMap[tableIdentifier] = []
        }
        tablesMap[tableIdentifier].push(`  ${row.column_name} (${row.data_type})`)
      }

      for (const [table, columnsList] of Object.entries(tablesMap)) {
        schemaInfoText += `TABLE ${table}\n${columnsList.join('\n')}\n\n`
      }

      insertData = {
        ...insertData,
        connection_type: 'postgres',
        type: 'postgres',
        host,
        port: Number(port),
        ssl_enabled: sslEnabled === true,
        schema_info: schemaInfoText,
      }
    }

    // Save connection record in Supabase
    const { data, error: dbError } = await supabase.from('connections').insert(insertData).select('id').single()

    if (dbError) {
      console.error('Failed to save connection in Supabase connections table:', dbError)
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      connectionId: data.id,
    })

  } catch (err: any) {
    console.error('Database connection verification or save failed:', err)
    return NextResponse.json({
      success: false,
      error: err.message || 'Verification failed. Please check credentials.'
    }, { status: 500 })
  } finally {
    if (pgClient) {
      await pgClient.end().catch((e) => console.error('Error closing save pg client:', e))
    }
  }
}
