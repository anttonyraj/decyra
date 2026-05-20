"use client";

import React, { useState, useEffect } from "react";
import { Database, Shield, Check, Users, ArrowRight, Play, MessageSquare, Terminal, ChevronRight, Lock } from "lucide-react";

// CSS Animations injected directly for simplicity and isolation
const animationStyles = `
  @keyframes flowDash {
    to {
      stroke-dashoffset: -20;
    }
  }
  @keyframes pulseSlow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.05); }
  }
  @keyframes wave {
    0% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  .flow-line {
    stroke-dasharray: 5, 5;
    animation: flowDash 1s linear infinite;
  }
  .pulse-dot {
    animation: pulseSlow 2s ease-in-out infinite;
  }
  .wave-item {
    animation: wave 3s ease-in-out infinite;
  }
`;

export function HowItWorksGraphic() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "Which reps are below 80% of quota?";

  useEffect(() => {
    // Loop steps:
    // 0: Connecting (2s)
    // 1: Typing Query (3.5s)
    // 2: Executing SQL (2.5s)
    // 3: Showing Result Table (4s)
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step === 1) {
      let index = 0;
      setTypedText("");
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setTypedText((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else if (step === 0) {
      setTypedText("");
    }
  }, [step]);

  return (
    <div className="w-full overflow-hidden relative min-h-[360px] flex flex-col justify-between">
      <style>{animationStyles}</style>

      {/* Top Banner: Status */}
      <div className="flex items-center justify-between border-b border-[#E5E9F2] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-[#1E2761]" />
          <span className="text-xs font-semibold text-[#1E2761]">db_prod_replica</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-medium border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          CONNECTED
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 flex flex-col justify-center gap-4 relative">
        {/* Step 0: Connecting Schema */}
        {step === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-6 animate-fadeIn">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-[#E8EDF7] rounded-full scale-125 pulse-dot" />
              <Database size={36} className="relative text-[#1E2761]" />
            </div>
            <p className="text-xs font-medium text-[#1E2761]">Analyzing database schema...</p>
            <p className="text-[10px] text-[#5A6478] mt-1">Mapping 14 tables and indexes in seconds</p>
          </div>
        )}

        {/* Step 1: User types query */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E9F2] rounded-xl p-4 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-[#F96167]" />
              <span className="text-[10px] font-bold text-[#F96167] tracking-wide uppercase">Asking Decyra</span>
            </div>
            <div className="min-h-[24px] text-sm text-[#1E2761] font-medium border-r-2 border-[#1E2761] w-fit pr-1" style={{ animation: "blink 1s step-end infinite" }}>
              {typedText}
            </div>
          </div>
        )}

        {/* Step 2: Generates SQL */}
        {step === 2 && (
          <div className="bg-[#1A1F36] rounded-xl p-4 shadow-sm text-white font-mono text-xs animate-fadeIn">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2 text-[10px] text-gray-400">
              <Terminal size={12} />
              <span>GENERATED SQL (READ-ONLY)</span>
            </div>
            <div className="text-blue-400">SELECT <span className="text-white">name, actual/quota * 100</span> AS <span className="text-green-400">pct</span></div>
            <div className="text-blue-400">FROM <span className="text-white">reps</span></div>
            <div className="text-blue-400">WHERE <span className="text-white">actual/quota &lt; 0.8;</span></div>
          </div>
        )}

        {/* Step 3: Returns Results */}
        {step === 3 && (
          <div className="bg-white border border-[#E5E9F2] rounded-xl p-3 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-green-600 tracking-wide uppercase">Results Table</span>
              <span className="text-[10px] text-[#5A6478]">Done in 0.04s</span>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E5E9F2] text-[#5A6478]">
                  <th className="py-1">Rep Name</th>
                  <th className="py-1 text-right">Quota Pct</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F0F2F5] text-[#1E2761]">
                  <td className="py-1 font-medium">Alice Miller</td>
                  <td className="py-1 text-right text-red-500 font-semibold">74%</td>
                </tr>
                <tr className="text-[#1E2761]">
                  <td className="py-1 font-medium">Bob Garcia</td>
                  <td className="py-1 text-right text-red-500 font-semibold">68%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#E5E9F2]">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              step === i ? "bg-[#1E2761] w-4" : "bg-[#A6B0C3]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function WhyDecyraGraphic() {
  const [activeTable, setActiveTable] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTable((prev) => (prev + 1) % 2);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-[280px] flex flex-col justify-between overflow-hidden relative">
      <style>{animationStyles}</style>

      {/* Visual Diagram */}
      <div className="relative flex-1 flex flex-col justify-center">
        {/* Schema Tree Visual */}
        <div className="flex justify-between items-center gap-4 relative">
          
          {/* Table 1 */}
          <div className={`w-[45%] border rounded-xl bg-white p-3 transition-all duration-300 ${activeTable === 0 ? "border-[#F96167] shadow-md scale-102" : "border-[#E5E9F2]"}`}>
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#E5E9F2]">
              <div className={`w-2 h-2 rounded-full ${activeTable === 0 ? "bg-[#F96167]" : "bg-[#1E2761]"}`} />
              <span className="text-[11px] font-bold text-[#1E2761]">deals</span>
            </div>
            <div className="space-y-1 text-[10px] text-[#5A6478]">
              <div className="flex justify-between"><span>id</span><span className="text-gray-400">INT</span></div>
              <div className={`flex justify-between ${activeTable === 0 ? "text-[#F96167] font-semibold" : ""}`}><span>amount</span><span className="text-gray-400">NUM</span></div>
              <div className="flex justify-between"><span>rep_id</span><span className="text-gray-400">INT</span></div>
            </div>
          </div>

          {/* Linking SVG line */}
          <div className="absolute left-[45%] right-[45%] top-1/2 -translate-y-1/2 flex items-center justify-center">
            <svg width="100%" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M0 10 H40" stroke={activeTable === 0 ? "#F96167" : "#1E2761"} strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="20" cy="10" r="4" fill={activeTable === 0 ? "#F96167" : "#1E2761"} className="animate-ping" />
            </svg>
          </div>

          {/* Table 2 */}
          <div className={`w-[45%] border rounded-xl bg-white p-3 transition-all duration-300 ${activeTable === 1 ? "border-[#F96167] shadow-md scale-102" : "border-[#E5E9F2]"}`}>
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#E5E9F2]">
              <div className={`w-2 h-2 rounded-full ${activeTable === 1 ? "bg-[#F96167]" : "bg-[#1E2761]"}`} />
              <span className="text-[11px] font-bold text-[#1E2761]">reps</span>
            </div>
            <div className="space-y-1 text-[10px] text-[#5A6478]">
              <div className="flex justify-between"><span>id</span><span className="text-gray-400">INT</span></div>
              <div className={`flex justify-between ${activeTable === 1 ? "text-[#F96167] font-semibold" : ""}`}><span>name</span><span className="text-gray-400">TXT</span></div>
              <div className="flex justify-between"><span>quota</span><span className="text-gray-400">NUM</span></div>
            </div>
          </div>

        </div>

        {/* Transparent Output panel */}
        <div className="mt-6 bg-white border border-[#E5E9F2] rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold text-[#1E2761]/70 mb-1.5">INTELLIGENT SCHEMA MAPPING</div>
          <div className="text-[11px] text-[#5A6478] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#1E2761]">
              <Check size={12} className="text-green-500" />
              <span>Resolved <span className="font-semibold text-[#F96167]">"deals"</span> to table <code className="bg-gray-100 px-1 rounded">deals</code></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#1E2761]">
              <Check size={12} className="text-green-500" />
              <span>Resolved <span className="font-semibold text-[#F96167]">"amount"</span> to column <code className="bg-gray-100 px-1 rounded">deals.amount</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuiltForGraphic() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    { label: "RevOps", alert: "Pipe Gap: $120K resolved", x: 60, y: 70, side: "left" },
    { label: "Sales VP", alert: "Win Rate: +4.2% change", x: 60, y: 310, side: "left" },
    { label: "Data Team", alert: "Ad-hoc SQL Load: -85%", x: 260, y: 70, side: "right" },
    { label: "CEO / Founder", alert: "ARR: $2.4M target", x: 260, y: 310, side: "right" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 relative min-h-[440px]">
      <style>{animationStyles}</style>

      {/* Header Info */}
      <div className="text-center">
        <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-1">
          Operational Data Hub
        </div>
        <div className="text-[10px] text-[#5A6478]">
          Real-time schema mapping and query distribution
        </div>
      </div>

      <div className="flex-grow w-full relative flex items-center justify-center my-6">
        <svg className="w-full h-full max-h-[360px]" viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg">
          {/* Central Hub at (160, 190) */}
          {/* Connection Lines with glowing dash effects */}
          {roles.map((role, idx) => {
            const active = activeNode === idx;
            const isLeft = role.side === "left";
            
            // Connect coordinates
            const connX = isLeft ? role.x + 50 : role.x - 50;
            const connY = role.y;
            
            return (
              <path
                key={`line-${role.label}`}
                d={`M ${connX} ${connY} L 160 190`}
                stroke={active ? "#F96167" : "#E5E9F2"}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={active ? "5, 5" : "none"}
                className={active ? "flow-line" : ""}
                opacity={active ? 1 : 0.4}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })}

          {/* Central Hub Circle & Icon */}
          <g>
            <circle cx="160" cy="190" r="28" fill="#1E2761" className="shadow-lg" />
            <circle cx="160" cy="190" r="36" fill="none" stroke="#1E2761" strokeWidth="1.5" opacity="0.25" className="animate-ping" style={{ animationDuration: "3s" }} />
            <circle cx="160" cy="190" r="44" fill="none" stroke="#1E2761" strokeWidth="1" opacity="0.15" className="animate-ping" style={{ animationDuration: "4s" }} />
            
            {/* Database Icon inside Central Hub */}
            <foreignObject x="144" y="174" width="32" height="32">
              <div className="text-white flex items-center justify-center w-full h-full">
                <Database size={20} className="animate-pulse" />
              </div>
            </foreignObject>
          </g>

          {/* Role Node Cards */}
          {roles.map((role, idx) => {
            const active = activeNode === idx;
            const isLeft = role.side === "left";
            const cardWidth = 100;
            const cardHeight = 52;
            const cardX = isLeft ? role.x - 50 : role.x - 50;
            const cardY = role.y - 26;

            return (
              <g key={`card-${role.label}`} className="transition-all duration-300">
                {/* Glow filter backdrop */}
                {active && (
                  <rect
                    x={cardX - 4}
                    y={cardY - 4}
                    width={cardWidth + 8}
                    height={cardHeight + 8}
                    rx={10}
                    ry={10}
                    fill="#F96167"
                    opacity="0.1"
                  />
                )}
                
                {/* Card Container */}
                <rect
                  x={cardX}
                  y={cardY}
                  width={cardWidth}
                  height={cardHeight}
                  rx={8}
                  ry={8}
                  fill="white"
                  stroke={active ? "#F96167" : "#E5E9F2"}
                  strokeWidth={active ? 2 : 1}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />

                {/* Role Title */}
                <text
                  x={cardX + 10}
                  y={cardY + 20}
                  fill="#1E2761"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="Inter, sans-serif"
                >
                  {role.label}
                </text>

                {/* Role Status/Alert */}
                <text
                  x={cardX + 10}
                  y={cardY + 36}
                  fill="#5A6478"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                >
                  {role.alert}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function PricingGraphic() {
  const [teamSize, setTeamSize] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTeamSize((prev) => {
        if (prev >= 60) return 5;
        return prev + 15;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const seatCost = teamSize * 30; // $30/seat
  const decyraCost = 299; // Flat rate

  return (
    <div className="w-full bg-[#1E2761]/5 border border-[#E5E9F2] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] min-h-[320px] flex flex-col justify-between overflow-hidden relative">
      <div>
        <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-1">
          Seat Cost comparison
        </div>
        <div className="text-[10px] text-[#5A6478]">
          Watch how costs behave as your operations scale
        </div>
      </div>

      <div className="my-6 space-y-4">
        {/* Dynamic Slider Stat */}
        <div className="bg-white border border-[#E5E9F2] rounded-xl p-3 flex justify-between items-center shadow-sm">
          <div className="text-xs font-bold text-[#1E2761]">Team Size Scaling</div>
          <div className="bg-[#E8EDF7] text-[#1E2761] text-xs font-bold px-2 py-0.5 rounded-full">
            {teamSize} members
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-3">
          {/* Competitor Cost Bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#5A6478]">Seat-Based Tools ($30/mo per user)</span>
              <span className="font-semibold text-red-500">${seatCost}/mo</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 transition-all duration-500"
                style={{ width: `${Math.min((seatCost / 1800) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Decyra Cost Bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#1E2761] font-semibold">Decyra Flat Rate</span>
              <span className="font-semibold text-green-600">${decyraCost}/mo</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(decyraCost / 1800) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Message */}
      <div className="text-center bg-green-50 text-green-700 border border-green-200 text-xs font-semibold p-2.5 rounded-xl">
        Save ${Math.max(0, seatCost - decyraCost)}/mo as your team scales up!
      </div>
    </div>
  );
}

export function FaqGraphic() {
  return (
    <div className="w-full min-h-[160px] flex flex-col justify-center items-center overflow-hidden relative">
      <style>{animationStyles}</style>
      
      {/* Visual representation of Q&A resolving */}
      <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-full border border-[#E5E9F2] shadow-sm mb-6">
        <Shield size={44} className="text-[#1E2761]" />
        <Lock size={20} className="absolute text-white top-[38%] left-[41%]" />
        
        {/* Pulsing indicator dots around */}
        <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-green-500 pulse-dot" />
        <div className="absolute bottom-3 left-1 w-2.5 h-2.5 rounded-full bg-[#F96167] pulse-dot" />
      </div>

      <div className="text-center max-w-[240px]">
        <div className="text-xs font-bold text-[#1E2761] mb-1">Database Guard System</div>
        <p className="text-[10px] text-[#5A6478] leading-relaxed">
          Decyra physically cannot edit records or delete tables. All transactions are 100% read-only.
        </p>
      </div>
    </div>
  );
}

export function ContactGraphic() {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl min-h-[220px] flex flex-col justify-center overflow-hidden relative">
      <style>{animationStyles}</style>

      {/* Animated Connector tunnel */}
      <div className="flex justify-between items-center my-8 relative">
        {/* Decyra */}
        <div className="flex flex-col items-center gap-1 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[#F96167] flex items-center justify-center text-white font-bold text-sm shadow-md">
            D
          </div>
          <span className="text-[9px] text-[#A6B0C3]">Decyra</span>
        </div>

        {/* Animated Connector pipe */}
        <div className="flex-1 mx-4 relative h-4 bg-white/10 rounded-full border border-white/5 overflow-hidden">
          {/* Animated dot flow */}
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#F96167] to-transparent w-8 animate-flowLeft" 
               style={{
                 animation: "flowDash 2s linear infinite",
                 backgroundImage: "linear-gradient(90deg, transparent, #F96167, transparent)"
               }}
          />
          {/* Pulsing secure padlock in the middle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1F36] border border-white/20 rounded-full p-0.5">
            <Lock size={8} className="text-green-400" />
          </div>
        </div>

        {/* Database */}
        <div className="flex flex-col items-center gap-1 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-md">
            <Database size={18} />
          </div>
          <span className="text-[9px] text-[#A6B0C3]">Your DB</span>
        </div>
      </div>

      {/* Lock status banner */}
      <div className="bg-[#2A314D] border border-white/10 text-white text-[10px] rounded-lg p-2.5 flex items-center gap-2">
        <Check size={12} className="text-green-400 flex-shrink-0" />
        <span>SSL pipeline verified with zero data retention storage.</span>
      </div>
    </div>
  );
}

export function SecurityGraphic() {
  const [activeQuery, setActiveQuery] = useState(0); // 0: SELECT (Allowed), 1: DELETE (Blocked)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuery((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 relative min-h-[440px]">
      <style>{animationStyles}</style>

      {/* Header Info */}
      <div className="text-center">
        <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-1">
          Query Security Gateway
        </div>
        <div className="text-[10px] text-[#5A6478]">
          Automatic restriction of write/delete commands
        </div>
      </div>

      <div className="flex-grow w-full relative flex items-center justify-center my-6">
        <svg className="w-full h-full max-h-[360px]" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg">
          {/* Upper Pipeline (From Query box to Shield) */}
          <line
            x1="160"
            y1="86"
            x2="160"
            y2="131"
            stroke={activeQuery === 0 ? "#10B981" : "#EF4444"}
            strokeWidth="2"
            strokeDasharray="4 4"
            className="flow-line"
            style={{ transition: "stroke 0.3s" }}
          />

          {/* Lower Pipeline (From Shield to Database) */}
          <line
            x1="160"
            y1="191"
            x2="160"
            y2="250"
            stroke={activeQuery === 0 ? "#10B981" : "#EF4444"}
            strokeWidth={activeQuery === 0 ? "2" : "1.5"}
            strokeDasharray={activeQuery === 0 ? "4 4" : "4, 4"}
            className={activeQuery === 0 ? "flow-line" : ""}
            opacity={activeQuery === 0 ? 1 : 0.35}
            style={{ transition: "stroke 0.3s, opacity 0.3s" }}
          />

          {/* Block Indicator Cross (Only on Blocked state) */}
          {activeQuery === 1 && (
            <g transform="translate(152, 212)" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="0" x2="16" y2="16" />
              <line x1="16" y1="0" x2="0" y2="16" />
            </g>
          )}

          {/* Top: Incoming Query Card */}
          <g>
            <rect
              x="60"
              y="30"
              width="200"
              height="56"
              rx="10"
              ry="10"
              fill="white"
              stroke={activeQuery === 0 ? "#10B981" : "#EF4444"}
              strokeWidth="1.5"
              style={{ transition: "stroke 0.3s" }}
            />
            {/* Title */}
            <text x="160" y="48" textAnchor="middle" fill="#5A6478" fontSize="8" fontWeight="bold" fontFamily="Inter, sans-serif" letterSpacing="0.05em">
              INCOMING SQL
            </text>
            {/* SQL Content */}
            <text x="160" y="68" textAnchor="middle" fill={activeQuery === 0 ? "#10B981" : "#EF4444"} fontSize="10" fontWeight="bold" fontFamily="monospace" style={{ transition: "fill 0.3s" }}>
              {activeQuery === 0 ? "SELECT * FROM revenue;" : "DELETE FROM users;"}
            </text>
          </g>

          {/* Center: Shield Gate */}
          <g>
            {/* Pulsing ring */}
            <circle
              cx="160"
              cy="161"
              r="34"
              fill="none"
              stroke={activeQuery === 0 ? "#10B981" : "#EF4444"}
              strokeWidth="1.5"
              opacity="0.2"
              className="animate-ping"
              style={{ animationDuration: "3s", transition: "stroke 0.3s" }}
            />
            <circle
              cx="160"
              cy="161"
              r="26"
              fill={activeQuery === 0 ? "#10B981" : "#EF4444"}
              style={{ transition: "fill 0.3s" }}
            />
            {/* Shield Icon */}
            <foreignObject x="146" y="147" width="28" height="28">
              <div className="text-white flex items-center justify-center w-full h-full">
                <Shield size={18} className="animate-pulse" />
              </div>
            </foreignObject>
          </g>

          {/* Bottom: Destination DB */}
          <g opacity={activeQuery === 0 ? 1 : 0.6} style={{ transition: "opacity 0.3s" }}>
            <rect
              x="60"
              y="250"
              width="200"
              height="56"
              rx="10"
              ry="10"
              fill="white"
              stroke={activeQuery === 0 ? "#E5E9F2" : "#EF4444"}
              strokeWidth="1.5"
              style={{ transition: "stroke 0.3s" }}
            />
            {/* Database Icon */}
            <foreignObject x="74" y="262" width="32" height="32">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeQuery === 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}>
                <Database size={16} />
              </div>
            </foreignObject>
            {/* Labels */}
            <text x="116" y="274" fill="#1E2761" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif">
              PostgreSQL DB
            </text>
            <text x="116" y="290" fill="#5A6478" fontSize="8" fontFamily="Inter, sans-serif">
              {activeQuery === 0 ? "Read-Only Connection" : "Transaction Blocked"}
            </text>
          </g>
        </svg>
      </div>

      {/* Status banner */}
      <div className="w-full text-center">
        {activeQuery === 0 ? (
          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            READ ONLY - ALLOWED
          </span>
        ) : (
          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            WRITE BLOCKED - REJECTED
          </span>
        )}
      </div>
    </div>
  );
}

export function HeroBackgroundGraphic() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const hero = document.getElementById("product");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const hero = document.getElementById("product");
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseenter", handleMouseEnter);
      hero.addEventListener("mouseleave", handleMouseLeave);
      
      const rect = hero.getBoundingClientRect();
      setMousePos({ x: rect.width / 2, y: rect.height / 2 });
    }

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseenter", handleMouseEnter);
        hero.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Background radial gradient mask for grid/animations (lighter center mask to show graphics clearly) */}
      <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_8%,black_92%)] opacity-40 z-10" />

      {/* Interactive mouse-following spotlight glow */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-screen bg-gradient-to-r from-[#F96167]/20 to-[#1E2761]/20 blur-[80px] transition-opacity duration-300 z-10"
        style={{
          left: `${mousePos.x - 200}px`,
          top: `${mousePos.y - 200}px`,
          width: "400px",
          height: "400px",
          opacity: isHovered ? 1 : 0.3,
          willChange: "left, top",
        }}
      />

      {/* Futuristic soft glowing orbs (Brighter static ones like the image) */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#F96167]/18 blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#1E2761]/15 blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: "10s" }} />

      <svg className="absolute inset-0 w-full h-full opacity-[0.38] z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hero-flow-grad-coral" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F96167" stopOpacity="0" />
            <stop offset="40%" stopColor="#F96167" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#F96167" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F96167" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-flow-grad-navy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E2761" stopOpacity="0" />
            <stop offset="40%" stopColor="#1E2761" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#1E2761" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1E2761" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-flow-grad-lavender" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Data highway lines (horizontal pipelines) */}
        <path d="M-100,120 C300,50 600,280 1500,160" fill="none" stroke="url(#hero-flow-grad-coral)" strokeWidth="2.5" className="flow-line" />
        <path d="M-100,280 C400,420 700,120 1500,340" fill="none" stroke="url(#hero-flow-grad-navy)" strokeWidth="1.5" className="flow-line" />
        <path d="M-100,420 C200,320 800,480 1500,380" fill="none" stroke="url(#hero-flow-grad-lavender)" strokeWidth="2" className="flow-line" />
        <path d="M-100,70 C200,210 800,40 1500,190" fill="none" stroke="url(#hero-flow-grad-navy)" strokeWidth="1.5" className="flow-line" />
        <path d="M-100,340 C500,180 900,420 1500,300" fill="none" stroke="url(#hero-flow-grad-coral)" strokeWidth="2" className="flow-line" />

        {/* Vertical/Diagonal pipelines */}
        <path d="M150,-100 C300,200 100,400 250,700" fill="none" stroke="url(#hero-flow-grad-lavender)" strokeWidth="1.5" strokeDasharray="5,5" className="flow-line" opacity="0.6" />
        <path d="M1100,-100 C950,200 1150,400 1000,700" fill="none" stroke="url(#hero-flow-grad-coral)" strokeWidth="1.5" strokeDasharray="5,5" className="flow-line" opacity="0.6" />

        {/* Streaming Data packet particles using animateMotion */}
        <circle r="5" fill="#F96167" className="opacity-90">
          <animateMotion dur="10s" repeatCount="indefinite" path="M-100,120 C300,50 600,280 1500,160" />
        </circle>
        <circle r="3.5" fill="#1E2761" className="opacity-80">
          <animateMotion dur="14s" begin="2s" repeatCount="indefinite" path="M-100,280 C400,420 700,120 1500,340" />
        </circle>
        <circle r="4.5" fill="#8B5CF6" className="opacity-90">
          <animateMotion dur="11s" begin="4s" repeatCount="indefinite" path="M-100,420 C200,320 800,480 1500,380" />
        </circle>
        <circle r="4" fill="#1E2761" className="opacity-85">
          <animateMotion dur="15s" begin="1s" repeatCount="indefinite" path="M-100,70 C200,210 800,40 1500,190" />
        </circle>
        <circle r="4.5" fill="#F96167" className="opacity-90">
          <animateMotion dur="12s" begin="6s" repeatCount="indefinite" path="M-100,340 C500,180 900,420 1500,300" />
        </circle>
        <circle r="3.5" fill="#8B5CF6" className="opacity-85">
          <animateMotion dur="9s" begin="3s" repeatCount="indefinite" path="M150,-100 C300,200 100,400 250,700" />
        </circle>
        <circle r="4" fill="#F96167" className="opacity-90">
          <animateMotion dur="13s" begin="5s" repeatCount="indefinite" path="M1100,-100 C950,200 1150,400 1000,700" />
        </circle>

        {/* Extra offset particles to make data flows denser */}
        <circle r="4" fill="#F96167" className="opacity-80">
          <animateMotion dur="16s" begin="5s" repeatCount="indefinite" path="M-100,120 C300,50 600,280 1500,160" />
        </circle>
        <circle r="3" fill="#1E2761" className="opacity-70">
          <animateMotion dur="18s" begin="7s" repeatCount="indefinite" path="M-100,280 C400,420 700,120 1500,340" />
        </circle>
        <circle r="3.5" fill="#8B5CF6" className="opacity-80">
          <animateMotion dur="13s" begin="8s" repeatCount="indefinite" path="M-100,420 C200,320 800,480 1500,380" />
        </circle>

        {/* Interactive Mouse pointer data grid lock & target crosshair */}
        {isHovered && (
          <g>
            {/* Horizontal tracking line */}
            <line
              x1="0"
              y1={mousePos.y}
              x2="100%"
              y2={mousePos.y}
              stroke="#F96167"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="4,4"
            />
            {/* Vertical tracking line */}
            <line
              x1={mousePos.x}
              y1="0"
              x2={mousePos.x}
              y2="100%"
              stroke="#1E2761"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="4,4"
            />
            {/* Coordinates label */}
            <rect
              x={mousePos.x + 12}
              y={mousePos.y + 12}
              width="82"
              height="18"
              rx="4"
              fill="#1E2761"
              opacity="0.8"
            />
            <text
              x={mousePos.x + 18}
              y={mousePos.y + 24}
              fill="white"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {`DATA_SYS: ${Math.round(mousePos.x)},${Math.round(mousePos.y)}`}
            </text>

            {/* Glowing target cursor rings */}
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r="8"
              fill="none"
              stroke="#F96167"
              strokeWidth="1.5"
              className="animate-pulse"
            />
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r="4"
              fill="#1E2761"
              stroke="white"
              strokeWidth="1"
            />
            
            {/* Interactive connecting rays to closest main lanes */}
            <line x1={mousePos.x} y1={mousePos.y} x2={mousePos.x + 40} y2={mousePos.y - 30} stroke="#F96167" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
            <line x1={mousePos.x} y1={mousePos.y} x2={mousePos.x - 50} y2={mousePos.y + 20} stroke="#1E2761" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
            <circle cx={mousePos.x + 40} cy={mousePos.y - 30} r="2.5" fill="#F96167" opacity="0.7" />
            <circle cx={mousePos.x - 50} cy={mousePos.y + 20} r="2.5" fill="#1E2761" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}
