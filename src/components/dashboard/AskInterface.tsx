'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Copy, Search, MessageSquare, Download, Check, Sparkles, CornerDownRight, RotateCcw, FileSpreadsheet, ArrowRight, UploadCloud, BarChart3, PieChart as PieIcon, Mic, Trash2, Edit3, X, Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDataSource } from './DashboardShell'
import SonictraVoiceBar, { SUPPORTED_LANGUAGES, LanguageOption } from './SonictraVoiceBar'
import { executeClientSql } from '@/lib/clientSqlEngine'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AskInterface() {
  const { 
    activeSource, 
    prefilledQuestion, 
    setPrefilledQuestion, 
    connections,
    activeUploadedFile,
    openUploadModal
  } = useDataSource()
  
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [followUpQuestion, setFollowUpQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tableCopied, setTableCopied] = useState(false)
  const [downloadingChart, setDownloadingChart] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'donut'>('bar')
  const [mounted, setMounted] = useState(false)

  // Multilingual & Sonictra Voice-to-Text State (Speechnotes Web Speech API)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = React.useRef<any>(null)

  // Google Translation Engine State
  const [translating, setTranslating] = useState(false)
  const [translationNotice, setTranslationNotice] = useState<string | null>(null)
  const [translatedNarration, setTranslatedNarration] = useState<string | null>(null)
  const [translatingNarration, setTranslatingNarration] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [originalSpokenText, setOriginalSpokenText] = useState<string>('')
  const [originalSpokenLang, setOriginalSpokenLang] = useState<string>('')

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0]
  const isRtl = currentLang.dir === 'rtl'

  // Audio Recording (MediaRecorder) State for Brave and Universal Browser Compatibility
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false)
  const [preferAudioRecorder, setPreferAudioRecorder] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeechRec = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
      const hasMediaRec = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'
      setSpeechSupported(hasSpeechRec || hasMediaRec)

      // Detect Brave Browser early: Brave blocks Google's speech recognition endpoint
      const isBrave = (navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function'
      if (isBrave) {
        setPreferAudioRecorder(true)
      }
    }
  }, [])

  // Universal In-Browser Audio Recorder (Brave, Chrome, Safari, Firefox, Edge)
  const startAudioRecording = async (target: 'main' | 'followUp' = 'main') => {
    try {
      setSpeechError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioChunksRef.current = []

      let mimeType = 'audio/webm'
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus'
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4'
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
        setIsRecordingAudio(false)

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        if (audioBlob.size === 0) return

        setIsTranscribingAudio(true)
        try {
          const reader = new FileReader()
          reader.readAsDataURL(audioBlob)
          reader.onloadend = async () => {
            const base64Audio = reader.result as string
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audio: base64Audio,
                mimeType,
                language: selectedLanguage,
              }),
            })
            const data = await res.json()
            if (data.transcript) {
              const isForeign =
                selectedLanguage === 'ar' ||
                /[\u0600-\u06FF]/.test(data.transcript) ||
                (selectedLanguage !== 'en' && selectedLanguage !== 'auto')

              if (isForeign && data.englishTranslation) {
                setOriginalSpokenText(data.transcript)
                setOriginalSpokenLang(data.detectedLanguage || (selectedLanguage === 'ar' ? 'ar' : 'foreign'))
                if (target === 'main') {
                  setQuestion(data.englishTranslation)
                } else {
                  setFollowUpQuestion(data.englishTranslation)
                }
                setTranslationNotice(
                  `Voice audio transcribed (${data.detectedLanguage || 'Original'}) and translated to English. You can edit the question below.`
                )
              } else {
                if (target === 'main') {
                  setQuestion(data.transcript)
                } else {
                  setFollowUpQuestion(data.transcript)
                }
              }
            } else if (data.error) {
              setSpeechError(data.error)
            }
          }
        } catch (e: any) {
          console.error('Audio transcription error:', e)
          setSpeechError('Failed to transcribe audio. Please try again.')
        } finally {
          setIsTranscribingAudio(false)
        }
      }

      recorder.start(250)
      setIsRecordingAudio(true)
      setIsListening(true)
    } catch (err: any) {
      console.error('Direct audio recorder start failed:', err)
      setSpeechError('Microphone permission blocked. Please allow microphone access in your browser address bar.')
      setIsRecordingAudio(false)
      setIsListening(false)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch (e) {}
    }
    setIsRecordingAudio(false)
    setIsListening(false)
  }

  const toggleListening = async (target: 'main' | 'followUp' = 'main') => {
    setSpeechError(null)

    // If currently recording via Audio Recorder, stop it
    if (isRecordingAudio) {
      stopAudioRecording()
      return
    }

    // If currently recording via Web Speech API, stop it
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      setIsListening(false)
      return
    }

    // If Brave browser or preferAudioRecorder is active, directly use audio recorder
    if (preferAudioRecorder) {
      startAudioRecording(target)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      startAudioRecording(target)
      return
    }

    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (permErr: any) {
      if (permErr?.name === 'NotAllowedError' || permErr?.name === 'PermissionDeniedError') {
        setSpeechError("Microphone access was denied. Please click the lock icon in your browser URL bar and allow microphone.")
        return
      }
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      const speechLocale = currentLang.speechCode || (selectedLanguage === 'ar' ? 'ar-SA' : 'en-US')
      recognition.lang = speechLocale
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      let accumulated = ''

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            accumulated += trans + ' '
          } else {
            interim += trans
          }
        }

        const liveText = (accumulated + interim).trim()
        if (!liveText) return

        if (target === 'main') {
          setQuestion(liveText)
        } else {
          setFollowUpQuestion(liveText)
        }
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error)
        if (event.error === 'network') {
          // Brave Browser or privacy shield blocked Google's speech recognition endpoint!
          // Seamlessly switch to the direct Audio Recorder!
          setPreferAudioRecorder(true)
          setIsListening(false)
          startAudioRecording(target)
          return
        } else if (event.error === 'not-allowed') {
          setSpeechError("Microphone permission blocked. Please click the lock or camera icon in your address bar and allow Microphone.")
        } else if (event.error === 'audio-capture') {
          setSpeechError("No microphone found on your device. Please connect a microphone.")
        }
        setIsListening(false)
      }

      recognition.onend = async () => {
        setIsListening(false)
        const recorded = accumulated.trim() || (target === 'main' ? question : followUpQuestion).trim()
        
        const isForeign = selectedLanguage === 'ar' || speechLocale.startsWith('ar') || /[\u0600-\u06FF]/.test(recorded) || (selectedLanguage !== 'en' && selectedLanguage !== 'auto')
        if (recorded && isForeign) {
          setOriginalSpokenText(recorded)
          setOriginalSpokenLang(selectedLanguage === 'ar' || /[\u0600-\u06FF]/.test(recorded) ? 'ar' : selectedLanguage)
          
          try {
            setTranslating(true)
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: recorded,
                targetLang: 'en',
                sourceLang: selectedLanguage === 'auto' ? 'auto' : selectedLanguage,
              }),
            })
            const data = await res.json()
            if (data.translatedText) {
              if (target === 'main') {
                setQuestion(data.translatedText)
              } else {
                setFollowUpQuestion(data.translatedText)
              }
              setTranslationNotice(`Translated to English (editable). Feel free to adjust your question below.`)
            }
          } catch (trErr) {
            console.error("Auto-translate speech error:", trErr)
          } finally {
            setTranslating(false)
          }
        }
      }

      recognition.start()
    } catch (e: any) {
      console.error('Starting speech recognition error, fallback to audio recorder:', e)
      setPreferAudioRecorder(true)
      startAudioRecording(target)
    }
  }

  // Multi-turn conversation thread tracking
  const [conversationThread, setConversationThread] = useState<Array<{
    question: string
    sql: string
    intent?: string
    narration: string
    rowCount: number
    fullResult?: any
  }>>([])

  const followUpInputRef = React.useRef<HTMLInputElement>(null)

  // Branded loader text transition state
  const [loadingText, setLoadingText] = useState("Analyzing your question...")

  // Trigger animations only on new results
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-run if question was passed from History / Favorites
  useEffect(() => {
    if (prefilledQuestion) {
      const q = prefilledQuestion
      setQuestion(q)
      setPrefilledQuestion('')
      executeQuery(q)
    }
  }, [prefilledQuestion])

  // Timer effect for branded loading state messages
  useEffect(() => {
    if (!loading) {
      setLoadingText("Analyzing your question...")
      return
    }

    const timer1 = setTimeout(() => {
      setLoadingText(activeUploadedFile ? "Generating in-memory SQL..." : "Generating SQL...")
    }, 2500)

    const timer2 = setTimeout(() => {
      setLoadingText(activeUploadedFile ? "Querying spreadsheet records..." : "Running query...")
    }, 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [loading, activeUploadedFile])

  // Suggest chips based on whether an uploaded file is active or database
  const getChips = () => {
    if (activeUploadedFile) {
      const cols = activeUploadedFile.columns || []
      const numCol = cols.find(c => /amount|revenue|total|price|cost|sales|value|qty|quantity/i.test(c)) || cols[1] || 'value'
      const catCol = cols.find(c => /dept|department|region|category|status|name|account|type/i.test(c)) || cols[0] || 'category'

      return [
        `Show the first 10 rows from ${activeUploadedFile.tableName}`,
        `What is the total count of records?`,
        `Break down total ${numCol} by ${catCol}`,
        `Which 5 records have the highest ${numCol}?`
      ]
    }

    return [
      'Show me top 10 customers by total revenue',
      'Which sales reps are below 80% of quota this quarter?',
      'How many orders did we have last month by region?',
      'Which products have the highest average order value?'
    ]
  }

  const chips = getChips()

  const followUpChips = [
    'Now filter that to only enterprise accounts',
    'Break that down month-by-month',
    'Show only the top 5 results',
    'Sort from lowest to highest',
    'What is the average and total sum?'
  ]

  const saveQueryToHistory = (q: string, sql: string, intent: string, rowCount: number, sourceName: string) => {
    const historyEntry = {
      id: 'local_' + Date.now(),
      question: q,
      sql,
      intent,
      row_count: rowCount,
      is_favorite: false,
      connection_id: activeSource,
      connection_name: sourceName,
      created_at: new Date().toISOString()
    }

    try {
      const stored = localStorage.getItem('decyra_query_history')
      const arr = stored ? JSON.parse(stored) : []
      arr.unshift(historyEntry)
      localStorage.setItem('decyra_query_history', JSON.stringify(arr.slice(0, 100)))
    } catch (e) {}

    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q,
        sql,
        intent,
        rowCount,
        connectionId: activeSource,
        connectionName: sourceName
      })
    }).catch(err => console.warn('Failed to save to remote history:', err))
  }

  const executeQuery = async (customQ?: string, isFollowUp: boolean = false) => {
    const qToRun = (customQ || (isFollowUp ? followUpQuestion : question)).trim()
    if (!qToRun || loading) return

    setLoading(true)
    setError(null)
    if (!isFollowUp) {
      setResult(null)
      setConversationThread([])
    }

    const previousQuestion = isFollowUp ? (result?.question || question) : undefined
    const previousSql = isFollowUp ? result?.sql : undefined
    const previousIntent = isFollowUp ? result?.intent : undefined

    try {
      if (activeUploadedFile) {
        // 100% Private In-Browser Execution: Only schema is sent to LLM; raw data never leaves user device
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: qToRun,
            language: selectedLanguage,
            isUploadedFile: true,
            schemaOnly: true,
            customSchema: activeUploadedFile.schemaText,
            tableName: activeUploadedFile.tableName,
            previousQuestion,
            previousSql,
            previousIntent,
          })
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || 'Failed to generate query for file.')
        }

        // Execute SQL locally in browser RAM against file records
        const clientExec = await executeClientSql(
          activeUploadedFile.tableName,
          activeUploadedFile.rows,
          json.sql
        )

        if (clientExec.error) {
          throw new Error(clientExec.error)
        }

        const rowCount = clientExec.rowCount
        let narration = ''
        if (rowCount === 0) {
          narration = 'No matching records were found for this query in your file.'
        } else if (rowCount === 1 && Object.keys(clientExec.rows[0]).length === 1) {
          const singleKey = Object.keys(clientExec.rows[0])[0]
          const rawVal = clientExec.rows[0][singleKey]
          const cleanKey = singleKey.replace(/_/g, ' ').replace(/[()*\"]/g, '').trim().toLowerCase()
          const formattedVal = typeof rawVal === 'number' ? rawVal.toLocaleString() : String(rawVal)
          narration = `The total ${cleanKey || 'result'} is ${formattedVal}.`
        } else {
          narration = `Found ${rowCount} ${rowCount === 1 ? 'record' : 'records'} in ${activeUploadedFile.tableName} (${clientExec.executionTimeMs}ms in-browser RAM execution).`
        }

        const fullResult = {
          ...json,
          rows: clientExec.rows,
          rowCount: clientExec.rowCount,
          columns: clientExec.columns,
          narration,
          executionTimeMs: clientExec.executionTimeMs,
          isClientExecution: true,
          question: qToRun,
          isFollowUp,
          previousQuestion
        }

        setResult(fullResult)
        setAnimationKey(prev => prev + 1)
        if (isFollowUp) {
          setFollowUpQuestion('')
        }

        setConversationThread(prev => [
          ...prev,
          {
            question: qToRun,
            sql: json.sql,
            intent: json.intent,
            narration,
            rowCount: clientExec.rowCount,
            fullResult
          }
        ])

        saveQueryToHistory(qToRun, json.sql, json.intent, clientExec.rowCount, activeUploadedFile.name)

      } else {
        // Querying Demo Database or Postgres/Snowflake Connection
        const activeConn = connections?.find((c: any) => c.id === activeSource)
        const activeSourceName = activeSource === 'demo' ? 'Demo Database' : activeConn ? activeConn.name : 'Custom Database'

        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: qToRun,
            language: selectedLanguage,
            dataSource: activeSource,
            connectionId: activeSource,
            previousQuestion,
            previousSql,
            previousIntent,
          })
        })

        const json = await res.json()

        if (res.ok) {
          const fullResult = {
            ...json,
            question: qToRun,
            isFollowUp,
            previousQuestion
          }
          setResult(fullResult)
          setAnimationKey(prev => prev + 1)
          if (isFollowUp) {
            setFollowUpQuestion('')
          }

          setConversationThread(prev => [
            ...prev,
            {
              question: qToRun,
              sql: json.sql,
              intent: json.intent,
              narration: json.narration,
              rowCount: json.rowCount || 0,
              fullResult
            }
          ])

          saveQueryToHistory(qToRun, json.sql, json.intent, json.rowCount || 0, activeSourceName)
        } else {
          if (res.status === 401) {
            router.push('/login')
            return
          }
          
          const errStr = (json.error || '').toLowerCase()
          if (errStr.includes('select') || errStr.includes('forbidden')) {
            setError('I can only answer read-only questions about your data.')
          } else if (json.error === 'AI returned malformed response') {
            setError('I had trouble understanding that question. Try rephrasing it as a question about your data.')
          } else {
            setError(json.error || 'Something went wrong. Please try again.')
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => executeQuery()

  const handleFollowUpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!followUpQuestion.trim() || loading) return
    executeQuery(followUpQuestion, true)
  }

  const handleClear = () => {
    setQuestion('')
    setFollowUpQuestion('')
    setResult(null)
    setError(null)
    setConversationThread([])
  }

  const handleEditQuestion = (q: string) => {
    setFollowUpQuestion(q)
    if (followUpInputRef.current) {
      followUpInputRef.current.focus()
      followUpInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleDeleteQuestion = (indexToDelete: number) => {
    setConversationThread(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete)
      if (updated.length === 0) {
        handleClear()
      } else {
        const latest = updated[updated.length - 1]
        if (latest.fullResult) {
          setResult(latest.fullResult)
          setQuestion(latest.question)
        }
      }
      return updated
    })
  }

  const handleTranslate = async (targetField: 'main' | 'followUp' = 'main') => {
    const textToTranslate = targetField === 'main' ? question : followUpQuestion
    if (!textToTranslate.trim() || translating) return

    setTranslating(true)
    setTranslationNotice(null)

    try {
      const hasArabic = /[\u0600-\u06FF]/.test(textToTranslate)
      const targetLang = hasArabic ? 'en' : (selectedLanguage === 'ar' ? 'ar' : 'en')
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          targetLang,
        }),
      })

      const data = await res.json()
      if (data.translatedText) {
        setOriginalSpokenText(textToTranslate)
        setOriginalSpokenLang(data.detectedSource || (hasArabic ? 'ar' : 'auto'))
        if (targetField === 'main') {
          setQuestion(data.translatedText)
        } else {
          setFollowUpQuestion(data.translatedText)
        }
        setTranslationNotice(
          `Translated to English. You can edit the question below before querying.`
        )
        setTimeout(() => setTranslationNotice(null), 6000)
      }
    } catch (e) {
      console.error('Failed to translate:', e)
    } finally {
      setTranslating(false)
    }
  }

  const handleTranslateNarration = async () => {
    if (!result?.narration || translatingNarration) return
    setTranslatingNarration(true)
    try {
      const targetLang = selectedLanguage === 'ar' ? 'ar' : selectedLanguage !== 'auto' ? selectedLanguage : 'ar'
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: result.narration,
          targetLang,
        }),
      })
      const data = await res.json()
      if (data.translatedText) {
        setTranslatedNarration(data.translatedText)
      }
    } catch (e) {
      console.error('Failed to translate narration:', e)
    } finally {
      setTranslatingNarration(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSV = () => {
    if (!result || !result.rows || result.rows.length === 0) return
    const headers = Object.keys(result.rows[0])
    const csvContent = [
      headers.join(','),
      ...result.rows.map((row: any) =>
        headers
          .map((key) => {
            const val = row[key]
            if (val === null || val === undefined) return '""'
            const escaped = String(val).replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      ),
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `decyra_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyTable = () => {
    if (!result || !result.rows || result.rows.length === 0) return
    const headers = Object.keys(result.rows[0])
    // Tab-separated values for instant paste into Excel / Google Sheets
    const tsvContent = [
      headers.join('\t'),
      ...result.rows.map((row: any) =>
        headers.map((key) => String(row[key] ?? '')).join('\t')
      ),
    ].join('\n')

    navigator.clipboard.writeText(tsvContent)
    setTableCopied(true)
    setTimeout(() => setTableCopied(false), 2000)
  }

  const handleDownloadChart = () => {
    setDownloadingChart(true)
    try {
      const svgEl = document.querySelector('.recharts-wrapper svg') as SVGElement
      if (!svgEl) {
        setDownloadingChart(false)
        return
      }

      const svgData = new XMLSerializer().serializeToString(svgEl)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const blobUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        const bbox = svgEl.getBoundingClientRect()
        const width = bbox.width || 700
        const height = bbox.height || 320
        const scale = 2 // 2x resolution for crisp high-dpi PNG

        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.scale(scale, scale)
          // Solid white background for clean presentation
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          const pngUrl = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = pngUrl
          a.download = `decyra_chart_${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        URL.revokeObjectURL(blobUrl)
        setDownloadingChart(false)
      }
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl)
        setDownloadingChart(false)
      }
      img.src = blobUrl
    } catch (e) {
      console.error('Failed to export chart:', e)
      setDownloadingChart(false)
    }
  }

  const CHART_COLORS = ['#F96167', '#1E2761', '#2A9D8F', '#E76F51', '#457B9D', '#F4A261', '#6C5CE7', '#00B894', '#E84393']

  const isNumeric = (val: any): boolean => {
    if (typeof val === 'number') return !isNaN(val)
    if (typeof val === 'string') {
      const clean = val.replace(/[$,€£%\s,]/g, '').trim()
      return /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(clean) && clean !== ''
    }
    return false
  }

  const cleanNum = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val
    if (typeof val === 'string') {
      const clean = val.replace(/[$,€£%\s,]/g, '').trim()
      const n = parseFloat(clean)
      return isNaN(n) ? 0 : n
    }
    return 0
  }

  const formatNumber = (val: any) => {
    if (val === null || val === undefined) return ''
    if (!isNumeric(val)) return String(val)
    const num = cleanNum(val)
    
    if (num % 1 === 0) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  const getColumnStats = (rows: any[]) => {
    if (!rows || rows.length === 0) return { numericCols: new Set<string>() }
    const numericCols = new Set<string>()
    const firstRow = rows[0]
    for (const key of Object.keys(firstRow)) {
      const allNumeric = rows.every(row => {
        const val = row[key]
        return val === null || val === undefined || isNumeric(val)
      })
      if (allNumeric) {
        numericCols.add(key)
      }
    }
    return { numericCols }
  }

  const columnStats = result ? getColumnStats(result.rows) : { numericCols: new Set<string>() }

  interface ChartConfigResult {
    categoryKey: string
    numericKey: string
    title: string
    chartData: any[]
    isFrequency?: boolean
  }

  const getChartConfig = (rows: any[]): ChartConfigResult | null => {
    if (!rows || rows.length === 0) return null
    const firstRow = rows[0]
    if (!firstRow) return null
    const keys = Object.keys(firstRow)
    if (keys.length === 0) return null

    // 1. Classify columns
    const numericCols: string[] = []
    const categoryCols: string[] = []

    keys.forEach(key => {
      const numericCount = rows.filter(r => isNumeric(r[key])).length
      if (numericCount >= Math.ceil(rows.length * 0.6)) {
        numericCols.push(key)
      } else {
        categoryCols.push(key)
      }
    })

    // Case A: Categorical column + Numeric column
    if (numericCols.length > 0 && categoryCols.length > 0) {
      const catKey = categoryCols[0]
      const numKey = numericCols[0]
      const chartData = rows.slice(0, 30).map(r => ({
        ...r,
        [catKey]: String(r[catKey] ?? 'Unknown'),
        [numKey]: cleanNum(r[numKey])
      }))
      return {
        categoryKey: catKey,
        numericKey: numKey,
        chartData,
        title: `${numKey.replace(/_/g, ' ')} by ${catKey.replace(/_/g, ' ')}`,
        isFrequency: false
      }
    }

    // Case B: Only numeric columns (e.g. metrics summary)
    if (numericCols.length > 0 && categoryCols.length === 0) {
      if (rows.length === 1) {
        const chartData = numericCols.map(col => ({
          metric: col.replace(/_/g, ' '),
          value: cleanNum(rows[0][col])
        }))
        return {
          categoryKey: 'metric',
          numericKey: 'value',
          chartData,
          title: 'Metrics Overview',
          isFrequency: false
        }
      } else {
        const numKey = numericCols[0]
        const chartData = rows.slice(0, 30).map((r, i) => ({
          ...r,
          record: `Item ${i + 1}`,
          [numKey]: cleanNum(r[numKey])
        }))
        return {
          categoryKey: 'record',
          numericKey: numKey,
          chartData,
          title: `${numKey.replace(/_/g, ' ')} across records`,
          isFrequency: false
        }
      }
    }

    // Case C: Pure Text / Categorical columns (like Packing List items/statuses)
    if (categoryCols.length > 0) {
      // Find the best column to group: preference for status, type, category, or column with small distinct set
      let chosenCol = categoryCols[0]
      let bestDistinctCount = 999999

      for (const col of categoryCols) {
        const uniqueVals = new Set(rows.map(r => String(r[col] ?? '').trim()).filter(Boolean))
        if (uniqueVals.size >= 1 && uniqueVals.size <= 25 && uniqueVals.size < bestDistinctCount) {
          chosenCol = col
          bestDistinctCount = uniqueVals.size
        }
      }

      const frequencyMap: Record<string, number> = {}
      rows.forEach(r => {
        const val = String(r[chosenCol] ?? '').trim()
        if (val) {
          frequencyMap[val] = (frequencyMap[val] || 0) + 1
        }
      })

      const entries = Object.entries(frequencyMap)
      if (entries.length > 0) {
        const chartData = entries
          .map(([name, count]) => ({
            category: name,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15)

        const cleanColName = chosenCol.replace(/^__empty_?/, 'column_').replace(/_/g, ' ')
        return {
          categoryKey: 'category',
          numericKey: 'count',
          chartData,
          title: `Distribution of ${cleanColName} (${rows.length} ${rows.length === 1 ? 'record' : 'records'})`,
          isFrequency: true
        }
      }
    }

    return null
  }

  const chartConfig = result ? getChartConfig(result.rows) : null

  const hasLongLabels = (chartConfig && chartConfig.chartData)
    ? chartConfig.chartData.some((row: any) => String(row[chartConfig.categoryKey] || '').length > 6)
    : false

  const showEmptyState = !question.trim() && !loading && !result && !error

  return (
    <div className={`w-full max-w-[900px] mx-auto py-4 px-4 flex flex-col ${showEmptyState ? 'h-[75vh] justify-center items-center' : 'items-center'}`}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .recharts-bar-rectangle {
          fill-opacity: 0.85;
          transition: fill-opacity 0.15s ease;
        }
        .recharts-bar-rectangle:hover {
          fill-opacity: 1 !important;
        }
      `}</style>

      {showEmptyState ? (
        /* ── Centered Empty State ── */
        <div className="w-full max-w-[760px] flex flex-col items-center text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-white border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 shrink-0">
            {activeUploadedFile ? (
              <FileSpreadsheet size={30} className="text-[#F96167]" />
            ) : (
              <MessageSquare size={32} className="text-[#B0B8CC]" />
            )}
          </div>
          
          <h1 
            className="text-[28px] font-bold text-[#1E2761] mb-2 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {activeUploadedFile ? `Query ${activeUploadedFile.name}` : 'Ask Decyra anything'}
          </h1>

          {activeUploadedFile ? (
            <div className="flex items-center gap-2 text-xs text-[#5A6478] mb-6 bg-white border border-[#E5E9F2] px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>In-memory Data Source: <strong>{activeUploadedFile.rowCount.toLocaleString()}</strong> rows</span>
              <span>•</span>
              <span><strong>{activeUploadedFile.columns.length}</strong> columns</span>
              <span>•</span>
              <span className="uppercase font-mono text-[10px] font-semibold text-[#F96167]">{activeUploadedFile.fileType}</span>
            </div>
          ) : (
            <p className="text-[#5A6478] text-sm mb-8 font-medium">
              Select a question below or type your own to query your data.
            </p>
          )}

          {/* Sonictra Multilingual & Voice Bar */}
          <SonictraVoiceBar
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            isListening={isListening}
            onToggleListening={() => toggleListening('main')}
            speechSupported={speechSupported}
            speechError={speechError}
            onDismissError={() => setSpeechError(null)}
            className="w-full mb-3"
          />

          {translationNotice && (
            <div className="text-[11px] font-semibold text-[#1E2761] bg-[#F1F5F9] border border-[#CBD5E1] px-3.5 py-1.5 rounded-full mb-3 inline-flex items-center gap-1.5 animate-fade-in-up">
              <Languages size={13} className="text-[#F96167]" />
              <span>{translationNotice}</span>
            </div>
          )}

          {/* Dual-Language Banner: Original Spoken/Typed Language + English Editable Notification */}
          {originalSpokenText && (
            <div className="w-full mb-3 p-3.5 bg-white border border-[#CBD5E1] rounded-xl shadow-xs text-left animate-fade-in-up">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#1E2761] text-[10px] font-bold uppercase tracking-wider">
                    {originalSpokenLang === 'ar' || /[\u0600-\u06FF]/.test(originalSpokenText) ? 'العربية' : 'Original Speech'}
                  </span>
                  <span className="text-[11px] text-[#5A6478] font-medium hidden sm:inline">
                    Auto-translated to English below (feel free to edit before running):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuestion(originalSpokenText)
                    setOriginalSpokenText('')
                  }}
                  className="text-xs text-[#F96167] hover:underline font-semibold cursor-pointer shrink-0"
                >
                  Use Original
                </button>
              </div>
              <p className="text-sm font-semibold text-[#1E2761] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]" dir={originalSpokenLang === 'ar' || /[\u0600-\u06FF]/.test(originalSpokenText) ? 'rtl' : 'ltr'}>
                "{originalSpokenText}"
              </p>
            </div>
          )}

          {/* Form Input area */}
          <div className="w-full relative mb-8">
            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={activeUploadedFile ? `Ask any question about ${activeUploadedFile.name}...` : (selectedLanguage === 'ar' ? 'اكتب أو تحدث بالعربية (سيتم عرض الترجمة بالإنجليزية تلقائياً لتعديلها)...' : (currentLang.placeholder || 'Ask anything about your data...'))}
                rows={3}
                dir={/[\u0600-\u06FF]/.test(question) ? 'rtl' : 'ltr'}
                className="w-full text-base resize-none focus-visible:ring-[#F96167] bg-white shadow-sm pr-12 rounded-xl"
              />
              {question.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E2761] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  title="Clear question"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 justify-start">
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !question.trim()}
                className="bg-[#F96167] hover:bg-[#e0565b] text-white rounded-[8px] px-6 h-10 font-semibold cursor-pointer"
              >
                Ask Decyra
              </Button>
              {/[\u0600-\u06FF]/.test(question) && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleTranslate('main')}
                  disabled={translating}
                  className="h-10 px-4 text-xs font-semibold text-[#1E2761] border-[#CBD5E1] hover:bg-[#F4F6FB] rounded-[8px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {translating ? <Loader2 size={13} className="animate-spin text-[#F96167]" /> : <Languages size={13} />}
                  <span>Translate to English</span>
                </Button>
              )}
              {question.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="px-4 h-10 text-sm font-semibold text-[#5A6478] hover:text-[#1E2761] hover:bg-black/5 rounded-[8px] transition-colors cursor-pointer"
                >
                  Clear Text
                </button>
              )}
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(chip)}
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 border border-[#E5E9F2] text-[#1E2761] rounded-full bg-white hover:bg-[#F4F6FB] hover:scale-[1.02] active:bg-[#E8EDF7] transition-all duration-150 cursor-pointer shadow-xs font-semibold"
              >
                <Search size={12} className="text-[#5A6478]" />
                {chip}
              </button>
            ))}
          </div>

          {!activeUploadedFile && (
            <button
              onClick={openUploadModal}
              className="mt-7 flex items-center gap-2 text-xs font-semibold text-[#5A6478] hover:text-[#F96167] transition-colors cursor-pointer group"
            >
              <UploadCloud size={15} className="text-[#F96167] group-hover:scale-110 transition-transform" />
              <span>Or <u>Upload a File (CSV, JSON, XML, Excel)</u> to query without a database</span>
            </button>
          )}
        </div>
      ) : (
        /* ── Standard Top-Aligned Query Layout ── */
        <div className="w-full max-w-[760px] flex flex-col items-center mx-auto">
          
          {/* Header section (smaller when active) */}
          <div className="text-center mb-6">
            <div className="text-[10px] font-bold text-[#1E2761] uppercase tracking-widest mb-2">ASK</div>
            <h1 className="text-xl font-serif font-bold text-[#1E2761]">
              {activeUploadedFile ? `Querying ${activeUploadedFile.name}` : 'Querying active source'}
            </h1>
            {activeUploadedFile && (
              <p className="text-xs text-[#5A6478] mt-1 font-mono flex items-center justify-center gap-2">
                <span>{activeUploadedFile.rowCount.toLocaleString()} rows</span>
                <span>•</span>
                <span>{activeUploadedFile.columns.length} columns</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  100% In-Browser RAM • Zero Data Leakage
                </span>
              </p>
            )}
          </div>

          {/* Top Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(chip)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[#E5E9F2] text-[#1E2761] rounded-full bg-white hover:bg-[#F4F6FB] hover:scale-[1.01] active:bg-[#E8EDF7] transition-all duration-150 cursor-pointer shadow-xs font-semibold"
              >
                <Search size={12} className="text-[#5A6478]" />
                {chip}
              </button>
            ))}
          </div>

          {/* Sonictra Multilingual & Voice Bar */}
          <SonictraVoiceBar
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            isListening={isListening}
            onToggleListening={() => toggleListening('main')}
            speechSupported={speechSupported}
            speechError={speechError}
            onDismissError={() => setSpeechError(null)}
            className="w-full mb-3"
          />

          {translationNotice && (
            <div className="text-[11px] font-semibold text-[#1E2761] bg-[#F1F5F9] border border-[#CBD5E1] px-3.5 py-1.5 rounded-full mb-3 inline-flex items-center gap-1.5 animate-fade-in-up">
              <Languages size={13} className="text-[#F96167]" />
              <span>{translationNotice}</span>
            </div>
          )}

          {/* Dual-Language Banner: Original Spoken/Typed Language + English Editable Notification */}
          {originalSpokenText && (
            <div className="w-full mb-3 p-3.5 bg-white border border-[#CBD5E1] rounded-xl shadow-xs text-left animate-fade-in-up">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#1E2761] text-[10px] font-bold uppercase tracking-wider">
                    {originalSpokenLang === 'ar' || /[\u0600-\u06FF]/.test(originalSpokenText) ? 'العربية' : 'Original Speech'}
                  </span>
                  <span className="text-[11px] text-[#5A6478] font-medium hidden sm:inline">
                    Auto-translated to English below (feel free to edit before running):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuestion(originalSpokenText)
                    setOriginalSpokenText('')
                  }}
                  className="text-xs text-[#F96167] hover:underline font-semibold cursor-pointer shrink-0"
                >
                  Use Original
                </button>
              </div>
              <p className="text-sm font-semibold text-[#1E2761] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]" dir={originalSpokenLang === 'ar' || /[\u0600-\u06FF]/.test(originalSpokenText) ? 'rtl' : 'ltr'}>
                "{originalSpokenText}"
              </p>
            </div>
          )}

          {/* Textarea Input area */}
          <div className="w-full mb-8 relative">
            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={selectedLanguage === 'ar' ? 'اكتب أو تحدث بالعربية (سيتم عرض الترجمة بالإنجليزية تلقائياً لتعديلها)...' : (currentLang.placeholder || 'Ask anything about your data...')}
                rows={3}
                dir={/[\u0600-\u06FF]/.test(question) ? 'rtl' : 'ltr'}
                className="w-full text-base resize-none focus-visible:ring-[#F96167] pr-10"
              />
              {question.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E2761] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  title="Clear input text to edit"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 justify-start">
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !question.trim()}
                className="bg-[#F96167] hover:bg-[#e0565b] text-white rounded-[6px] px-6 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Asking...</span>
                  </>
                ) : (
                  "Ask Decyra"
                )}
              </Button>
              {/[\u0600-\u06FF]/.test(question) && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleTranslate('main')}
                  disabled={translating}
                  className="h-10 px-4 text-xs font-semibold text-[#1E2761] border-[#CBD5E1] hover:bg-[#F4F6FB] rounded-[6px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {translating ? <Loader2 size={13} className="animate-spin text-[#F96167]" /> : <Languages size={13} />}
                  <span>Translate to English</span>
                </Button>
              )}
              {question.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="text-[#5A6478] text-sm hover:text-[#1E2761] underline-offset-4 hover:underline cursor-pointer"
                >
                  Clear Text
                </button>
              )}
              <button 
                type="button"
                onClick={handleClear} 
                className="text-rose-600 text-sm hover:text-rose-700 underline-offset-4 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                title="Clear chat & reset"
              >
                <Trash2 size={13} />
                <span>Reset Chat</span>
              </button>
            </div>
          </div>

          {/* Loading Animation Area */}
          {loading && (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] animate-fade-in-up">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F96167] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#F96167]"></span>
              </div>
              <p className="text-sm font-semibold text-[#1E2761] tracking-wide animate-pulse">
                {loadingText}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="w-full">
              <Card className="bg-[#fef2f2] border-0 border-l-[3px] border-l-red-600 rounded-xl p-4 shadow-sm">
                <p className="text-red-800 text-sm">{error}</p>
              </Card>
              <div className="mt-4">
                <Button variant="outline" onClick={handleClear} className="text-[#1E2761]">
                  Try a different question
                </Button>
              </div>
            </div>
          )}

          {result && !loading && (
            <div key={animationKey} className="w-full flex flex-col gap-8">
              
              {/* Follow-up Context Pill */}
              {result.isFollowUp && result.previousQuestion && (
                <div className="flex items-center justify-between bg-white border border-[#E5E9F2] rounded-xl px-4 py-2.5 shadow-2xs animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs text-[#5A6478] overflow-hidden">
                    <Sparkles size={14} className="text-[#F96167] shrink-0" />
                    <span className="shrink-0 font-medium">Refined follow-up to:</span>
                    <span className="font-semibold text-[#1E2761] italic truncate">"{result.previousQuestion}"</span>
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-xs text-[#5A6478] hover:text-[#F96167] flex items-center gap-1 font-medium transition-colors cursor-pointer shrink-0 ml-3"
                  >
                    <RotateCcw size={12} />
                    <span>New Question</span>
                  </button>
                </div>
              )}

              {/* SQL Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">GENERATED SQL</div>
                  {result.isClientExecution && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>100% In-Browser RAM • {result.executionTimeMs}ms • Zero Data Leakage</span>
                    </div>
                  )}
                </div>
                <div className="relative group bg-[#F4F6FB] border-l-[3px] border-l-[#F96167] p-4 rounded-lg">
                  <pre className="font-mono text-sm text-[#1E2761] whitespace-pre-wrap pr-12">{result.sql}</pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1 text-[11px] font-medium shadow-sm cursor-pointer"
                    title="Copy SQL to clipboard"
                  >
                    {copied ? (
                      <span className="text-[#34A853] px-1 font-semibold">Copied!</span>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </section>

              {/* Results Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">RESULTS</div>
                    <span className="text-xs text-[#5A6478] font-medium bg-[#FAFBFC] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full">
                      {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}
                    </span>
                  </div>
                  {result.rowCount > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyTable}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer"
                        title="Copy formatted table for Excel or Google Sheets"
                      >
                        {tableCopied ? (
                          <>
                            <Check size={13} className="text-[#34A853]" />
                            <span className="text-[#34A853] font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Table</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer"
                        title="Download results as a CSV spreadsheet"
                      >
                        <Download size={13} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {result.rowCount === 0 ? (
                  <p className="text-[#5A6478] text-sm italic">No results found.</p>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden w-full">
                    {result.rowCount > 10 && (
                      <div className="bg-[#FAFBFC] px-4 py-2 border-b border-[#E5E9F2] text-xs text-[#5A6478]">
                        Showing first 10 of {result.rowCount} rows
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-[#1E2761] hover:bg-[#1E2761]">
                          <TableRow className="hover:bg-transparent">
                            {Object.keys(result.rows[0]).map((key) => {
                              const isColNumeric = columnStats.numericCols.has(key)
                              return (
                                <TableHead 
                                  key={key} 
                                  className={`text-white text-[11px] font-bold uppercase tracking-[0.05em] px-[12px] py-[10px] ${
                                    isColNumeric ? 'text-right' : 'text-left'
                                  }`}
                                >
                                  {key}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.rows.slice(0, 10).map((row: any, i: number) => (
                            <TableRow key={i} className="border-b border-[#E5E9F2] odd:bg-white even:bg-[#FAFBFC] hover:bg-slate-50/50 transition-colors">
                              {Object.entries(row).map(([key, val]: [string, any], j: number) => {
                                const isColNumeric = columnStats.numericCols.has(key)
                                return (
                                  <TableCell 
                                    key={j} 
                                    className={`px-[12px] py-[10px] text-[#334155] text-sm ${
                                      isColNumeric ? 'text-right' : 'text-left'
                                    }`}
                                  >
                                    {formatNumber(val)}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </section>

              {/* Visualization Section */}
              {mounted && chartConfig && (
                <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">
                        VISUALIZATION
                      </div>
                      <span className="text-[11px] text-[#5A6478] bg-[#FAFBFC] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full font-medium capitalize">
                        {chartConfig.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Chart Type Toggle: Bar vs Donut */}
                      <div className="flex items-center bg-[#F4F6FB] p-0.5 rounded-lg border border-[#E5E9F2]">
                        <button
                          onClick={() => setSelectedChartType('bar')}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                            selectedChartType === 'bar'
                              ? 'bg-white text-[#1E2761] shadow-2xs font-semibold'
                              : 'text-[#5A6478] hover:text-[#1E2761]'
                          }`}
                          title="Bar Chart View"
                        >
                          <BarChart3 size={13} />
                          <span>Bar</span>
                        </button>
                        <button
                          onClick={() => setSelectedChartType('donut')}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                            selectedChartType === 'donut'
                              ? 'bg-white text-[#1E2761] shadow-2xs font-semibold'
                              : 'text-[#5A6478] hover:text-[#1E2761]'
                          }`}
                          title="Donut / Pie Chart View"
                        >
                          <PieIcon size={13} />
                          <span>Donut</span>
                        </button>
                      </div>

                      <button
                        onClick={handleDownloadChart}
                        disabled={downloadingChart}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer disabled:opacity-50"
                        title="Download chart as high-resolution PNG image"
                      >
                        {downloadingChart ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-[#F96167]" />
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} />
                            <span>Download Chart (PNG)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E5E9F2] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] w-full">
                    <ResponsiveContainer width="100%" height={320}>
                      {selectedChartType === 'bar' ? (
                        <BarChart data={chartConfig.chartData} margin={{ top: 10, right: 10, left: 10, bottom: hasLongLabels ? 30 : 10 }}>
                          <CartesianGrid vertical={false} stroke="#F4F6FB" strokeDasharray="3 3" />
                          <XAxis 
                            dataKey={chartConfig.categoryKey}
                            fontSize={11}
                            stroke="#5A6478"
                            tickLine={false}
                            {...(hasLongLabels ? {
                              angle: -35,
                              textAnchor: 'end',
                              height: 60
                            } : {
                              angle: 0,
                              textAnchor: 'middle',
                              height: 30
                            })}
                          />
                          <YAxis 
                            fontSize={11}
                            stroke="#5A6478"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => Number(val).toLocaleString()}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderColor: '#E5E9F2', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(30,39,97,0.08)',
                              fontSize: '12px'
                            }} 
                            formatter={(val) => [Number(val).toLocaleString(), chartConfig.numericKey.replace(/_/g, ' ')]}
                            labelStyle={{ fontWeight: 'bold', color: '#1E2761' }}
                          />
                          <Bar 
                            dataKey={chartConfig.numericKey} 
                            fill="#F96167" 
                            radius={[4, 4, 0, 0]}
                          >
                            {chartConfig.chartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderColor: '#E5E9F2', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(30,39,97,0.08)',
                              fontSize: '12px'
                            }} 
                            formatter={(val, name) => [Number(val).toLocaleString(), String(name)]}
                          />
                          <Pie
                            data={chartConfig.chartData}
                            dataKey={chartConfig.numericKey}
                            nameKey={chartConfig.categoryKey}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={105}
                            paddingAngle={3}
                          >
                            {chartConfig.chartData.map((_, index) => (
                              <Cell key={`donut-cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              {/* Explanation Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">
                    {isRtl ? "التحليل والاستنتاج" : "EXPLANATION"}
                  </div>
                  <button
                    type="button"
                    onClick={handleTranslateNarration}
                    disabled={translatingNarration}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4285F4] hover:text-[#1A73E8] bg-[#EEF4FE] hover:bg-[#D9E7FD] border border-[#C6DCFC] px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                    title="Translate business insight using Google Translate Neural Engine"
                  >
                    {translatingNarration ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-[#4285F4]" />
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <Languages size={12} className="text-[#4285F4]" />
                        <span>{isRtl ? "ترجمة بـ Google" : "Translate (Google)"}</span>
                      </>
                    )}
                  </button>
                </div>
                <Card className="bg-[#FDE2E3] border-0 border-l-[3px] border-l-[#F96167] rounded-xl p-4 shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
                  <p className="text-[#1E2761] text-[15px] leading-relaxed">
                    <span className="font-bold text-[#F96167]">{isRtl ? "الرؤية والتحليل: " : "Insight: "}</span>
                    {translatedNarration || result.narration}
                  </p>
                  {translatedNarration && (
                    <div className="mt-2 text-[10px] text-[#5A6478] flex items-center gap-1.5 font-medium">
                      <Sparkles size={11} className="text-[#4285F4]" />
                      <span>Translated by Google Translate Engine</span>
                      <button
                        type="button"
                        onClick={() => setTranslatedNarration(null)}
                        className="text-xs text-[#4285F4] hover:underline ml-2"
                      >
                        (Show original)
                      </button>
                    </div>
                  )}
                </Card>
              </section>

              {/* Conversational Multi-Turn ("Chat with your Data") Follow-Up Section */}
              <section className="animate-fade-in-up bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#FDE2E3] flex items-center justify-center text-[#F96167]">
                      <Sparkles size={14} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1E2761]">
                      {isRtl ? "تحدث مع بياناتك (سؤال متابعة)" : "Chat with your Data (Ask a follow-up)"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      title={isRtl ? "مسح محادثة الاستعلامات والبدء من جديد" : "Clear conversation and questions"}
                    >
                      <Trash2 size={13} />
                      <span>{isRtl ? "مسح المحادثة" : "Clear Chat"}</span>
                    </button>
                    <span className="text-[11px] font-semibold text-[#5A6478] bg-[#F4F6FB] border border-[#E5E9F2] px-2.5 py-1 rounded-full">
                      {isRtl ? "يحفظ سياق الاستعلام" : "Preserves SQL Context"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#5A6478] mb-4">
                  {isRtl
                    ? "اطرح أسئلة مبنية على النتيجة الحالية. سيتكيف الذكاء الاصطناعي مع الاستعلام السابق تلقائياً."
                    : "Ask questions that build upon your current result. The AI adapts the previous query instead of starting over."}
                </p>

                {/* Quick Follow-up Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {followUpChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFollowUpQuestion(chip)
                        executeQuery(chip, true)
                      }}
                      disabled={loading}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#E5E9F2] bg-[#FAFBFC] text-[#1E2761] hover:border-[#F96167] hover:text-[#F96167] hover:bg-white transition-all cursor-pointer shadow-2xs font-medium disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CornerDownRight size={11} className="text-[#F96167]" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>

                {/* Question Thread List with Edit & Delete */}
                {conversationThread.length > 0 && (
                  <div className="mb-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#475569] mb-1">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={13} className="text-[#F96167]" />
                        <span>{isRtl ? "الأسئلة في هذه المحادثة:" : "Questions in this thread:"}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <RotateCcw size={11} />
                        <span>{isRtl ? "مسح الكل" : "Clear All"}</span>
                      </button>
                    </div>
                    
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {conversationThread.map((item, idx) => (
                        <div 
                          key={idx}
                          className="group flex items-center justify-between gap-3 text-xs bg-white border border-[#E5E9F2] px-3 py-2 rounded-lg hover:border-[#CBD5E1] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] shrink-0">
                              Q{idx + 1}
                            </span>
                            <span className="font-medium text-[#1E2761] truncate" title={item.question}>
                              {item.question}
                            </span>
                            {item.rowCount !== undefined && (
                              <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">
                                ({item.rowCount.toLocaleString()} rows)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Edit Question */}
                            <button
                              type="button"
                              onClick={() => handleEditQuestion(item.question)}
                              className="p-1 text-[#64748B] hover:text-[#1E2761] hover:bg-[#F1F5F9] rounded-md transition-colors cursor-pointer"
                              title={isRtl ? "تعديل السؤال في مربع الإدخال" : "Edit question in input"}
                            >
                              <Edit3 size={13} />
                            </button>
                            {/* Delete Question */}
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(idx)}
                              className="p-1 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title={isRtl ? "حذف هذا السؤال" : "Delete this question"}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Question Form */}
                <form onSubmit={handleFollowUpSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={followUpInputRef}
                      type="text"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      placeholder={isRtl ? "مثلاً: صفِّ النتائج للشركات الكبرى فقط، أو قسمها شهرياً..." : "e.g. Now filter that to only enterprise accounts, or break that down month-by-month..."}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className="w-full h-11 pl-4 pr-24 text-sm bg-[#FAFBFC] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#F96167] focus:bg-white focus:ring-2 focus:ring-[#F96167]/20 shadow-2xs text-[#1E2761] placeholder:text-[#94A3B8]"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {followUpQuestion.trim().length > 0 && (
                        <>
                          {/[\u0600-\u06FF]/.test(followUpQuestion) && (
                            <button
                              type="button"
                              onClick={() => handleTranslate('followUp')}
                              disabled={translating}
                              className="p-1.5 rounded-md text-[#1E2761] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                              title="Translate to English"
                            >
                              {translating ? <Loader2 size={14} className="animate-spin text-[#F96167]" /> : <Languages size={14} />}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setFollowUpQuestion('')}
                            className="p-1 rounded-md text-[#94A3B8] hover:text-[#1E2761] hover:bg-black/5 transition-colors cursor-pointer"
                            title="Clear follow-up input"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => toggleListening('followUp')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isListening
                              ? "bg-rose-500 text-white animate-pulse"
                              : "text-[#5A6478] hover:text-[#F96167] hover:bg-black/5"
                          }`}
                          title="Speak question"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={loading || !followUpQuestion.trim()}
                      className="h-11 px-5 bg-[#F96167] hover:bg-[#e0565b] text-white rounded-xl font-semibold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Refining...</span>
                        </>
                      ) : (
                        <>
                          <span>Ask Follow-up</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </Button>
                    {followUpQuestion.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFollowUpQuestion('')}
                        className="h-11 px-3 text-xs font-semibold text-[#5A6478] hover:text-[#1E2761] transition-colors rounded-xl hover:bg-[#F4F6FB] cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>

                {/* Conversation Thread History Counter */}
                {conversationThread.length > 1 && (
                  <div className="mt-4 pt-3 border-t border-[#E5E9F2] flex items-center justify-between text-xs text-[#5A6478]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F96167]" />
                      <span>Active thread: <strong>{conversationThread.length} queries</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[#F96167] hover:underline font-semibold cursor-pointer"
                    >
                      Start fresh question
                    </button>
                  </div>
                )}
              </section>

            </div>
          )}
        </div>
      )}
    </div>
  )
}
