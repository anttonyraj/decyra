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
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    { label: "RevOps", alert: "Pipe Gap: $120K resolved", color: "#3B82F6" },
    { label: "Sales VP", alert: "Win Rate: +4.2% change", color: "#10B981" },
    { label: "Data Team", alert: "Ad-hoc SQL Load: -85%", color: "#EC4899" },
    { label: "CEO / Founder", alert: "ARR: $2.4M live target", color: "#8B5CF6" },
  ];

  return (
    <div className="w-full min-h-[220px] flex flex-col justify-between overflow-hidden relative">
      <style>{animationStyles}</style>

      {/* Central Flow Node Graphic */}
      <div className="flex-1 flex flex-col justify-center items-center relative py-4">
        {/* Central Hub */}
        <div className="w-16 h-16 rounded-full bg-[#1E2761] text-white flex items-center justify-center shadow-lg relative z-10">
          <Database size={24} className="animate-pulse" />
          {/* Animated pulsing outer rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#1E2761] scale-125 animate-ping opacity-25" />
        </div>

        {/* Surrounding Nodes */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          {/* Left Side Roles */}
          <div className="flex flex-col gap-12 w-[35%]">
            {roles.slice(0, 2).map((role, idx) => {
              const active = activeNode === idx;
              return (
                <div
                  key={role.label}
                  className={`bg-white border rounded-xl p-2.5 shadow-sm transition-all duration-300 ${
                    active ? "border-[#F96167] scale-105" : "border-[#E5E9F2]"
                  }`}
                >
                  <div className="text-[10px] font-bold text-[#1E2761]">{role.label}</div>
                  <div className="text-[9px] text-[#5A6478] truncate mt-0.5">{role.alert}</div>
                </div>
              );
            })}
          </div>

          {/* Right Side Roles */}
          <div className="flex flex-col gap-12 w-[35%]">
            {roles.slice(2, 4).map((role, idx) => {
              const active = activeNode === idx + 2;
              return (
                <div
                  key={role.label}
                  className={`bg-white border rounded-xl p-2.5 shadow-sm transition-all duration-300 ${
                    active ? "border-[#F96167] scale-105" : "border-[#E5E9F2]"
                  }`}
                >
                  <div className="text-[10px] font-bold text-[#1E2761]">{role.label}</div>
                  <div className="text-[9px] text-[#5A6478] truncate mt-0.5">{role.alert}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connective background SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
          {/* Top Left */}
          <path d="M40,50 L100,100" stroke="#1E2761" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
          {/* Bottom Left */}
          <path d="M40,150 L100,100" stroke="#1E2761" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
          {/* Top Right */}
          <path d="M160,50 L100,100" stroke="#1E2761" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
          {/* Bottom Right */}
          <path d="M160,150 L100,100" stroke="#1E2761" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
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
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl min-h-[300px] flex flex-col justify-between overflow-hidden relative">
      <style>{animationStyles}</style>

      <div>
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
          Secure Integration Flow
        </div>
        <div className="text-[10px] text-[#A6B0C3]">
          SSL Encrypted, Read-Only database pipeline
        </div>
      </div>

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
      setActiveQuery((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-[340px] flex flex-col justify-between overflow-hidden relative">
      <style>{animationStyles}</style>

      <div>
        <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-1">
          Query Security Gateway
        </div>
        <div className="text-[10px] text-[#5A6478]">
          Automatic restriction of write/delete commands
        </div>
      </div>

      {/* Interactive Simulation */}
      <div className="flex-1 flex flex-col justify-center items-center relative my-4">
        {/* Shield Gateway */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-all duration-300 ${
          activeQuery === 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          <Shield size={24} className="animate-pulse" />
          <div className={`absolute inset-0 rounded-full scale-125 animate-ping opacity-25 ${
            activeQuery === 0 ? "border-2 border-green-500" : "border-2 border-red-500"
          }`} />
        </div>

        {/* Incoming query label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-[#E5E9F2] rounded-xl px-3 py-1.5 shadow-sm text-xs font-mono text-center transition-all duration-300">
          {activeQuery === 0 ? (
            <span className="text-green-600 font-semibold">SELECT * FROM revenue;</span>
          ) : (
            <span className="text-red-500 font-semibold">DELETE FROM users;</span>
          )}
        </div>

        {/* Status text */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          {activeQuery === 0 ? (
            <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              READ ONLY - ALLOWED
            </span>
          ) : (
            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              WRITE BLOCKED - REJECTED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
