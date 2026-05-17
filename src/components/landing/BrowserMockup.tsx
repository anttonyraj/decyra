import React from "react";
import Wordmark from "./Wordmark";

export default function BrowserMockup() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-[#E5E9F2] bg-white"
      style={{ boxShadow: "0 8px 24px rgba(30,39,97,0.08)" }}
      role="img"
      aria-label="Decyra product interface showing a RevOps question, generated SQL, results table, and plain-English explanation"
    >
      {/* Browser chrome */}
      <div className="bg-[#F4F5F7] border-b border-[#E5E9F2] px-3 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
        </div>
        <div className="flex-1 bg-white rounded border border-[#E5E9F2] text-[10px] text-[#5A6478] px-2.5 py-1 text-center font-mono">
          decyra.systems/ask
        </div>
      </div>

      {/* Browser content */}
      <div className="p-4 space-y-3">
        {/* Mini wordmark */}
        <Wordmark size="sm" />

        {/* Question input */}
        <div className="border border-[#E5E9F2] rounded-lg p-3 bg-[#FAFBFC] text-[13px] text-[#1A1F36] leading-snug">
          How is our Q3 pipeline tracking against quota?
        </div>

        {/* SQL label */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F96167] mb-1">
            Generated SQL
          </p>
          <div className="bg-[#F4F5F7] border border-[#E5E9F2] rounded-lg p-2.5 overflow-x-auto">
            <pre className="text-[10px] text-[#1A1F36] font-mono leading-relaxed whitespace-pre">{`SELECT rep.name,
       SUM(opp.amount) AS pipeline,
       rep.quota
FROM opportunities opp
JOIN sales_reps rep
  ON opp.rep_id = rep.id
WHERE opp.close_date
      BETWEEN '2026-07-01'
      AND '2026-09-30'
GROUP BY rep.name, rep.quota
ORDER BY pipeline DESC;`}</pre>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A6478] mb-1">
            Results
          </p>
          <div className="border border-[#E5E9F2] rounded-lg overflow-hidden text-[11px]">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-[#F4F5F7] border-b border-[#E5E9F2]">
              {["Rep", "Pipeline", "Quota", "% to Plan"].map((h) => (
                <div key={h} className="px-2 py-1.5 font-semibold text-[#1E2761] text-[10px] uppercase tracking-wide">
                  {h}
                </div>
              ))}
            </div>
            {/* Rows */}
            {[
              { rep: "Sarah K.", pipeline: "$487K", quota: "$400K", pct: "122%", good: true },
              { rep: "Mike R.", pipeline: "$342K", quota: "$400K", pct: "86%", good: false },
              { rep: "Jen P.", pipeline: "$298K", quota: "$350K", pct: "85%", good: false },
              { rep: "Tom W.", pipeline: "$211K", quota: "$350K", pct: "60%", bad: true },
            ].map((row, i) => (
              <div
                key={row.rep}
                className={`grid grid-cols-4 border-b last:border-b-0 border-[#E5E9F2] ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FAFBFC]"
                }`}
              >
                <div className="px-2 py-1.5 font-medium text-[#1A1F36]">{row.rep}</div>
                <div className="px-2 py-1.5 text-[#1A1F36]">{row.pipeline}</div>
                <div className="px-2 py-1.5 text-[#5A6478]">{row.quota}</div>
                <div
                  className={`px-2 py-1.5 font-semibold ${
                    row.good ? "text-green-600" : row.bad ? "text-[#F96167]" : "text-[#1A1F36]"
                  }`}
                >
                  {row.pct}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plain-English Explanation */}
        <div className="bg-[#FDE2E3] border border-[#F9C5C7] rounded-lg p-3">
          <p className="text-[11px] text-[#1A1F36] leading-relaxed">
            <span className="font-semibold text-[#F96167]">Insight: </span>
            Q3 pipeline is healthy at $1.34M across 4 reps, with Sarah K. leading at 122% of quota. Tom W. is below plan at 60% and may need pipeline support before quarter-end.
          </p>
        </div>
      </div>
    </div>
  );
}
