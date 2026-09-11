import os
import zipfile
import xml.sax.saxutils as saxutils

def escape(text):
    return saxutils.escape(text)

def create_docx(filename, title, sections):
    """
    Creates a clean, valid .docx Word Document using standard Python zipfile
    without needing external pip libraries.
    """
    
    # 1. Content Types XML
    content_types_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

    # 2. Package Relationships (.rels)
    package_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    # 3. Document Relationships
    doc_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    # 4. Styles XML
    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="333333"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="276" w:lineRule="auto" w:after="160"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
      <w:b/>
      <w:sz w:val="34"/>
      <w:color w:val="1E2761"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="260" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="1E2761"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="180" w:after="60"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="22"/>
      <w:color w:val="F96167"/>
    </w:rPr>
  </w:style>
</w:styles>"""

    # 5. Build Document Body XML
    doc_body = []

    # Title Block
    doc_body.append(f"""
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="200" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
          <w:b/>
          <w:sz w:val="48"/>
          <w:color w:val="1E2761"/>
        </w:rPr>
        <w:t>{escape(title)}</w:t>
      </w:r>
    </w:p>
    """)

    # Subtitle
    doc_body.append("""
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:i/>
          <w:sz w:val="24"/>
          <w:color w:val="5A6478"/>
        </w:rPr>
        <w:t>End-to-End DuckDB Implementation &amp; Technical Architecture Blueprint</w:t>
      </w:r>
    </w:p>
    """)

    # Meta Callout Box
    doc_body.append("""
    <w:p>
      <w:pPr>
        <w:pBdr>
          <w:top w:val="single" w:sz="12" w:space="8" w:color="D0D7E2"/>
          <w:left w:val="single" w:sz="24" w:space="12" w:color="1E2761"/>
          <w:bottom w:val="single" w:sz="12" w:space="8" w:color="D0D7E2"/>
          <w:right w:val="single" w:sz="12" w:space="8" w:color="D0D7E2"/>
        </w:pBdr>
        <w:shd w:val="clear" w:color="auto" w:fill="F4F8FE"/>
        <w:spacing w:before="120" w:after="240"/>
        <w:ind w:left="140" w:right="140"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:color w:val="1E2761"/>
        </w:rPr>
        <w:t>CONFIDENTIAL &amp; PROPRIETARY — DECYRA CORE SYSTEMS ARCHITECTURE</w:t>
      </w:r>
      <w:r><w:br/></w:r>
      <w:r>
        <w:rPr><w:sz w:val="20"/><w:color w:val="5A6478"/></w:rPr>
        <w:t>Prepared for: Engineering Leadership, Technical Due Diligence, and Future Scaling</w:t>
      </w:r>
    </w:p>
    """)

    # Process Sections
    for sec in sections:
        sec_type = sec.get("type", "paragraph")
        
        if sec_type == "h1":
            doc_body.append(f"""
            <w:p>
              <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
              <w:r><w:t>{escape(sec['text'])}</w:t></w:r>
            </w:p>
            """)
        elif sec_type == "h2":
            doc_body.append(f"""
            <w:p>
              <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
              <w:r><w:t>{escape(sec['text'])}</w:t></w:r>
            </w:p>
            """)
        elif sec_type == "h3":
            doc_body.append(f"""
            <w:p>
              <w:pPr><w:pStyle w:val="Heading3"/></w:pPr>
              <w:r><w:t>{escape(sec['text'])}</w:t></w:r>
            </w:p>
            """)
        elif sec_type == "bullet":
            doc_body.append(f"""
            <w:p>
              <w:pPr>
                <w:ind w:left="360" w:hanging="200"/>
                <w:spacing w:after="80"/>
              </w:pPr>
              <w:r>
                <w:rPr><w:color w:val="F96167"/><w:b/></w:rPr>
                <w:t>•  </w:t>
              </w:r>
              <w:r>
                <w:rPr><w:b/></w:rPr>
                <w:t>{escape(sec.get('bold', ''))} </w:t>
              </w:r>
              <w:r><w:t>{escape(sec['text'])}</w:t></w:r>
            </w:p>
            """)
        elif sec_type == "code":
            # Code block container
            lines = sec['text'].strip().split("\n")
            doc_body.append("""
            <w:p>
              <w:pPr>
                <w:pBdr>
                  <w:top w:val="single" w:sz="6" w:space="6" w:color="E5E9F2"/>
                  <w:left w:val="single" w:sz="18" w:space="8" w:color="F96167"/>
                  <w:bottom w:val="single" w:sz="6" w:space="6" w:color="E5E9F2"/>
                  <w:right w:val="single" w:sz="6" w:space="6" w:color="E5E9F2"/>
                </w:pBdr>
                <w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>
                <w:spacing w:before="100" w:after="160"/>
                <w:ind w:left="200" w:right="200"/>
              </w:pPr>
            """)
            for i, line in enumerate(lines):
                doc_body.append(f"""
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
                    <w:sz w:val="18"/>
                    <w:color w:val="1E2761"/>
                  </w:rPr>
                  <w:t xml:space="preserve">{escape(line)}</w:t>
                </w:r>
                """)
                if i < len(lines) - 1:
                    doc_body.append("<w:r><w:br/></w:r>")
            doc_body.append("</w:p>")
        elif sec_type == "table":
            # Word XML Table
            headers = sec.get("headers", [])
            rows = sec.get("rows", [])
            doc_body.append("""
            <w:tbl>
              <w:tblPr>
                <w:tblW w:w="5000" w:type="pct"/>
                <w:tblBorders>
                  <w:top w:val="single" w:sz="4" w:space="0" w:color="D0D7E2"/>
                  <w:left w:val="none"/>
                  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D0D7E2"/>
                  <w:right w:val="none"/>
                  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E5E9F2"/>
                  <w:insideV w:val="none"/>
                </w:tblBorders>
              </w:tblPr>
            """)
            # Header row
            doc_body.append("<w:tr><w:trPr><w:tblHeader/></w:trPr>")
            for h in headers:
                doc_body.append(f"""
                <w:tc>
                  <w:tcPr>
                    <w:shd w:val="clear" w:color="auto" w:fill="1E2761"/>
                    <w:tcMar><w:top w:w="120"/><w:bottom w:w="120"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
                  </w:tcPr>
                  <w:p>
                    <w:r>
                      <w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="FFFFFF"/></w:rPr>
                      <w:t>{escape(h)}</w:t>
                    </w:r>
                  </w:p>
                </w:tc>
                """)
            doc_body.append("</w:tr>")
            # Data rows
            for row in rows:
                doc_body.append("<w:tr>")
                for cell in row:
                    doc_body.append(f"""
                    <w:tc>
                      <w:tcPr>
                        <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
                      </w:tcPr>
                      <w:p>
                        <w:r>
                          <w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr>
                          <w:t>{escape(cell)}</w:t>
                        </w:r>
                      </w:p>
                    </w:tc>
                    """)
                doc_body.append("</w:tr>")
            doc_body.append("</w:tbl>")
        else: # Regular paragraph
            doc_body.append(f"""
            <w:p>
              <w:pPr><w:spacing w:after="140"/></w:pPr>
              <w:r><w:t>{escape(sec['text'])}</w:t></w:r>
            </w:p>
            """)

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(doc_body)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>"""

    # Create ZIP archive
    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    with zipfile.ZipFile(filename, "w", zipfile.ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types_xml)
        docx.writestr("_rels/.rels", package_rels_xml)
        docx.writestr("word/_rels/document.xml.rels", doc_rels_xml)
        docx.writestr("word/styles.xml", styles_xml)
        docx.writestr("word/document.xml", document_xml)

    print(f"Successfully generated Word Document: {filename}")

