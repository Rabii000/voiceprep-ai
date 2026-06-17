'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f0e1a]/95 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
                <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                <rect x="14" y="6" width="4" height="14" rx="2" fill="white"/>
                <path d="M9 16c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <line x1="16" y1="23" x2="16" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="27" x2="20" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[17px] font-bold text-white tracking-tight">
              VoicePrep<span className="text-[#10B981]"> AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/8 transition-all duration-150"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/8 transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-lg shadow-[#4F46E5]/25 hover:shadow-[#4F46E5]/40"
            >
              Start free →
            </Link>
          </div>

          <button
            className="md:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0f0e1a] border-t border-white/10"
          >
            <div className="px-5 py-4 space-y-1">
              {['Features', 'How It Works', 'Pricing'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block py-2.5 text-slate-300 hover:text-white text-sm rounded-lg px-3 hover:bg-white/8 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2.5">
                <Link href="/auth/login" className="py-2.5 text-sm text-center text-slate-300 border border-white/10 rounded-xl hover:bg-white/8 transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="py-2.5 text-sm text-center font-semibold text-white bg-[#4F46E5] rounded-xl hover:bg-[#4338CA] transition-colors">Start Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
