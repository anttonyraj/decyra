'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText, Check, AlertCircle, Loader2, X, Table, FileSpreadsheet } from 'lucide-react'
import { parseUploadedFile, ParsedFileResult } from '@/lib/fileParser'

interface UploadFileModalProps {
  isOpen: boolean
  onClose: () => void
  onFileAdded: (fileData: ParsedFileResult) => void
}

export default function UploadFileModal({
  isOpen,
  onClose,
  onFileAdded,
}: UploadFileModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedPreview, setParsedPreview] = useState<ParsedFileResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = async (file: File) => {
    setError(null)
    setLoading(true)
    try {
      const result = await parseUploadedFile(file)
      setParsedPreview(result)
    } catch (err: any) {
      setError(err.message || 'Failed to parse file. Please verify format.')
      setParsedPreview(null)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (!parsedPreview) return
    onFileAdded(parsedPreview)
    onClose()
    setParsedPreview(null)
    setError(null)
  }

  const handleReset = () => {
    setParsedPreview(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-[#E5E9F2] shadow-2xl w-full max-w-[580px] p-6 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#5A6478] hover:text-[#1E2761] rounded-lg hover:bg-[#F4F6FB] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#F96167]" />
            <span className="font-serif font-bold text-[#1E2761] text-base">
              Upload File Data Source
            </span>
          </div>
          <p className="text-xs text-[#5A6478]">
            Upload a spreadsheet or structured file to query instantly with plain English.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {!parsedPreview ? (
          /* Dropzone */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center ${
              dragActive
                ? 'border-[#F96167] bg-[#FDE2E3]/20'
                : 'border-[#CBD5E1] hover:border-[#1E2761] bg-[#FAFBFC]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.json,.xml,.xlsx,.xls"
              className="hidden"
              onChange={handleChange}
            />

            {loading ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 size={32} className="text-[#F96167] animate-spin mb-3" />
                <p className="text-sm font-semibold text-[#1E2761]">Analyzing columns & structure...</p>
                <p className="text-xs text-[#5A6478] mt-1">Reading data rows and inferring types</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#E5E9F2] flex items-center justify-center mb-3 text-[#1E2761]">
                  <Upload size={22} className="text-[#F96167]" />
                </div>
                <p className="text-sm font-semibold text-[#1E2761]">
                  Click to browse or drag & drop file
                </p>
                <p className="text-xs text-[#5A6478] mt-1">
                  Supports CSV, Excel (.xlsx, .xls), JSON, and XML up to 25MB
                </p>
                <div className="flex items-center gap-2 mt-4 text-[11px] font-medium text-[#5A6478]">
                  <span className="bg-white border border-[#E5E9F2] px-2 py-0.5 rounded shadow-xs">.CSV</span>
                  <span className="bg-white border border-[#E5E9F2] px-2 py-0.5 rounded shadow-xs">.XLSX</span>
                  <span className="bg-white border border-[#E5E9F2] px-2 py-0.5 rounded shadow-xs">.JSON</span>
                  <span className="bg-white border border-[#E5E9F2] px-2 py-0.5 rounded shadow-xs">.XML</span>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Preview of parsed file */
          <div className="flex flex-col gap-4">
            <div className="bg-[#F4F6FB] rounded-xl p-4 border border-[#E5E9F2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E9F2] flex items-center justify-center text-[#F96167] shadow-xs">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E2761]">{parsedPreview.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5A6478]">
                    <span>Format: <strong>{parsedPreview.fileType}</strong></span>
                    <span>•</span>
                    <span><strong>{parsedPreview.rowCount.toLocaleString()}</strong> rows</span>
                    <span>•</span>
                    <span><strong>{parsedPreview.columns.length}</strong> columns</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-[#5A6478] hover:text-[#F96167] underline underline-offset-2 cursor-pointer"
              >
                Change file
              </button>
            </div>

            {/* Detected Columns */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-2">
                Detected Columns ({parsedPreview.columns.length})
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {parsedPreview.columns.map(col => (
                  <span
                    key={col}
                    className="text-xs bg-white border border-[#E5E9F2] text-[#1E2761] px-2.5 py-1 rounded-md font-mono shadow-2xs"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Preview Table */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-2">
                Data Preview (First 3 Rows)
              </p>
              <div className="bg-white border border-[#E5E9F2] rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#1E2761] text-white text-[10px] uppercase font-bold">
                    <tr>
                      {parsedPreview.columns.slice(0, 5).map(c => (
                        <th key={c} className="px-3 py-2">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPreview.rows.slice(0, 3).map((r, i) => (
                      <tr key={i} className="border-b border-[#E5E9F2] odd:bg-white even:bg-[#FAFBFC]">
                        {parsedPreview.columns.slice(0, 5).map(c => (
                          <td key={c} className="px-3 py-1.5 text-[#334155] font-mono text-[11px]">
                            {String(r[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9F2]">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-[#5A6478] hover:text-[#1E2761] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-[#F96167] text-white hover:bg-[#e8535a] transition-all text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>Add Data Source & Start Querying</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
