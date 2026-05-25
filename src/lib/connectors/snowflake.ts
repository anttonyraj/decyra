export interface SnowflakeConfig {
  account: string
  username: string
  password_encrypted: string // stores password
  warehouse: string
  database_name: string
  schema_name?: string
  role?: string
}

async function getSnowflakeSessionToken(config: SnowflakeConfig): Promise<string> {
  const accountClean = config.account.trim().toLowerCase()
  const loginUrl = `https://${accountClean}.snowflakecomputing.com/session/v1/login-request`

  try {
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: {
          CLIENT_APP_ID: 'Decyra',
          CLIENT_APP_VERSION: '1.0',
          loginName: config.username,
          password: config.password_encrypted,
          accountName: accountClean,
          warehouseName: config.warehouse,
          databaseName: config.database_name,
          schemaName: config.schema_name || 'PUBLIC',
          roleName: config.role || undefined,
        },
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!res.ok) {
      const text = await res.text()
      if (res.status === 403 || res.status === 401) {
        throw new Error('Invalid credentials. Check your username and password.')
      }
      throw new Error(`Authentication failed with status ${res.status}: ${text}`)
    }

    const data = await res.json()
    if (!data.success) {
      const msg = data.message || ''
      if (msg.includes('role')) {
        throw new Error('The specified role is not available for this user.')
      }
      throw new Error(msg || 'Authentication failed. Please verify credentials.')
    }

    const token = data.data?.token
    if (!token) {
      throw new Error('Snowflake did not return a session token.')
    }

    return token
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      throw new Error('Could not reach your Snowflake account. Verify your account identifier.')
    }
    throw err
  }
}

export async function testSnowflakeConnection(config: SnowflakeConfig): Promise<{ success: boolean; tableCount: number }> {
  const token = await getSnowflakeSessionToken(config)
  
  // Try running a simple query to verify session works
  const res = await executeSnowflakeQueryWithToken(config, token, 'SELECT 1 as test')
  if (!res || res.length === 0) {
    throw new Error('Failed to run test query on Snowflake.')
  }

  // Fetch schema table count
  const schema = await getSnowflakeSchemaWithToken(config, token)
  const uniqueTables = new Set(schema.map(col => `${col.table_schema}.${col.table_name}`))

  return {
    success: true,
    tableCount: uniqueTables.size,
  }
}

export async function getSnowflakeSchema(config: SnowflakeConfig): Promise<any[]> {
  const token = await getSnowflakeSessionToken(config)
  return await getSnowflakeSchemaWithToken(config, token)
}

async function getSnowflakeSchemaWithToken(config: SnowflakeConfig, token: string): Promise<any[]> {
  const query = `
    SELECT
      table_schema,
      table_name,
      column_name,
      data_type,
      is_nullable
    FROM information_schema.columns
    WHERE table_schema NOT IN ('INFORMATION_SCHEMA')
    ORDER BY table_schema, table_name, ordinal_position
  `
  return await executeSnowflakeQueryWithToken(config, token, query)
}

export async function executeSnowflakeQuery(config: SnowflakeConfig, sql: string): Promise<any[]> {
  const token = await getSnowflakeSessionToken(config)
  return await executeSnowflakeQueryWithToken(config, token, sql)
}

async function executeSnowflakeQueryWithToken(config: SnowflakeConfig, token: string, sql: string): Promise<any[]> {
  const accountClean = config.account.trim().toLowerCase()
  const statementsUrl = `https://${accountClean}.snowflakecomputing.com/api/v2/statements`

  const res = await fetch(statementsUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Snowflake-Service': 'Decyra',
    },
    body: JSON.stringify({
      statement: sql,
      timeout: 15, // 15 seconds statement timeout
      resultSetAsStream: false,
      warehouse: config.warehouse,
      database: config.database_name,
      schema: config.schema_name || 'PUBLIC',
      role: config.role || undefined,
    }),
    signal: AbortSignal.timeout(15000), // 15s timeout
  })

  let status = res.status
  let data = await res.json()

  if (status === 202) {
    // Query is running asynchronously. Poll for results.
    const statementHandle = data.statementHandle
    let attempts = 0
    while (status === 202 && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++

      const pollRes = await fetch(`${statementsUrl}/${statementHandle}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      status = pollRes.status
      data = await pollRes.json()
    }
  }

  if (status !== 200) {
    const errorMsg = data.message || 'Snowflake SQL execution failed.'
    if (errorMsg.includes('suspended')) {
      throw new Error('Your warehouse is suspended. Resume it in Snowflake before connecting.')
    }
    if (errorMsg.includes('timeout') || status === 202) {
      throw new Error('Query took too long. Try a simpler question or check your warehouse size.')
    }
    throw new Error(errorMsg)
  }

  // Parse columns and rows from Snowflake JSON structure
  const rowType = data.resultSetMetaData?.rowType || []
  const columns = rowType.map((col: any) => col.name)
  const rows = data.data || []

  return rows.map((row: any[]) => {
    const rowObj: Record<string, any> = {}
    columns.forEach((colName: string, idx: number) => {
      rowObj[colName] = row[idx]
    })
    return rowObj
  })
}
