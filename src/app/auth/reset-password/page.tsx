'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mic, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [done, setDone]         = useState(false)

  // Supabase puts the access_token in the URL hash — need to pick it up
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Session is now active — user can set a new password
      }
    })
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match."); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (done) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
            <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Password updated</h2>
          <p className="text-slate-400">Redirecting you to the dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5]">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            VoicePrep <span className="text-[#10B981]">AI</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Set new password</h1>
          <p className="text-slate-400 mb-8">Choose a strong password for your account.</p>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 px-3 py-2.5 mb-5">
              <AlertCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label className="text-slate-300 mb-1.5 block">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#4F46E5]"
                  minLength={8}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300 mb-1.5 block">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#4F46E5]"
                  minLength={8}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-5 font-semibold"
            >
              {loading ? 'Saving...' : 'Update Password'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
