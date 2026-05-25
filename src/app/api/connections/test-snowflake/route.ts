import { NextRequest, NextResponse } from 'next/server'
import { testSnowflakeConnection, getSnowflakeSchema } from '@/lib/connectors/snowflake'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
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

    const { account, username, password, warehouse, databaseName, schemaName, role } = body

    if (!account || !username || !password || !warehouse || !databaseName) {
      return NextResponse.json({ error: 'Missing required credentials' }, { status: 400 })
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

    // 3. Test connection
    const testResult = await testSnowflakeConnection(config)

    // 4. Introspect schema columns
    const columns = await getSnowflakeSchema(config)
    const uniqueTables = new Set(columns.map(col => `${col.table_schema}.${col.table_name}`))

    return NextResponse.json({
      success: true,
      tableCount: testResult.tableCount,
      tables: Array.from(uniqueTables),
    })

  } catch (err: any) {
    console.error('Snowflake database connection test failed:', err)
    return NextResponse.json({
      success: false,
      error: err.message || 'Snowflake connection failed. Please check your network and credentials.'
    }, { status: 500 })
  }
}
