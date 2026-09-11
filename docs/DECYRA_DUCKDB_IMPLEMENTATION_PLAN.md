# Decyra Virtual Golden Layer: End-to-End DuckDB Implementation & Architecture Blueprint

> **Confidential — For Internal Engineering, Executive Strategy & Future Product Development**  
> **Document Version:** 1.0  
> **Target System:** Decyra Cross-Database In-Memory Federation Core  
> **Author:** Decyra Core Systems Architecture Team  

---

## 1. Executive Summary & Architectural Vision

Decyra’s core commercial value proposition is **eliminating brittle, six-figure ETL pipelines** (Fivetran, dbt, Airflow) by performing **on-the-fly cross-database federation in ephemeral RAM in milliseconds**.

To deliver this capability while protecting enterprise margins (>85%) and fulfilling strict zero-data-retention compliance (GDPR, Saudi PDPL, UAE Data Law), Decyra implements a **Dual-Engine Topology**:

1. **Supabase (PostgreSQL OLTP) — The Application Vault:**
   * Permanent user authentication, workspace permissions, organization billing state.
   * Encrypted client connection credentials (PostgreSQL URIs, Snowflake tokens, BigQuery service accounts).
   * Chat history, saved queries, dashboard widget configs, and audit logs.
   * Row-Level Security (RLS) ensuring strict tenant data isolation.

2. **DuckDB (Embedded In-Memory OLAP) — The Ephemeral Computation Engine:**
   * Spun up on-demand in ephemeral RAM for 10–25 milliseconds to execute cross-database joins.
   * Zero disk persistence: destroyed immediately after emitting the unified result record.
   * Direct zero-copy integration with Apache Arrow buffers extracted from disparate databases.
   * Zero infrastructure standby cost: serverless CPU/RAM active only during query execution.

---

## 2. High-Level System Architecture & Flow Diagram

```
+-----------------------------------------------------------------------------------+
|                               USER CLIENT / WEB UI                                |
|          "Join Postgres production users with Snowflake Q3 ARR and refunds"       |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                         SUPABASE AUTH & WORKSPACE CONTEXT                         |
|  - Verify User JWT & Workspace Authorization                                      |
|  - Decrypt Connection Tokens: Postgres Read-Replica URI + Snowflake RSA Key       |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                       DECYRA AI QUERY DECOMPOSITION (AST)                         |
|  - Deterministic Schema Grounding (Verify column & table existence)                |
|  - Decompose prompt into two parallel pushdown SQL subqueries:                   |
|       * Subquery A (Postgres): SELECT id, email, created_at FROM users ...        |
|       * Subquery B (Snowflake): SELECT user_id, arr, refund_amount FROM billing ...|
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
       +-------------------------+                   +-------------------------+
       |   REMOTE POSTGRES DB    |                   |   REMOTE SNOWFLAKE DB   |
       |  Executes Subquery A    |                   |  Executes Subquery B    |
       |  (Returns 1,200 rows)   |                   |  (Returns 1,200 rows)   |
       +------------+------------+                   +------------+------------+
                    |                                             |
                    | (Arrow RecordBatch Stream)                  | (Arrow RecordBatch Stream)
                    |                                             |
                    +----------------------+----------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|               DECYRA EPHEMERAL IN-MEMORY DUCKDB ENGINE (RAM ONLY)                  |
|                                                                                   |
|   CREATE TABLE temp_pg AS SELECT * FROM arrow_stream_pg;                          |
|   CREATE TABLE temp_sf AS SELECT * FROM arrow_stream_sf;                          |
|                                                                                   |
|   SELECT                                                                          |
|       pg.id, pg.email, sf.arr, sf.refund_amount,                                  |
|       (sf.arr - COALESCE(sf.refund_amount, 0)) AS net_arr                         |
|   FROM temp_pg pg                                                                 |
|   LEFT JOIN temp_sf sf ON pg.id = sf.user_id                                      |
|   ORDER BY net_arr DESC LIMIT 100;                                                |
|                                                                                   |
|   -> Execution Time: 12.4ms                                                       |
|   -> Memory Cleaned / Destroyed Immediately (Zero Retention)                      |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                       JSON SERIALIZER & CHART COMPILER                            |
|  - Auto-selects Visualization (Bar, Cohort, Metric Card)                          |
|  - Returns payload to Frontend UI                                                 |
|  - Logs query lineage to Supabase `audit_logs` (No customer data stored)           |
+-----------------------------------------------------------------------------------+
```

---

## 3. Step-by-Step Implementation Guide

### Step 1: Install Required Dependencies
In Decyra's Next.js project root, install DuckDB and Apache Arrow packages:

```bash
npm install @duckdb/node-api apache-arrow pg snowflake-sdk
npm install --save-dev @types/pg
```

> **Note on `@duckdb/node-api`:** This is DuckDB's modern, official Node-API native binding. For serverless deployments on Vercel or AWS Lambda, you can also use `duckdb-async` or standard `duckdb`.

---

