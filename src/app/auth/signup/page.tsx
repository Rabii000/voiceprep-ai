'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mic, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Supabase auth
    setTimeout(() => setLoading(false), 1000)
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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 mb-8">Start practicing smarter. First 2 sessions are free.</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label className="text-slate-300 mb-1.5 block">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#4F46E5]"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300 mb-1.5 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#4F46E5]"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300 mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
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
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            By creating an account you agree to our{' '}
            <a href="#" className="text-[#4F46E5] hover:underline">Terms</a> and{' '}
            <a href="#" className="text-[#4F46E5] hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#4F46E5] hover:text-[#6366f1] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
