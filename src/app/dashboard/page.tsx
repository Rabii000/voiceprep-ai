'use client'

import Link from 'next/link'
import {
  Mic, Plus, TrendingUp, Calendar, Flame, Clock,
  ChevronRight, BarChart3, Target, BookOpen,
  Repeat2, Zap, Star, Brain, ArrowUpRight, Shield,
} from 'lucide-react'
import { AppShell } from '@/components/AppShell'

const recentSessions = [
  { id: '1', role: 'Senior Product Manager', company: 'Stripe', score: 78, date: 'Jun 15', duration: '30 min', type: 'Behavioral', delta: +6 },
  { id: '2', role: 'Senior Product Manager', company: 'Stripe', score: 65, date: 'Jun 13', duration: '45 min', type: 'Technical', delta: null },
  { id: '3', role: 'Senior Product Manager', company: 'Stripe', score: 71, date: 'Jun 10', duration: '30 min', type: 'Behavioral', delta: +9 },
]

const stats = [
  { label: 'Sessions', value: '12', sub: '+3 this week', icon: Mic, color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20' },
  { label: 'Readiness Score', value: '74', sub: 'Good — target 85+', icon: BarChart3, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/20' },
  { label: 'Streak', value: '5d', sub: 'Personal best: 8d', icon: Flame, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20' },
  { label: 'Time Invested', value: '8.5h', sub: 'Across 12 sessions', icon: Clock, color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/10 dark:bg-[#6366f1]/20' },
]

const quickActions = [
  { label: 'Fluency Coach', icon: BookOpen, href: '/fluency', color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/10' },
  { label: 'Shadow Method', icon: Repeat2, href: '/shadow', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  { label: 'Rapid Drill', icon: Zap, href: '/drill', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  { label: 'Answer Bank', icon: Star, href: '/library', color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/10' },
  { label: 'Countdown', icon: Calendar, href: '/countdown', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
  { label: 'Analytics', icon: TrendingUp, href: '/dashboard', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
]

// Competency radar — the HR framework behind the score
const competencies = [
  { name: 'STAR Structure', score: 82, trend: 'up' },
  { name: 'Quantified Impact', score: 61, trend: 'up' },
  { name: 'Executive Presence', score: 74, trend: 'stable' },
  { name: 'Technical Depth', score: 58, trend: 'down' },
  { name: 'Stakeholder Framing', score: 79, trend: 'up' },
]

function ScoreBadge({ score, delta }: { score: number; delta?: number | null }) {
  const cls = score >= 80
    ? 'bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20'
    : score >= 65
    ? 'bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#F59E0B]/20'
    : 'bg-[#EF4444]/10 text-[#EF4444] dark:bg-[#EF4444]/20'
  return (
    <div className="flex items-center gap-1.5">
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{score}</span>
      {delta != null && delta > 0 && (
        <span className="text-[10px] font-semibold text-[#10B981] flex items-center gap-0.5">
          <ArrowUpRight className="h-2.5 w-2.5" />+{delta}
        </span>
      )}
    </div>
  )
}

function CompetencyBar({ name, score, trend }: { name: string; score: number; trend: string }) {
  const color = score >= 80 ? 'bg-[#10B981]' : score >= 65 ? 'bg-[#4F46E5]' : 'bg-[#F59E0B]'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600 dark:text-slate-400">{name}</span>
        <span className={`text-xs font-bold ${score >= 80 ? 'text-[#10B981]' : score >= 65 ? 'text-slate-900 dark:text-white' : 'text-[#F59E0B]'}`}>{score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-5 lg:p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#4F46E5] uppercase tracking-widest mb-1">Career Command Center</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stripe Final Round — 6 days out</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Your readiness score is 74. The hiring bar at Stripe is typically 80+. Three focused sessions will close the gap.</p>
          </div>
          <Link href="/session">
            <button className="hidden sm:flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              New Session
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">

          {/* Recent sessions */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Session History</h2>
              <Link href="/dashboard" className="text-xs text-[#4F46E5] hover:underline font-medium">Full analysis</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentSessions.map(session => (
                <Link key={session.id} href={`/scorecard/${session.id}`}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E1B4B] dark:bg-[#4F46E5]/20 flex-shrink-0">
                      <Mic className="h-4 w-4 text-white dark:text-[#818cf8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{session.role}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{session.company} · {session.date} · {session.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">{session.type}</span>
                      <ScoreBadge score={session.score} delta={session.delta} />
                      <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </Link>
              ))}
              <div className="sm:hidden px-5 py-4">
                <Link href="/session">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] text-white py-2.5 rounded-xl text-sm font-semibold">
                    <Plus className="h-4 w-4" /> New Session
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Competency breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-[#4F46E5]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Competency Profile</h2>
              </div>
              <div className="space-y-3">
                {competencies.map(c => (
                  <CompetencyBar key={c.name} {...c} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-3">Based on STAR framework + recruiter rubrics</p>
            </div>

            {/* Quick practice */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-[#4F46E5]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Practice Tools</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map(action => (
                  <Link key={action.href + action.label} href={action.href}>
                    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${action.bg}`}>
                        <action.icon className={`h-4 w-4 ${action.color}`} />
                      </div>
                      <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">{action.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Coach intelligence */}
            <div className="rounded-2xl border border-[#4F46E5]/20 bg-gradient-to-br from-[#4F46E5]/5 to-[#10B981]/5 dark:from-[#4F46E5]/10 dark:to-[#10B981]/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-[#4F46E5]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Coach Intelligence</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Your STAR <strong className="text-slate-700 dark:text-slate-300">Result</strong> component scores the weakest across sessions. Stripe interviewers specifically probe for scale — close every story with a number: revenue impact, percentage change, or time saved.
              </p>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 font-medium uppercase tracking-wide">Priority gap · 2 sessions to close</div>
              <Link href="/session">
                <button className="w-full py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors">
                  Target This Gap
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
