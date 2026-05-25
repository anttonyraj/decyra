'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Loader2, LucideIcon } from 'lucide-react'

interface ComingSoonModalProps {
  name: string
  icon: LucideIcon
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({
  name,
  icon: Icon,
  isOpen,
  onClose,
}: ComingSoonModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, connector: name }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-[420px] p-8 text-center flex flex-col items-center">
        
        {/* Top Center Icon */}
        <div className="w-16 h-16 rounded-full bg-[#F4F6FB] flex items-center justify-center mb-2">
          <Icon className="w-8 h-8 text-[#B0B8CC]" />
        </div>

        <DialogHeader className="text-center sm:text-center w-full space-y-1">
          <DialogTitle 
            className="text-[20px] font-bold text-[#1E2761] text-center w-full"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {name} Integration
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5A6478] text-center w-full">
            {success 
              ? `Thanks! We'll let you know when ${name} is ready.`
              : `We're building the ${name} connector right now. Enter your email and we'll notify you when it's ready.`
            }
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 w-full animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <Button 
              onClick={handleClose}
              className="w-full bg-[#1E2761] hover:bg-[#2b3882] text-white h-11"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#E5E9F2] px-3.5 py-2.5 text-sm placeholder:text-[#B0B8CC] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7] outline-none transition-all duration-150"
            />

            {error && (
              <p className="text-xs text-red-600 font-medium text-left">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#F96167] hover:bg-[#e0565b] text-white h-11 border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Notify Me'
              )}
            </Button>

            <span className="text-[11px] text-[#5A6478] mt-2 font-medium italic">
              Expected: Q3 2026
            </span>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
