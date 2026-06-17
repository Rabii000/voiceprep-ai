'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Mic, BarChart3, Plus, Grid3x3, BookOpen, Repeat2,
  Zap, Star, Calendar, Sun, Moon, Monitor, Menu, X,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',      icon: BarChart3, href: '/dashboard' },
  { label: 'New Session',    icon: Plus,      href: '/session' },
  { label: 'Practice Hub',   icon: Grid3x3,   href: '/tools' },
  { label: 'Fluency Coach',  icon: BookOpen,  href: '/fluency' },
  { label: 'Shadow Speaking',icon: Repeat2,   href: '/shadow' },
  { label: 'Quick Drill',    icon: Zap,       href: '/drill' },
  { label: 'Answer Library', icon: Star,      href: '/library' },
  { label: 'Countdown',      icon: Calendar,  href: '/countdown' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
      {([['light', Sun], ['dark', Moon], ['system', Monitor]] as const).map(([value, Icon]) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
            theme === value
              ? 'bg-white dark:bg-slate-600 shadow-sm text-[#4F46E5]'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={value}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-5 mb-2" onClick={onNav}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] shadow-lg shadow-indigo-500/25">
          <Mic className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-bold text-slate-900 dark:text-white">
          VoicePrep <span className="text-[#10B981]">AI</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span>{item.label}</span>
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade nudge */}
      <div className="mx-3 mb-4 rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#10B981]/10 dark:from-[#4F46E5]/20 dark:to-[#10B981]/10 border border-[#4F46E5]/20 p-4">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">Free Plan</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">1 of 2 sessions used</p>
        <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 mb-3">
          <div className="h-full w-1/2 rounded-full bg-[#4F46E5]" />
        </div>
        <Link href="/auth/signup?plan=pro">
          <button className="w-full rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] py-1.5 text-xs font-semibold text-white transition-colors">
            Upgrade to Pro
          </button>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3">
        <span className="text-xs text-slate-400 dark:text-slate-500">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on route change
  const pathname = usePathname()
  useEffect(() => setDrawerOpen(false), [pathname])

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] xl:w-[240px] shrink-0 fixed inset-y-0 left-0 z-30 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111118]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-[#111118] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent onNav={() => setDrawerOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-[220px] xl:ml-[240px]">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-sm px-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5]">
              <Mic className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">VoicePrep <span className="text-[#10B981]">AI</span></span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
