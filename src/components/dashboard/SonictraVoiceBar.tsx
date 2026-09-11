"use client";

import React from "react";
import { Mic, MicOff, Globe, Sparkles, ExternalLink, ChevronDown } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  speechCode: string;
  placeholder?: string;
}

// Comprehensive world languages with English as default (index 0)
export const ALL_WORLD_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English", dir: "ltr", speechCode: "en-US", placeholder: "Ask anything about your data..." },
  { code: "ar", name: "Arabic", native: "العربية (Arabic)", dir: "rtl", speechCode: "ar-SA", placeholder: "اكتب أو تحدث بالعربية (سيتم عرض الترجمة بالإنجليزية تلقائياً لتعديلها)..." },
  { code: "es", name: "Spanish", native: "Español (Spanish)", dir: "ltr", speechCode: "es-ES", placeholder: "Pregunta cualquier cosa sobre tus datos..." },
  { code: "fr", name: "French", native: "Français (French)", dir: "ltr", speechCode: "fr-FR", placeholder: "Posez n'importe quelle question sur vos données..." },
  { code: "hi", name: "Hindi", native: "हिन्दी (Hindi)", dir: "ltr", speechCode: "hi-IN", placeholder: "अपने डेटा के बारे में कोई भी प्रश्न पूछें..." },
  { code: "zh", name: "Chinese", native: "中文 (Chinese)", dir: "ltr", speechCode: "zh-CN", placeholder: "询问有关您数据的任何问题..." },
  { code: "de", name: "German", native: "Deutsch (German)", dir: "ltr", speechCode: "de-DE", placeholder: "Fragen Sie alles zu Ihren Daten..." },
  { code: "ja", name: "Japanese", native: "日本語 (Japanese)", dir: "ltr", speechCode: "ja-JP" },
  { code: "pt", name: "Portuguese", native: "Português (Portuguese)", dir: "ltr", speechCode: "pt-BR" },
  { code: "ru", name: "Russian", native: "Русский (Russian)", dir: "ltr", speechCode: "ru-RU" },
  { code: "bn", name: "Bengali", native: "বাংলা (Bengali)", dir: "ltr", speechCode: "bn-BD" },
  { code: "ur", name: "Urdu", native: "اردو (Urdu)", dir: "rtl", speechCode: "ur-PK" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", speechCode: "id-ID" },
  { code: "tr", name: "Turkish", native: "Türkçe (Turkish)", dir: "ltr", speechCode: "tr-TR" },
  { code: "ko", name: "Korean", native: "한국어 (Korean)", dir: "ltr", speechCode: "ko-KR" },
  { code: "it", name: "Italian", native: "Italiano (Italian)", dir: "ltr", speechCode: "it-IT" },
  { code: "fa", name: "Persian", native: "فارسی (Persian)", dir: "rtl", speechCode: "fa-IR" },
  { code: "nl", name: "Dutch", native: "Nederlands (Dutch)", dir: "ltr", speechCode: "nl-NL" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr", speechCode: "vi-VN" },
  { code: "pl", name: "Polish", native: "Polski (Polish)", dir: "ltr", speechCode: "pl-PL" },
  { code: "th", name: "Thai", native: "ไทย (Thai)", dir: "ltr", speechCode: "th-TH" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", dir: "ltr", speechCode: "ms-MY" },
  { code: "te", name: "Telugu", native: "తెలుగు (Telugu)", dir: "ltr", speechCode: "te-IN" },
  { code: "ta", name: "Tamil", native: "தமிழ் (Tamil)", dir: "ltr", speechCode: "ta-IN" },
  { code: "mr", name: "Marathi", native: "मराठी (Marathi)", dir: "ltr", speechCode: "mr-IN" },
  { code: "sw", name: "Swahili", native: "Kiswahili", dir: "ltr", speechCode: "sw-KE" },
  { code: "tl", name: "Tagalog", native: "Filipino (Tagalog)", dir: "ltr", speechCode: "tl-PH" },
  { code: "he", name: "Hebrew", native: "עברית (Hebrew)", dir: "rtl", speechCode: "he-IL" },
  { code: "el", name: "Greek", native: "Ελληνικά (Greek)", dir: "ltr", speechCode: "el-GR" },
  { code: "sv", name: "Swedish", native: "Svenska (Swedish)", dir: "ltr", speechCode: "sv-SE" },
  { code: "cs", name: "Czech", native: "Čeština (Czech)", dir: "ltr", speechCode: "cs-CZ" },
  { code: "ro", name: "Romanian", native: "Română (Romanian)", dir: "ltr", speechCode: "ro-RO" },
  { code: "hu", name: "Hungarian", native: "Magyar (Hungarian)", dir: "ltr", speechCode: "hu-HU" },
  { code: "da", name: "Danish", native: "Dansk (Danish)", dir: "ltr", speechCode: "da-DK" },
  { code: "fi", name: "Finnish", native: "Suomi (Finnish)", dir: "ltr", speechCode: "fi-FI" },
  { code: "no", name: "Norwegian", native: "Norsk (Norwegian)", dir: "ltr", speechCode: "no-NO" },
  { code: "uk", name: "Ukrainian", native: "Українська", dir: "ltr", speechCode: "uk-UA" },
];

export const SUPPORTED_LANGUAGES = ALL_WORLD_LANGUAGES;

interface SonictraVoiceBarProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  speechSupported: boolean;
  speechError?: string | null;
  onDismissError?: () => void;
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
  className = "",
}: SonictraVoiceBarProps) {
  const activeLang =
    ALL_WORLD_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    ALL_WORLD_LANGUAGES[0];

  return (
    <div className={`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3 shadow-2xs ${className}`}>
      {/* Main Single Row: Language Dropdown + Speak Button + Sonictra AI Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Language Selector + Speak Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2761]">
              <Globe className="w-4 h-4 text-[#F96167]" />
              <span className="text-[11px] uppercase tracking-wider text-[#5A6478]">Language:</span>
            </div>

            <div className="relative inline-flex items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="text-xs font-semibold rounded-xl pl-3 pr-7 py-2 bg-white text-[#1E2761] border border-[#CBD5E1] hover:border-[#1E2761] focus:border-[#F96167] focus:ring-2 focus:ring-[#F96167]/20 cursor-pointer transition-all appearance-none shadow-2xs outline-hidden"
                title="Select language"
              >
                {ALL_WORLD_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-[#5A6478]" />
            </div>
          </div>

          {/* Speak Question Microphone Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-2 ring-rose-300"
                : "bg-white text-[#1E2761] border border-[#CBD5E1] hover:border-[#F96167] hover:text-[#F96167] hover:bg-[#FFF5F5]"
            }`}
            title={isListening ? "Click to stop recording" : `Click to speak in ${activeLang.native}`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <Mic className="w-3.5 h-3.5" />
                <span>Listening ({activeLang.name})... Click to stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#F96167]" />
                <span>Speak Question</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Embedded Sonictra AI Badge */}
        <a
          href="https://www.sonictra.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF3FE] hover:bg-[#dbe9fd] border border-[#C7D7F7] text-[11px] font-bold text-[#1E2761] tracking-wide transition-all group cursor-pointer shadow-2xs shrink-0"
          title="Voice & Multilingual AI powered by Sonictra (Opens in new tab)"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F96167] group-hover:rotate-12 transition-transform" />
          <span>
            Voice &amp; Translation:{" "}
            <strong className="text-[#F96167] underline decoration-[#F96167]/30 group-hover:decoration-[#F96167]">
              Sonictra AI
            </strong>
          </span>
          <ExternalLink className="w-3 h-3 text-[#5A6478] group-hover:text-[#1E2761] transition-colors" />
        </a>
      </div>

      {/* Inline Microphone Diagnostic / Permission Warning */}
      {speechError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start justify-between gap-3 animate-fade-in-up">
          <div className="flex items-start gap-2">
            <MicOff className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{speechError}</p>
              <p className="text-[11px] text-red-600">
                <strong>Tip for Brave / Shield users:</strong> In Brave, open <code>brave://settings/privacy</code> and enable <em>"Use Google services for push messaging and speech recognition"</em>, or use the direct audio recorder.
              </p>
            </div>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="text-red-600 hover:text-red-900 font-bold px-1.5 py-0.5 rounded-md hover:bg-red-100 transition-colors cursor-pointer shrink-0"
              title="Dismiss error message"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
