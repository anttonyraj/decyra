'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

interface ConnectSnowflakeModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess: () => void
}

export default function ConnectSnowflakeModal({
  isOpen,
  onClose,
  onSaveSuccess,
}: ConnectSnowflakeModalProps) {
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [warehouse, setWarehouse] = useState('')
  const [databaseName, setDatabaseName] = useState('')
  const [schemaName, setSchemaName] = useState('PUBLIC')
  const [role, setRole] = useState('')

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !account || !username || !password || !warehouse || !databaseName) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setTesting(true)
    setErrorMessage(null)
    setTestResult(null)

    try {
      const res = await fetch('/api/connections/test-snowflake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account,
          username,
          password,
          warehouse,
          databaseName,
          schemaName,
          role: role || undefined
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Connection successful! Introspected ${data.tableCount} tables.`,
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Connection test failed. Please check your credentials.',
        })
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'An unexpected error occurred.',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!testResult?.success) return

    setSaving(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/connections/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          connectionType: 'snowflake',
          account,
          username,
          password,
          warehouse,
          databaseName,
          schemaName,
          role: role || undefined
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onSaveSuccess()
        handleClose()
      } else {
        setErrorMessage(data.error || 'Failed to save connection.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save connection.')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setName('')
    setAccount('')
    setUsername('')
    setPassword('')
    setWarehouse('')
    setDatabaseName('')
    setSchemaName('PUBLIC')
    setRole('')
    setTestResult(null)
    setErrorMessage(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-[480px] p-8 max-[480px]:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle 
            className="text-[20px] font-bold text-[#1E2761]" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Connect Snowflake Data Warehouse
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5A6478]">
            Enter your Snowflake credentials. Decyra uses read-only access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTest} className="flex flex-col gap-4 mt-2">
          {/* Connection Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1A1F36]">
              Connection Name <span className="text-[#F96167]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. My Snowflake DW"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setTestResult(null)
              }}
              className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150"
            />
          </div>

          {/* Account Identifier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1A1F36]">
              Account Identifier <span className="text-[#F96167]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="xy12345.us-east-1"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value)
                setTestResult(null)
              }}
              className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150"
            />
            <span className="text-[11px] text-[#5A6478]">
              Found in your Snowflake URL: https://&lt;account&gt;.snowflakecomputing.com
            </span>
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1A1F36]">
                Username <span className="text-[#F96167]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ANALYST_USER"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setTestResult(null)
                }}
                className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150 w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1A1F36]">
                Password <span className="text-[#F96167]">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setTestResult(null)
                }}
                className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150 w-full"
              />
            </div>
          </div>

          {/* Warehouse */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1A1F36]">
              Warehouse <span className="text-[#F96167]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="COMPUTE_WH"
              value={warehouse}
              onChange={(e) => {
                setWarehouse(e.target.value)
                setTestResult(null)
              }}
              className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150"
            />
            <span className="text-[11px] text-[#5A6478]">
              The virtual warehouse to use for executing queries.
            </span>
          </div>

          {/* Database & Schema */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1A1F36]">
                Database <span className="text-[#F96167]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="MY_DATABASE"
                value={databaseName}
                onChange={(e) => {
                  setDatabaseName(e.target.value)
                  setTestResult(null)
                }}
                className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150 w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1A1F36]">
                Schema
              </label>
              <input
                type="text"
                placeholder="PUBLIC"
                value={schemaName}
                onChange={(e) => {
                  setSchemaName(e.target.value)
                  setTestResult(null)
                }}
                className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150 w-full"
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1A1F36]">
              Role <span className="text-xs text-[#5A6478] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="ANALYST"
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                setTestResult(null)
              }}
              className="rounded-lg border border-[#E5E9F2] px-3.5 py-2 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150"
            />
            <span className="text-[11px] text-[#5A6478]">
              Leave blank to use your default Snowflake role.
            </span>
          </div>

          {/* Status & Error Display */}
          {testResult && (
            <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs font-medium leading-normal ${
              testResult.success 
                ? 'bg-green-50/70 border-green-200 text-green-800' 
                : 'bg-red-50/70 border-red-200 text-red-800'
            }`}>
              {testResult.success ? (
                <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50/70 border border-red-200 text-red-800 p-3 rounded-lg flex items-start gap-2.5 text-xs font-medium leading-normal">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <DialogFooter className="flex gap-3 mt-4 flex-col sm:flex-row w-full">
            <Button
              type="submit"
              disabled={testing || saving}
              variant="outline"
              className="flex-1 border-[#1E2761] text-[#1E2761] hover:bg-[#F4F6FB] h-11"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>

            <Button
              type="button"
              disabled={saving || !testResult?.success}
              onClick={handleSave}
              className="flex-1 bg-[#F96167] hover:bg-[#e0565b] text-white h-11 border-0"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Connection'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
