"use client";

import React from "react";
import { Mic, MicOff, Globe, Sparkles, Volume2 } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  speechCode: string;
  dir: "ltr" | "rtl";
  placeholder: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "auto", name: "Auto-Detect (تلقائي)", flag: "🌐", speechCode: "en-US", dir: "ltr", placeholder: "Ask anything about your data..." },
  { code: "en", name: "English (US)", flag: "🇺🇸", speechCode: "en-US", dir: "ltr", placeholder: "Ask anything about your data..." },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦", speechCode: "ar-SA", dir: "rtl", placeholder: "اسأل أي سؤال عن بياناتك باللغة العربية..." },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸", speechCode: "es-ES", dir: "ltr", placeholder: "Pregunta cualquier cosa sobre tus datos..." },
  { code: "fr", name: "Français (French)", flag: "🇫🇷", speechCode: "fr-FR", dir: "ltr", placeholder: "Posez n'importe quelle question sur vos données..." },
  { code: "de", name: "Deutsch (German)", flag: "🇩🇪", speechCode: "de-DE", dir: "ltr", placeholder: "Stellen Sie eine Frage zu Ihren Daten..." },
  { code: "zh", name: "中文 (Mandarin)", flag: "🇨🇳", speechCode: "zh-CN", dir: "ltr", placeholder: "输入关于您数据的任何问题..." },
  { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵", speechCode: "ja-JP", dir: "ltr", placeholder: "データについて何でも質問してください..." },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳", speechCode: "hi-IN", dir: "ltr", placeholder: "अपने डेटा के बारे में कोई भी प्रश्न पूछें..." },
];

interface SonictraVoiceBarProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  speechSupported: boolean;
  className?: string;
}

export default function SonictraVoiceBar({
  selectedLanguage,
  onLanguageChange,
  isListening,
  onToggleListening,
  speechSupported,
  className = "",
}: SonictraVoiceBarProps) {
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs ${className}`}
    >
      {/* Left: Language Dropdown Selector */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[#5A6478] font-semibold">
          <Globe className="w-3.5 h-3.5 text-[#1E2761]" />
          <span>Language:</span>
        </div>
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-white border border-[#CBD5E1] text-[#1E2761] font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#F96167] cursor-pointer shadow-2xs hover:bg-[#F8FAFC] transition-colors"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle & Right: Voice Button (Speechnotes Style) & Sonictra Badge */}
      <div className="flex items-center gap-3">
        {/* Speechnotes Web Speech API Dictation Button */}
        {speechSupported ? (
          <button
            type="button"
            onClick={onToggleListening}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isListening
                ? "bg-rose-500 text-white animate-pulse ring-2 ring-rose-300"
                : "bg-white text-[#1E2761] border border-[#CBD5E1] hover:border-[#F96167] hover:text-[#F96167]"
            }`}
            title="Click to speak (Speechnotes Voice Dictation)"
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <Mic className="w-3.5 h-3.5" />
                <span>Listening ({currentLang.code.toUpperCase()})...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#F96167]" />
                <span>Speak Question</span>
              </>
            )}
          </button>
        ) : (
          <span
            className="text-[10px] text-[#94A3B8] italic hidden sm:inline"
            title="Speech recognition available in Chrome/Edge/Safari"
          >
            Voice requires Chrome/Edge
          </span>
        )}

        {/* Powered by Sonictra AI Ecosystem Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3FE] border border-[#C7D7F7] text-[10px] font-bold text-[#1E2761] tracking-wide">
          <Sparkles className="w-3 h-3 text-[#F96167]" />
          <span>Voice &amp; Translation: <strong className="text-[#F96167]">Sonictra AI</strong></span>
        </div>
      </div>
    </div>
  );
}