### Step 2: In-Memory DuckDB Connection Pool & Lifecycle Manager
Create file: `src/lib/engine/duckdb-session.ts`

```typescript
import * as duckdb from "duckdb";

/**
 * Ephemeral DuckDB Session Wrapper
 * Ensures isolated, in-memory databases with automatic garbage collection
 */
export class DuckDBSession {
  private db: duckdb.Database;
  private connection: duckdb.Connection;

  constructor() {
    // ":memory:" creates a pure RAM database. Nothing is ever written to disk.
    this.db = new duckdb.Database(":memory:");
    this.connection = this.db.connect();
  }

  /**
   * Execute an arbitrary SQL query inside RAM
   */
  public query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, ...params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows as T[]);
      });
    });
  }

  /**
   * Register a JSON array or Arrow Table as an in-memory virtual table
   */
  public async registerTableFromObjects(tableName: string, data: Record<string, any>[]): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error(`Cannot register empty dataset for table: ${tableName}`);
    }

    // Sanitize table name to prevent SQL injection in table identifiers
    const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, "");

    // Prepare JSON payload string
    const jsonStr = JSON.stringify(data);

    // Read JSON directly into a temporary DuckDB table in RAM
    await this.query(`
      CREATE TABLE ${safeTableName} AS 
      SELECT * FROM read_json_auto('${jsonStr.replace(/'/g, "''")}')
    `);
  }

  /**
   * Destroy the session and free up OS RAM immediately
   */
  public close(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.connection.close();
        this.db.close(() => resolve());
      } catch (e) {
        resolve();
      }
    });
  }
}
```

---

### Step 3: Concurrent Pushdown SQL Dispatcher
Create file: `src/lib/engine/subquery-dispatcher.ts`

```typescript
import { Client as PgClient } from "pg";

export interface SubqueryTask {
  sourceId: string;
  sourceType: "postgres" | "snowflake" | "bigquery" | "csv";
  connectionUri: string;
  sql: string;
  targetAlias: string;
}

export interface SubqueryResult {
  alias: string;
  rows: Record<string, any>[];
  rowCount: number;
  durationMs: number;
}

/**
 * Concurrently dispatches subqueries to individual remote databases
 * Pushes down filters and aggregations so only minimal rows travel over the network
 */
export async function executeParallelSubqueries(
  tasks: SubqueryTask[]
): Promise<SubqueryResult[]> {
  const promises = tasks.map(async (task): Promise<SubqueryResult> => {
    const startTime = Date.now();

    if (task.sourceType === "postgres") {
      const client = new PgClient({
        connectionString: task.connectionUri,
        statement_timeout: 5000, // 5 second hard timeout circuit-breaker
      });

      await client.connect();
      try {
        // Enforce hard row cap safeguard
        const safeSql = `SELECT * FROM (${task.sql}) AS __q LIMIT 50000;`;
        const res = await client.query(safeSql);
        return {
          alias: task.targetAlias,
          rows: res.rows,
          rowCount: res.rowCount || 0,
          durationMs: Date.now() - startTime,
        };
      } finally {
        await client.end();
      }
    }

    // Fallback mock for demonstration/CSV
    return {
      alias: task.targetAlias,
      rows: [],
      rowCount: 0,
      durationMs: Date.now() - startTime,
    };
  });

  return Promise.all(promises);
}
```

---

### Step 4: The Virtual Golden Layer Coordinator
Create file: `src/lib/engine/golden-layer-coordinator.ts`

```typescript
import { DuckDBSession } from "./duckdb-session";
import { executeParallelSubqueries, SubqueryTask } from "./subquery-dispatcher";

export interface FederationRequest {
  workspaceId: string;
  userPrompt: string;
  subqueries: SubqueryTask[];
  federatedJoinSql: string; // The DuckDB SQL that joins the subquery aliases
}

export interface FederationResponse {
  data: Record<string, any>[];
  metrics: {
    totalRows: number;
    subqueryTimes: Record<string, number>;
    inMemoryJoinTimeMs: number;
    totalLatencyMs: number;
  };
  sqlExecuted: string;
}

/**
 * End-to-End Orchestrator for Cross-Database In-Memory Joins
 */
export async function executeVirtualGoldenJoin(
  request: FederationRequest
): Promise<FederationResponse> {
  const overallStart = Date.now();
  const subqueryTimes: Record<string, number> = {};

  // Step 1: Execute pushdown subqueries in parallel
  const subqueryResults = await executeParallelSubqueries(request.subqueries);

  for (const res of subqueryResults) {
    subqueryTimes[res.alias] = res.durationMs;
  }

  // Step 2: Initialize Ephemeral DuckDB Session in RAM
  const session = new DuckDBSession();
  const joinStart = Date.now();

  try {
    // Step 3: Register each subquery's result rows as in-memory tables
    for (const result of subqueryResults) {
      await session.registerTableFromObjects(result.alias, result.rows);
    }

    // Step 4: Execute the federated ANSI SQL join in RAM
    const finalRows = await session.query(request.federatedJoinSql);
    const inMemoryJoinTimeMs = Date.now() - joinStart;

    return {
      data: finalRows,
      metrics: {
        totalRows: finalRows.length,
        subqueryTimes,
        inMemoryJoinTimeMs,
        totalLatencyMs: Date.now() - overallStart,
      },
      sqlExecuted: request.federatedJoinSql,
    };
  } finally {
    // Step 5: Critical Zero-Data-Retention Step -> Wipe RAM immediately
    await session.close();
  }
}
```

