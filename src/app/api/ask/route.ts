import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { DEMO_SCHEMA } from '../../../lib/schema'
import { aiProvider } from '../../../lib/ai/provider'
import { Client } from 'pg'
import { executeSnowflakeQuery } from '../../../lib/connectors/snowflake'
import alasql from 'alasql'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse body
    const body = await req.json().catch(() => null)

    // Check if client is requesting narration-only for in-memory/client executed queries
    if (body?.action === 'narrate') {
      const q = body.question || ''
      const qSql = body.sql || ''
      const rowCount = body.rowCount || 0
      const previewRows = body.previewRows || []

      const narrationPrompt = `A user asked: "${q}"

The SQL that ran: ${qSql}

The first ${Math.min(5, rowCount)} rows of the result (total rows returned: ${rowCount}):
${JSON.stringify(previewRows)}

Write a 2-sentence plain-English explanation for a non-technical business executive. State the headline finding clearly with the actual numbers from the data, then add one notable detail or pattern you see. Do not mention SQL. Do not say "the query returned" — write as if you're directly answering the user's question.`

      const narration = await aiProvider.generateText({
        userPrompt: narrationPrompt,
        maxTokens: 512,
      })

      return NextResponse.json({ narration })
    }

    const question = body?.question?.trim()
    const language = body?.language || 'auto'
    const connectionId = body?.connectionId
    const previousQuestion = body?.previousQuestion?.trim()
    const previousSql = body?.previousSql?.trim()
    const isUploadedFile = Boolean(body?.isUploadedFile)
    const customSchema = body?.customSchema
    const tableName = body?.tableName || 'uploaded_data'

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // 2. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Context for multi-turn follow-up
    let followUpInstruction = ""
    if (previousQuestion && previousSql) {
      followUpInstruction = `\n\nCONVERSATION CONTEXT (FOLLOW-UP):
The user previously asked: "${previousQuestion}"
The previous SQL query was:
${previousSql}

INSTRUCTION FOR FOLLOW-UP:
The user is asking a follow-up question: "${question}".
Maintain query context and adapt/refine the previous SQL accordingly (e.g., adding filters, changing grouping, modifying aggregations, adjusting date ranges, or changing ORDER BY/LIMIT).
If the user's new question is completely unrelated to the previous context, generate a fresh query from scratch.`
    }

    // 3. Look up connection or use uploaded file schema
    let isUserConnection = false
    let connection: any = null
    let schemaPromptText = DEMO_SCHEMA

    if (isUploadedFile && customSchema) {
      schemaPromptText = customSchema
    } else if (connectionId && connectionId !== 'demo') {
      const { data: conn, error: connError } = await supabase
        .from('connections')
        .select('*')
        .eq('id', connectionId)
        .single()

      if (connError || !conn) {
        console.error('Failed to retrieve user database connection:', connError)
        return NextResponse.json({ error: 'Connection not found or unauthorized' }, { status: 404 })
      }

      connection = conn
      isUserConnection = true
      schemaPromptText = connection.schema_info || ''
    }

    const isSnowflake = isUserConnection && (connection.connection_type === 'snowflake' || connection.type === 'snowflake')

    // 4. SQL generation system prompts
    let langInstruction = ""
    if (language === 'ar') {
      langInstruction = `\n- MULTILINGUAL INSTRUCTION (Powered by Sonictra AI): The user selected Arabic (العربية). You MUST write the "intent" field in natural, professional Modern Standard Arabic (العربية). However, the "sql" query MUST remain 100% valid ANSI standard SQL referencing the exact schema columns in English.`
    } else if (language && language !== 'auto' && language !== 'en') {
      langInstruction = `\n- MULTILINGUAL INSTRUCTION (Powered by Sonictra AI): The user selected ${language}. You MUST write the "intent" field in that language. The "sql" query MUST remain 100% valid ANSI standard SQL referencing the exact schema columns in English.`
    } else {
      langInstruction = `\n- MULTILINGUAL INSTRUCTION (Powered by Sonictra AI): If the user asks in Arabic or another non-English language, write the "intent" field in that language, while keeping the "sql" query 100% valid ANSI standard SQL referencing exact schema columns in English.`
    }

    let sqlSystemPrompt = ""
    if (isUploadedFile) {
      // In-memory AlaSQL for structured uploaded files (CSV, JSON, XML, Excel)
      sqlSystemPrompt = `You are an expert SQL generator for structured dataset files (CSV, JSON, XML, Excel) running on AlaSQL (in-memory ANSI SQL).

Generate exactly one SELECT query to answer the user's question using the table '${tableName}'.

RULES:
- ONLY SELECT statements. Never INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE.
- Use standard ANSI SQL syntax compatible with AlaSQL (e.g. SELECT col1, SUM(col2) FROM ${tableName} WHERE ... GROUP BY ... ORDER BY ... LIMIT 100).
- Always include a LIMIT clause unless aggregating. Default LIMIT 100.
- Use ONLY the table '${tableName}' and columns from the schema below. Do NOT prefix the table with schema names like 'demo.' or 'public.'.
- Column names are case-sensitive or lower_snake_case as defined in the schema.
- For case-insensitive string matching, you can use LOWER(col) = LOWER('value') or col LIKE '%value%'.
- For date functions, use standard SQL comparisons or string filters.${followUpInstruction}${langInstruction}

SCHEMA:
${schemaPromptText}

Return ONLY valid JSON in this exact shape:
{"sql": "SELECT ...", "intent": "brief plain-English description of what the SQL does"}

No markdown fences. No commentary outside the JSON. Just the JSON object.`
    } else if (isSnowflake) {
      sqlSystemPrompt = `You are an expert Snowflake SQL generator.

Generate exactly one SELECT query to answer the user's question.

RULES:
- ONLY SELECT statements. Never INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, GRANT, REVOKE, CREATE, EXEC.
- Always include a LIMIT clause unless aggregating. Default LIMIT 100.
- Use Snowflake SQL syntax only.
- Snowflake uses ILIKE for case-insensitive matching.
- For date math use DATEADD, DATEDIFF, or CURRENT_DATE() with parens.
- Use ONLY tables and columns from the schema below. Do not invent column names.
- Always prefix tables with their fully qualified name format (e.g. DATABASE.SCHEMA.TABLE_NAME) as shown in the schema below.${followUpInstruction}${langInstruction}

SCHEMA:
${schemaPromptText}

Return ONLY valid JSON in this exact shape:
{"sql": "SELECT ...", "intent": "brief plain-English description of what the SQL does"}

No markdown fences. No commentary outside the JSON. Just the JSON object.`
    } else {
      // PostgreSQL
      sqlSystemPrompt = `You are an expert PostgreSQL SQL generator.

Generate exactly one SELECT query to answer the user's question.

RULES:
- ONLY SELECT statements. Never INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, GRANT, REVOKE, CREATE, EXEC.
- Always include a LIMIT clause unless aggregating. Default LIMIT 100.
- Use PostgreSQL syntax only.
- Use ONLY tables and columns from the schema below. Do not invent column names.
- For date math use date_trunc and current_date.
- For percentages cast to numeric to avoid integer division.
- Always prefix tables with their schema name (e.g. ${isUserConnection ? 'public.tablename' : 'demo.customers, demo.orders'}).${followUpInstruction}${langInstruction}

SCHEMA:
${schemaPromptText}

Return ONLY valid JSON in this exact shape:
{"sql": "SELECT ...", "intent": "brief plain-English description of what the SQL does"}

No markdown fences. No commentary outside the JSON. Just the JSON object.`
    }

    const sqlRawText = await aiProvider.generateText({
      systemPrompt: sqlSystemPrompt,
      userPrompt: question,
      maxTokens: 384,
    })

    // 5. Parse Gemini's JSON response, stripping any markdown fences
    const cleaned = sqlRawText
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim()

    let parsed: { sql: string; intent: string }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed response', raw: sqlRawText },
        { status: 500 }
      )
    }

    const sql = parsed.sql.trim().replace(/;$/, '')

    // 6. Safety checks — defense in depth
    if (!/^\s*select\s/i.test(sql)) {
      return NextResponse.json(
        { error: 'Only SELECT queries are allowed', sql },
        { status: 400 }
      )
    }
    if (/\b(insert|update|delete|drop|alter|truncate|grant|revoke|create|exec)\b/i.test(sql)) {
      return NextResponse.json(
        { error: 'Query contains forbidden keywords', sql },
        { status: 400 }
      )
    }

    // 7. Execute query
    // If client requested schema-only generation (100% private in-browser execution), return SQL immediately
    if (isUploadedFile && body?.schemaOnly) {
      return NextResponse.json({
        sql,
        intent: parsed.intent,
        schemaOnly: true,
      })
    }

    let rows: any[] = []
    let queryErrorMsg: string | null = null

    if (isUploadedFile) {
      try {
        alasql.tables[tableName] = { data: body?.fileRows || [] }
        try {
          const resRows = alasql(sql)
          rows = Array.isArray(resRows) ? resRows : []
        } catch (sqlErr: any) {
          console.warn('AlaSQL retry with stripped table identifier:', sqlErr)
          const stripped = sql.replace(new RegExp(`${tableName}\\.`, 'g'), '')
          const resRows = alasql(stripped)
          rows = Array.isArray(resRows) ? resRows : []
        }
      } catch (err: any) {
        console.error('File AlaSQL query error:', err)
        queryErrorMsg = err.message || 'Failed to query file records.'
      }
    } else if (isUserConnection) {
      if (isSnowflake) {
        // Execute on Snowflake REST API
        try {
          const config = {
            account: connection.account,
            username: connection.username,
            password_encrypted: connection.password_encrypted,
            warehouse: connection.warehouse,
            database_name: connection.database_name,
            schema_name: connection.schema_name || 'PUBLIC',
            role: connection.role || undefined
          }

          // Safely wrap the Snowflake SQL generated in a subquery and limit to 500 rows for security
          const limitedSql = `SELECT * FROM (${sql}) AS user_query LIMIT 500`
          rows = await executeSnowflakeQuery(config, limitedSql)

        } catch (err: any) {
          console.error('Snowflake query execution error:', err)
          queryErrorMsg = err.message || 'Snowflake database query execution failed.'
        }
      } else {
        // Execute query on the user's PostgreSQL database
        let userClient: Client | null = null
        try {
          userClient = new Client({
            host: connection.host,
            port: Number(connection.port) || 5432,
            database: connection.database_name,
            user: connection.username,
            password: connection.password_encrypted,
            connectionTimeoutMillis: 10000, // 10s connection timeout
            statement_timeout: 15000,       // 15s statement execution timeout
            ssl: connection.ssl_enabled ? { rejectUnauthorized: false } : false
          })

          await userClient.connect()

          // Safely wrap the SQL generated in a subquery and limit to 500 rows for security
          const limitedSql = `SELECT * FROM (${sql}) AS user_query LIMIT 500`
          const queryRes = await userClient.query(limitedSql)
          rows = queryRes.rows

        } catch (err: any) {
          console.error('User database execution error:', err)
          queryErrorMsg = err.message || 'Database query execution failed.'
        } finally {
          if (userClient) {
            await userClient.end().catch((e) => console.error('Error closing user pg client:', e))
          }
        }
      }
    } else {
      // Execute via standard demo RPC
      const { data: rpcRows, error: rpcError } = await supabase.rpc('run_demo_query', {
        query_text: sql,
      })

      if (rpcError) {
        queryErrorMsg = rpcError.message
      } else {
        rows = Array.isArray(rpcRows) ? rpcRows : []
      }
    }

    if (queryErrorMsg) {
      return NextResponse.json(
        { sql, intent: parsed.intent, error: queryErrorMsg },
        { status: 500 }
      )
    }

    const rowCount = rows.length
    const previewRows = rows.slice(0, 5)

    // 8. Instant Smart Narration for Single-Value / Aggregation Results (0ms lag)
    let narration = ''
    if (rowCount === 0) {
      narration = 'No matching records were found for this query.'
    } else if (rowCount === 1 && Object.keys(rows[0]).length === 1) {
      const singleKey = Object.keys(rows[0])[0]
      const rawVal = rows[0][singleKey]
      const cleanKey = singleKey.replace(/_/g, ' ').replace(/[()*\"]/g, '').trim().toLowerCase()
      const formattedVal = typeof rawVal === 'number' ? rawVal.toLocaleString() : String(rawVal)
      narration = `The total ${cleanKey || 'result'} is ${formattedVal}.`
    } else {
      // For multi-row results, generate concise narration with a tight token budget and timeout
      try {
        let narrationLangNote = ""
        if (language === 'ar') {
          narrationLangNote = "\nIMPORTANT: Write this executive summary in fluent, professional Modern Standard Arabic (العربية). Do not use English."
        } else if (language && language !== 'auto' && language !== 'en') {
          narrationLangNote = `\nIMPORTANT: Write this executive summary in fluent ${language}.`
        } else {
          narrationLangNote = "\nIf the user asked their question in Arabic or another non-English language, write this finding in that same language."
        }

        const narrationPrompt = `A user asked: "${question}"

Data returned (${rowCount} rows, first 5 shown):
${JSON.stringify(previewRows)}

Write a concise 1-2 sentence business executive finding answering the question with the specific numbers. Do not mention SQL or code.${narrationLangNote}`

        narration = await Promise.race([
          aiProvider.generateText({
            userPrompt: narrationPrompt,
            maxTokens: 128,
          }),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ])
      } catch {
        narration = `Found ${rowCount} ${rowCount === 1 ? 'record' : 'records'} matching your query.`
      }
    }

    // 9. Return everything
    return NextResponse.json({
      sql,
      intent: parsed.intent,
      rows,
      rowCount,
      narration,
    })

  } catch (err: any) {
    console.error('Ask route error:', err)
    const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')
    const userMessage = isRateLimit
      ? 'AI request rate limit reached. Please wait a few seconds and try again.'
      : (err.message || 'Failed to process question.')

    return NextResponse.json(
      {
        error: userMessage,
        message: err.message,
      },
      { status: isRateLimit ? 429 : 500 }
    )
  }
}
