"use client";

import React, { useState } from "react";
import { Mic, MicOff, Globe, Sparkles, ExternalLink, Languages, Loader2, ChevronDown, Check } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  speechCode: string;
  placeholder?: string;
}

// 1. Primary most-spoken worldwide languages as quick-select pills
export const PRIMARY_LANGUAGES: LanguageOption[] = [
  { code: "auto", name: "Auto", native: "Auto", dir: "ltr", speechCode: "en-US" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl", speechCode: "ar-SA" },
  { code: "en", name: "English", native: "English", dir: "ltr", speechCode: "en-US" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", speechCode: "es-ES" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", speechCode: "fr-FR" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", speechCode: "hi-IN" },
  { code: "zh", name: "Chinese", native: "中文", dir: "ltr", speechCode: "zh-CN" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", speechCode: "de-DE" },
];

// 2. Comprehensive worldwide languages (selectable/typeable)
export const ALL_WORLD_LANGUAGES: LanguageOption[] = [
  { code: "auto", name: "Auto-Detect", native: "تلقائي (Auto)", dir: "ltr", speechCode: "en-US" },
  { code: "ar", name: "Arabic", native: "العربية (Arabic)", dir: "rtl", speechCode: "ar-SA" },
  { code: "en", name: "English (US/UK)", native: "English", dir: "ltr", speechCode: "en-US" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", speechCode: "es-ES" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", speechCode: "fr-FR" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", speechCode: "hi-IN" },
  { code: "zh", name: "Chinese (Mandarin)", native: "中文", dir: "ltr", speechCode: "zh-CN" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", speechCode: "de-DE" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr", speechCode: "ja-JP" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr", speechCode: "pt-BR" },
  { code: "ru", name: "Russian", native: "Русский", dir: "ltr", speechCode: "ru-RU" },
  { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr", speechCode: "bn-BD" },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl", speechCode: "ur-PK" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", speechCode: "id-ID" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr", speechCode: "tr-TR" },
  { code: "ko", name: "Korean", native: "한국어", dir: "ltr", speechCode: "ko-KR" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr", speechCode: "it-IT" },
  { code: "fa", name: "Persian", native: "فارسی", dir: "rtl", speechCode: "fa-IR" },
  { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr", speechCode: "nl-NL" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr", speechCode: "vi-VN" },
  { code: "pl", name: "Polish", native: "Polski", dir: "ltr", speechCode: "pl-PL" },
  { code: "th", name: "Thai", native: "ไทย", dir: "ltr", speechCode: "th-TH" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", dir: "ltr", speechCode: "ms-MY" },
  { code: "te", name: "Telugu", native: "తెలుగు", dir: "ltr", speechCode: "te-IN" },
  { code: "ta", name: "Tamil", native: "தமிழ்", dir: "ltr", speechCode: "ta-IN" },
  { code: "mr", name: "Marathi", native: "मराठी", dir: "ltr", speechCode: "mr-IN" },
  { code: "sw", name: "Swahili", native: "Kiswahili", dir: "ltr", speechCode: "sw-KE" },
  { code: "tl", name: "Tagalog", native: "Filipino", dir: "ltr", speechCode: "tl-PH" },
  { code: "he", name: "Hebrew", native: "עברית", dir: "rtl", speechCode: "he-IL" },
  { code: "el", name: "Greek", native: "Ελληνικά", dir: "ltr", speechCode: "el-GR" },
  { code: "sv", name: "Swedish", native: "Svenska", dir: "ltr", speechCode: "sv-SE" },
  { code: "cs", name: "Czech", native: "Čeština", dir: "ltr", speechCode: "cs-CZ" },
  { code: "ro", name: "Romanian", native: "Română", dir: "ltr", speechCode: "ro-RO" },
  { code: "hu", name: "Hungarian", native: "Magyar", dir: "ltr", speechCode: "hu-HU" },
  { code: "da", name: "Danish", native: "Dansk", dir: "ltr", speechCode: "da-DK" },
  { code: "fi", name: "Finnish", native: "Suomi", dir: "ltr", speechCode: "fi-FI" },
  { code: "no", name: "Norwegian", native: "Norsk", dir: "ltr", speechCode: "no-NO" },
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
  const activeLang =
    ALL_WORLD_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    ALL_WORLD_LANGUAGES[0];

  const isPrimary = PRIMARY_LANGUAGES.some((p) => p.code === selectedLanguage);

  return (
    <div className={`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3 shadow-2xs ${className}`}>
      {/* Row 1: Language Quick Selector & Sonictra Link */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[#E2E8F0]/70">
        {/* Left: Language Label + Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#1E2761] mr-1">
            <Globe className="w-3.5 h-3.5 text-[#F96167]" />
            <span className="text-[11px] uppercase tracking-wider text-[#5A6478]">Language:</span>
          </div>

          {/* Quick Popular Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {PRIMARY_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "bg-[#1E2761] text-white shadow-xs"
                      : "bg-white text-[#475569] border border-[#CBD5E1] hover:border-[#1E2761] hover:text-[#1E2761]"
                  }`}
                >
                  {lang.native}
                </button>
              );
            })}

            {/* Comprehensive Select Dropdown for 40+ More Languages */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className={`text-xs font-semibold rounded-lg px-2.5 py-1 pr-6 border cursor-pointer transition-all appearance-none shadow-2xs ${
                  !isPrimary
                    ? "bg-[#1E2761] text-white border-[#1E2761]"
                    : "bg-white text-[#475569] border-[#CBD5E1] hover:border-[#1E2761]"
                }`}
                title="Select from 40+ worldwide languages"
              >
                <option value="" disabled>
                  More Languages...
                </option>
                {ALL_WORLD_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3 h-3 absolute right-2 pointer-events-none ${!isPrimary ? "text-white" : "text-[#5A6478]"}`} />
            </div>
          </div>
        </div>

        {/* Right: Embedded Link to Sonictra.com */}
        <a
          href="https://www.sonictra.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FE] hover:bg-[#dbe9fd] border border-[#C7D7F7] text-[10px] font-bold text-[#1E2761] tracking-wide transition-all group cursor-pointer shadow-2xs shrink-0"
          title="Voice & Multilingual AI powered by Sonictra (Opens in new tab)"
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

      {/* Row 2: Speech Dictation & Google Translation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Microphone Dictation Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-2 ring-rose-300"
                : "bg-white text-[#1E2761] border border-[#CBD5E1] hover:border-[#F96167] hover:text-[#F96167] hover:bg-[#FFF5F5]"
            }`}
            title={isListening ? "Click to stop recording" : `Click to speak in ${activeLang.native}`}
          >
            {isListening ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <Mic className="w-4 h-4" />
                <span>Listening ({activeLang.native})... Click to finish</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-[#F96167]" />
                <span>Speak Question ({activeLang.native})</span>
              </>
            )}
          </button>

          {/* Quick Google Translate Button */}
          {onGoogleTranslate && hasTextToTranslate && (
            <button
              type="button"
              onClick={onGoogleTranslate}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#CBD5E1] text-[#1E2761] hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-[#EEF4FE] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Translate to English using Google Translate Neural Engine"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4285F4]" />
                  <span>Translating with Google...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span>Translate to English (Google)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Selected Language Indicator */}
        <div className="text-[11px] text-[#5A6478] font-medium hidden sm:flex items-center gap-1">
          <span>Active:</span>
          <strong className="text-[#1E2761] font-semibold">{activeLang.native}</strong>
          {activeLang.code === "ar" && (
            <span className="text-[10px] text-[#F96167] font-semibold bg-rose-50 px-1.5 py-0.5 rounded-sm ml-1">
              Auto-English translation enabled
            </span>
          )}
        </div>
      </div>

      {/* Inline Microphone Diagnostic / Permission Warning */}
      {speechError && (
        <div className="mt-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start justify-between gap-3 animate-fade-in-up">
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