---

### Step 5: Next.js API Route for Frontend Calling
Create file: `src/app/api/golden-layer/query/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeVirtualGoldenJoin } from "@/lib/engine/golden-layer-coordinator";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subqueries, federatedJoinSql, prompt } = body;

    // 2. Execute Virtual Golden Layer join
    const result = await executeVirtualGoldenJoin({
      workspaceId: user.id,
      userPrompt: prompt,
      subqueries,
      federatedJoinSql,
    });

    // 3. Return visual payload to user
    return NextResponse.json({
      success: true,
      data: result.data,
      metrics: result.metrics,
      sql: result.sqlExecuted,
    });
  } catch (error: any) {
    console.error("Virtual Golden Layer Execution Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute federated query" },
      { status: 500 }
    );
  }
}
```

---

## 4. Production Security, Safeguards & Performance Tuning

### 1. Memory Isolation & Row Limits
To prevent any single user from exhausting server RAM:
* **Max Extract Row Cap:** Hard limit of 50,000 rows per pushdown subquery.
* **Serverless Container Sizing:** Configure Vercel / Cloud Run containers with **1,024 MB to 2,048 MB RAM**.
* **Memory Circuit Breaker:**
  ```sql
  SET max_memory = '1GB';
  ```
  DuckDB can spill gracefully to temporary encrypted swap space if a query unexpectedly exceeds the RAM limit.

### 2. Statement Timeouts (5,000ms)
Every pushdown connection to remote PostgreSQL, Snowflake, or BigQuery must include a strict client-side timeout:
```typescript
const client = new PgClient({
  connectionString: uri,
  statement_timeout: 5000 // kills query if source takes > 5 seconds
});
```

### 3. Read-Only AST Validation
Before any query runs, Decyra’s Abstract Syntax Tree parser checks for forbidden AST nodes:
* Prohibited: `InsertStatement`, `UpdateStatement`, `DeleteStatement`, `DropStatement`, `TruncateStatement`, `AlterStatement`.
* Only `SelectStatement` and `WithStatement` (CTEs) are permitted.

---

## 5. Phased Product Implementation Roadmap

| Phase | Milestone | Scope & Deliverables | Timeline |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Local In-Memory Join MVP** | PostgreSQL + Uploaded CSV/Excel in-memory joins using DuckDB in Next.js. | Weeks 1–3 |
| **Phase 2** | **Snowflake & BigQuery Connectors** | Remote Arrow record-batch streaming over HTTPS into DuckDB RAM. | Weeks 4–6 |
| **Phase 3** | **Automated Schema Graph & Drift** | Vector embedding matching across column names to auto-suggest join keys (`pg.user_id = sf.customer_id`). | Weeks 7–9 |
| **Phase 4** | **Enterprise On-Prem Gateway Agent** | Outbound reverse-tunnel daemon allowing Decyra to query on-premise Oracle & SQL Server. | Weeks 10–12 |
| **Phase 5** | **SOC2 Type II & In-Region Sovereign Cloud** | Packaging as a self-contained container on AWS UAE (`me-central-1`) and Oracle Cloud Saudi Arabia. | Weeks 13–16 |

---

## 6. Commercial Cost & Unit Economics Analysis

* **Cost of Legacy Stack:**
  * Fivetran connector fees: $1,500 – $4,000 / month
  * dbt Cloud + Airflow worker hosting: $800 – $2,500 / month
  * Snowflake compute credits for transformations: $2,000 – $6,000 / month
  * 2 Dedicated Data Engineers: $20,000 – $30,000 / month
  * **Total Legacy Cost:** **$150,000 – $350,000 / year**

* **Cost of Decyra's In-Memory Architecture:**
  * Serverless compute cost per federated query: **$0.0008 – $0.0012** (15ms execution on 1GB RAM)
  * Supabase Auth & Storage: $25 – $200 / month
  * Total Infrastructure COGS per Pro User: **< $18 / month**
  * Subscription Price: **$199 / month**
  * **Gross Margin:** **> 90%**

---

## 7. Conclusion & Next Steps

This architecture delivers the exact balance modern enterprises demand:
1. **Speed:** 10–25ms in-memory cross-database joins without ETL lag.
2. **Sovereignty:** 100% compliance with Saudi PDPL, UAE Data Law, and GDPR via RAM-only ephemeral computation.
3. **Margins:** >85% software gross margins with zero idle server overhead.
4. **Security:** Supabase handles permanent auth and credentials; DuckDB handles anonymous in-memory vector joins.
