'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mic, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1E1B4B]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              VoicePrep <span className="text-[#10B981]">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="#compare" className="text-sm text-slate-300 hover:text-white transition-colors">Compare</Link>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1E1B4B] border-t border-white/10 px-4 py-4 space-y-3">
          <Link href="#features" className="block text-slate-300 hover:text-white py-2">Features</Link>
          <Link href="#how-it-works" className="block text-slate-300 hover:text-white py-2">How It Works</Link>
          <Link href="#pricing" className="block text-slate-300 hover:text-white py-2">Pricing</Link>
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white">Start Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
