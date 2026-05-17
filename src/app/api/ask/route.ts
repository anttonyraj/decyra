import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { DEMO_SCHEMA } from '../../../lib/schema'
import { aiProvider } from '../../../lib/ai/provider'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse body
    const body = await req.json().catch(() => null)
    const question = body?.question?.trim()
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // 2. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. SQL generation
    const sqlSystemPrompt = `You are an expert PostgreSQL SQL generator.

Generate exactly one SELECT query to answer the user's question.

RULES:
- ONLY SELECT statements. Never INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, GRANT, REVOKE, CREATE, EXEC.
- Always include a LIMIT clause unless aggregating. Default LIMIT 100.
- Use PostgreSQL syntax only.
- Use ONLY tables and columns from the schema below. Do not invent column names.
- For date math use date_trunc and current_date.
- For percentages cast to numeric to avoid integer division.
- Always prefix tables with 'demo.' (e.g. demo.customers, demo.orders).

SCHEMA:
${DEMO_SCHEMA}

Return ONLY valid JSON in this exact shape:
{"sql": "SELECT ...", "intent": "brief plain-English description of what the SQL does"}

No markdown fences. No commentary outside the JSON. Just the JSON object.`

    const sqlRawText = await aiProvider.generateText({
      systemPrompt: sqlSystemPrompt,
      userPrompt: question,
      maxTokens: 1024,
    })

    // 4. Parse Gemini's JSON response, stripping any markdown fences
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

    const sql = parsed.sql.trim()

    // 5. Safety checks — defense in depth
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

    // 6. Execute via Supabase RPC
    const { data: rows, error: queryError } = await supabase.rpc('run_demo_query', {
      query_text: sql,
    })

    if (queryError) {
      return NextResponse.json(
        { sql, intent: parsed.intent, error: queryError.message },
        { status: 500 }
      )
    }

    const rowCount = Array.isArray(rows) ? rows.length : 0
    const previewRows = Array.isArray(rows) ? rows.slice(0, 5) : []

    // 7. Narration call
    const narrationPrompt = `A user asked: "${question}"

The SQL that ran: ${sql}

The first ${Math.min(5, rowCount)} rows of the result (total rows returned: ${rowCount}):
${JSON.stringify(previewRows)}

Write a 2-sentence plain-English explanation for a non-technical business executive. State the headline finding clearly with the actual numbers from the data, then add one notable detail or pattern you see. Do not mention SQL. Do not say "the query returned" — write as if you're directly answering the user's question.`

    const narration = await aiProvider.generateText({
      userPrompt: narrationPrompt,
      maxTokens: 512,
    })

    // 8. Return everything
    return NextResponse.json({
      sql,
      intent: parsed.intent,
      rows: Array.isArray(rows) ? rows : [],
      rowCount,
      narration,
    })
  } catch (err: any) {
    console.error('Ask route error:', err)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    )
  }
}
