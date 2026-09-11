"use client";

import React from "react";
import { Mic, MicOff, Globe, Sparkles, ExternalLink, Languages, Loader2 } from "lucide-react";

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
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦", speechCode: "ar-SA", dir: "rtl", placeholder: "اسأل أي سؤال عن بياناتك باللغة العربية..." },
  { code: "en", name: "English (US)", flag: "🇺🇸", speechCode: "en-US", dir: "ltr", placeholder: "Ask anything about your data..." },
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
  speechError?: string | null;
  onDismissError?: () => void;
  onGoogleTranslate?: () => void;
  isTranslating?: boolean;
  hasTextToTranslate?: boolean;
  className?: string;
}

export default function SonictraVoiceBar({
  selectedLanguage,
  onLanguageChange,
  isListening,
  onToggleListening,
  speechSupported,
  speechError = null,
  onDismissError,
  onGoogleTranslate,
  isTranslating = false,
  hasTextToTranslate = false,
  className = "",
}: SonictraVoiceBarProps) {
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
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
              className="bg-white border border-[#CBD5E1] text-[#1E2761] font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#F96167] cursor-pointer shadow-2xs hover:bg-[#F8FAFC] transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Google Translate Action Button */}
          {onGoogleTranslate && hasTextToTranslate && (
            <button
              type="button"
              onClick={onGoogleTranslate}
              disabled={isTranslating}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-[#CBD5E1] text-[#1E2761] hover:border-[#4285F4] hover:text-[#4285F4] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Translate to English using Google Translate Neural Engine"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-[#4285F4]" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3 h-3 text-[#4285F4]" />
                  <span>Translate to English</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Middle & Right: Voice Button & Embedded Sonictra AI Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Speechnotes Web Speech API Dictation Button */}
          {speechSupported ? (
            <button
              type="button"
              onClick={onToggleListening}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse ring-2 ring-rose-300"
                  : "bg-white text-[#1E2761] border border-[#CBD5E1] hover:border-[#F96167] hover:text-[#F96167]"
              }`}
              title={isListening ? "Click to stop listening" : "Click to speak question"}
            >
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <Mic className="w-3.5 h-3.5" />
                  <span>Listening ({currentLang.flag} {currentLang.name.split(' ')[0]})...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#F96167]" />
                  <span>Speak Question ({currentLang.flag})</span>
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

          {/* Embedded Link to Sonictra.com */}
          <a
            href="https://www.sonictra.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FE] hover:bg-[#dbe9fd] border border-[#C7D7F7] text-[10px] font-bold text-[#1E2761] tracking-wide transition-all duration-150 group cursor-pointer shadow-2xs"
            title="Visit Sonictra AI - Voice & Translation Ecosystem (Opens in new tab)"
          >
            <Sparkles className="w-3 h-3 text-[#F96167] group-hover:rotate-12 transition-transform" />
            <span>
              Voice &amp; Translation:{" "}
              <strong className="text-[#F96167] underline decoration-[#F96167]/30 group-hover:decoration-[#F96167]">
                Sonictra AI
              </strong>
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-[#5A6478] group-hover:text-[#1E2761] transition-colors" />
          </a>
        </div>
      </div>

      {/* Inline Microphone Diagnostic / Permission Warning */}
      {speechError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <MicOff className="w-4 h-4 text-red-600 shrink-0" />
            <span>{speechError}</span>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="text-red-600 hover:text-red-900 font-bold px-1.5 py-0.5 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
