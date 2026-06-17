'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard, Users, BarChart3, Settings, Shield,
  Sun, Moon, Monitor, Menu, X, ChevronRight, Mic,
  ExternalLink, Bell,
} from 'lucide-react'

const NAV = [
  { label: 'Overview',       icon: LayoutDashboard, href: '/admin' },
  { label: 'Users',          icon: Users,            href: '/admin/users' },
  { label: 'Analytics',      icon: BarChart3,        href: '/admin/analytics' },
  { label: 'Settings',       icon: Settings,         href: '/admin/settings' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-7 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
      {([['light', Sun], ['dark', Moon], ['system', Monitor]] as const).map(([value, Icon]) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
            theme === value
              ? 'bg-white dark:bg-slate-600 shadow-sm text-rose-600'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          aria-label={value}
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
      <div className="px-4 py-5 mb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/admin" onClick={onNav} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 shadow-lg shadow-rose-600/25">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">VoicePrep AI</p>
            <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-widest">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span>{item.label}</span>
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Mic className="h-4 w-4 text-slate-400" />
            <span>Back to App</span>
            <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3">
        <span className="text-xs text-slate-400 dark:text-slate-500">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setDrawerOpen(false), [pathname])
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

      {/* Mobile overlay */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-[#111118] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-4 w-4" />
        </button>
        <SidebarContent onNav={() => setDrawerOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-[220px] xl:ml-[240px]">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-sm px-4">
          <button onClick={() => setDrawerOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
              <Bell className="h-4 w-4" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-20 h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-sm px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-600" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
              <Bell className="h-4 w-4" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Back to App
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