if __name__ == "__main__":
    sections = [
        {"type": "h1", "text": "1. Executive Summary & Dual-Engine Topology"},
        {"type": "p", "text": "Decyra eliminates brittle $200,000/year ETL pipelines (Fivetran, dbt, Airflow) by performing on-the-fly cross-database federation in ephemeral RAM in milliseconds. To deliver this capability with >85% gross margins and zero-retention compliance (Saudi PDPL, UAE Data Law, GDPR), Decyra separates transactional application state from analytical query federation."},
        {"type": "bullet", "bold": "Supabase (PostgreSQL OLTP):", "text": "The persistent application vault. Handles user logins, OAuth, workspace state, encrypted database connection credentials, saved dashboards, and audit logs."},
        {"type": "bullet", "bold": "DuckDB (In-Memory OLAP):", "text": "The ephemeral computation engine. Spins up on-demand in serverless RAM for 10-25 milliseconds, joins multiple databases on the fly, emits the unified JSON record, and destroys the memory immediately."},
        
        {"type": "h1", "text": "2. Comparative Analysis: Supabase vs. DuckDB"},
        {"type": "table", "headers": ["System / Capability", "Supabase (PostgreSQL)", "DuckDB (In-Memory Core)"], "rows": [
            ["Primary Role", "Application Vault & Auth", "In-Memory Analytics Calculator"],
            ["User Authentication", "YES (JWT, Google OAuth, RLS)", "NO (Has zero auth capability)"],
            ["Data Persistence", "Permanent (Stored on disk, backed up)", "Ephemeral (RAM only; zero disk retention)"],
            ["Multi-Tenant Concurrency", "High (Thousands of simultaneous users)", "Single-process ephemeral worker"],
            ["Cross-Database Joins", "Slow / Complex Foreign Data Wrappers", "Ultra-fast (10-25ms vectorized joins)"],
            ["Cost Profile", "Fixed monthly managed database", "$0 idle cost (Serverless micro-compute)"]
        ]},

        {"type": "h1", "text": "3. The 5-Step End-to-End Query Lifecycle"},
        {"type": "bullet", "bold": "Step 1: Prompt Parsing & AST Validation:", "text": "User asks a question. LLM acts as semantic parser. Decyra AST compiler validates schema existence and verifies query is strictly read-only."},
        {"type": "bullet", "bold": "Step 2: Pushdown SQL Decomposition:", "text": "Decyra breaks the prompt into parallel sub-queries customized for each remote database dialect (Postgres, Snowflake, BigQuery) with pushdown WHERE filters."},
        {"type": "bullet", "bold": "Step 3: Concurrent Remote Execution:", "text": "Subqueries run simultaneously on client databases. Only minimal filtered rows are extracted over TLS."},
        {"type": "bullet", "bold": "Step 4: Vectorized In-Memory Join:", "text": "DuckDB receives Arrow record batches in RAM and executes the cross-database join in 12 milliseconds."},
        {"type": "bullet", "bold": "Step 5: Memory Destruction & Visualization:", "text": "DuckDB memory is immediately garbage-collected (Zero Data Retention). Result dataset is serialized to JSON and rendered as charts on the user UI."},

        {"type": "h1", "text": "4. Production TypeScript Code Implementation"},
        {"type": "h2", "text": "A. In-Memory Session Manager (src/lib/engine/duckdb-session.ts)"},
        {"type": "code", "text": """import * as duckdb from "duckdb";

export class DuckDBSession {
  private db: duckdb.Database;
  private connection: duckdb.Connection;

  constructor() {
    // Pure RAM database; zero disk persistence
    this.db = new duckdb.Database(":memory:");
    this.connection = this.db.connect();
  }

  public query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, ...params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
      });
    });
  }

  public async registerTable(name: string, data: Record<string, any>[]): Promise<void> {
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, "");
    const jsonStr = JSON.stringify(data).replace(/'/g, "''");
    await this.query(`CREATE TABLE ${safeName} AS SELECT * FROM read_json_auto('${jsonStr}')`);
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      this.connection.close();
      this.db.close(() => resolve());
    });
  }
}"""},

        {"type": "h2", "text": "B. Virtual Golden Layer Coordinator (src/lib/engine/golden-layer.ts)"},
        {"type": "code", "text": """import { DuckDBSession } from "./duckdb-session";
import { executeParallelSubqueries } from "./subquery-dispatcher";

export async function executeVirtualGoldenJoin(req: FederationRequest) {
  // 1. Parallel subquery execution across remote databases
  const subResults = await executeParallelSubqueries(req.subqueries);

  // 2. Spin up ephemeral RAM DuckDB
  const session = new DuckDBSession();
  try {
    for (const res of subResults) {
      await session.registerTable(res.alias, res.rows);
    }
    // 3. Execute in-memory cross-database join (10-25ms)
    const finalData = await session.query(req.federatedJoinSql);
    return { data: finalData, rowCount: finalData.length };
  } finally {
    // 4. Critical compliance step: wipe memory immediately
    await session.close();
  }
}"""},

        {"type": "h1", "text": "5. Enterprise Security & Military-Grade Safeguards"},
        {"type": "bullet", "bold": "Mandatory Read-Replica Routing:", "text": "Decyra connects exclusively to follower read-replicas, completely isolating transactional production databases from analytical traffic."},
        {"type": "bullet", "bold": "Pushdown Cost & Row Cap Safeguards:", "text": "Every query is capped at 50,000 rows. Pre-execution EXPLAIN inspection blocks queries requiring unindexed table scans."},
        {"type": "bullet", "bold": "Circuit Breaker Timeouts:", "text": "Hard statement timeouts (5,000ms) automatically terminate runaway queries."},
        {"type": "bullet", "bold": "Zero Data Retention Guarantee:", "text": "Memory is wiped clean after query execution. No client rows are ever written to Decyra disks or long-term databases."},

        {"type": "h1", "text": "6. Phased Engineering & Product Roadmap"},
        {"type": "table", "headers": ["Phase", "Milestone", "Timeline", "Target Outcome"], "rows": [
            ["Phase 1", "Local In-Memory Join MVP (Postgres + CSV)", "Weeks 1–3", "Instant self-serve demo & file joins"],
            ["Phase 2", "Snowflake & BigQuery Arrow Streaming", "Weeks 4–6", "Enterprise multi-warehouse federation"],
            ["Phase 3", "Automated Semantic Graph & Drift Healing", "Weeks 7–9", "Autonomous foreign-key discovery & alias updates"],
            ["Phase 4", "Outbound Gateway Agent (On-Prem Oracle)", "Weeks 10–12", "Zero-inbound firewall enterprise support"],
            ["Phase 5", "Sovereign In-Region Clusters (AWS UAE / Oracle Saudi)", "Weeks 13–16", "Full GCC in-country data residency compliance"]
        ]},

        {"type": "h1", "text": "7. Unit Economics & Gross Margin Profile"},
        {"type": "p", "text": "Unlike traditional data tools that require 24/7 provisioned warehouse clusters, Decyra uses ephemeral serverless compute. A cross-database join running for 15 milliseconds on 1GB RAM costs less than $0.001 per query. At a subscription price of $199/month for team tiers, infrastructure COGS remain under $18/month, delivering sustained gross margins above 90%."}
    ]

    target_path = os.path.join("docs", "Decyra_DuckDB_Implementation_Architecture.docx")
    create_docx(target_path, "Decyra Virtual Golden Layer", sections)
