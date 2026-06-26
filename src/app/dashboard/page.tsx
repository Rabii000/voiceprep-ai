'use client'

import Link from 'next/link'
import {
  Mic, Plus, TrendingUp, Calendar, Flame, Clock,
  ChevronRight, BarChart3, Target, BookOpen,
  Repeat2, Zap, Star, Brain, ArrowUpRight, Shield,
  CheckCircle2, Circle, Download, AlertCircle,
} from 'lucide-react'
import { AppShell } from '@/components/AppShell'

// ─── Static data ──────────────────────────────────────────────────────────────

const recentSessions = [
  { id: '1', role: 'Work Coach', company: 'DWP', score: 78, date: 'Jun 24', duration: '30 min', type: 'Behavioural', delta: +6 },
  { id: '2', role: 'Case Manager', company: 'DWP', score: 65, date: 'Jun 22', duration: '45 min', type: 'Behavioural', delta: null },
  { id: '3', role: 'Work Coach', company: 'DWP', score: 71, date: 'Jun 20', duration: '30 min', type: 'Strengths', delta: +9 },
]

const stats = [
  { label: 'Sessions', value: '12', sub: '+3 this week', icon: Mic, color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20' },
  { label: 'Readiness Score', value: '74', sub: 'Good — target 80+', icon: BarChart3, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/20' },
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

const competencies = [
  { name: 'STAR Structure', score: 82, trend: 'up' },
  { name: 'Communicating & Influencing', score: 74, trend: 'up' },
  { name: 'Working Together', score: 79, trend: 'stable' },
  { name: 'Making Effective Decisions', score: 61, trend: 'up' },
  { name: 'Managing Quality Service', score: 68, trend: 'up' },
]

// ─── Study plan ───────────────────────────────────────────────────────────────

const TODAY = new Date('2026-06-26')
const WC_INTERVIEW = new Date('2026-07-09')
const CM_INTERVIEW = new Date('2026-07-15')

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

const daysToWC = daysBetween(TODAY, WC_INTERVIEW)
const daysToCM = daysBetween(TODAY, CM_INTERVIEW)

interface PlanDay {
  date: string
  label: string
  focus: string
  type: 'wc' | 'cm' | 'interview' | 'bridge'
  done: boolean
}

const PLAN: PlanDay[] = [
  // Work Coach phase
  { date: 'Jun 26', label: 'Day 1', focus: 'Upload Work Coach prep — read all answers in Full Script mode', type: 'wc', done: false },
  { date: 'Jun 27', label: 'Day 2', focus: 'Fluency Coach: Work Coach — Full Script × 2 run-throughs', type: 'wc', done: false },
  { date: 'Jun 28', label: 'Day 3', focus: 'Fluency Coach: Work Coach — Keywords mode. Shadow recording × 1', type: 'wc', done: false },
  { date: 'Jun 29', label: 'Day 4', focus: 'Full timed mock: 3 behaviours + 2 strengths, no notes. Self-rate each', type: 'wc', done: false },
  { date: 'Jun 30', label: 'Day 5', focus: 'Weak answers only — Memory mode. Focus on quantified outcomes', type: 'wc', done: false },
  { date: 'Jul 1',  label: 'Day 6', focus: 'Fluency Coach: Work Coach — all 6 in Memory mode. Drill until smooth', type: 'wc', done: false },
  { date: 'Jul 2',  label: 'Day 7', focus: 'Rest + light review. Read the job description out loud. Visualise the room', type: 'wc', done: false },
  { date: 'Jul 3',  label: 'Day 8', focus: 'Cold delivery from memory — record yourself and play back each answer', type: 'wc', done: false },
  { date: 'Jul 4',  label: 'Day 9', focus: 'Upload Case Manager prep — begin Full Script familiarisation session', type: 'bridge', done: false },
  { date: 'Jul 5',  label: 'Day 10', focus: 'Work Coach: final full mock. Case Manager: Full Script first pass', type: 'wc', done: false },
  { date: 'Jul 6',  label: 'Day 11', focus: 'Work Coach: polish Strengths answers — natural tone, no STAR format', type: 'wc', done: false },
  { date: 'Jul 7',  label: 'Day 12', focus: 'Rest day. Confidence review: list 3 things you do well for this role', type: 'wc', done: false },
  { date: 'Jul 8',  label: 'Day 13', focus: 'Light morning run-through only. Plan logistics. Rest and sleep well', type: 'wc', done: false },
  { date: 'Jul 9',  label: '🎯 INTERVIEW', focus: 'DWP Work Coach Interview — EO Level. You are ready.', type: 'interview', done: false },
  { date: 'Jul 10', label: 'Day 15', focus: 'Case Manager: Keywords mode — Communicating & Influencing + Decisions', type: 'cm', done: false },
  { date: 'Jul 11', label: 'Day 16', focus: 'Case Manager: Memory mode all 6 answers. Record and play back', type: 'cm', done: false },
  { date: 'Jul 12', label: 'Day 17', focus: 'Full timed mock: 3 behaviours + 2 strengths. Self-rate honestly', type: 'cm', done: false },
  { date: 'Jul 13', label: 'Day 18', focus: 'Weak answers only — polish until confident. Access to Work context', type: 'cm', done: false },
  { date: 'Jul 14', label: 'Day 19', focus: 'Light morning run-through. Rest and sleep well', type: 'cm', done: false },
  { date: 'Jul 15', label: '🎯 INTERVIEW', focus: 'DWP Case Manager (Access to Work) Interview — EO Level. You are ready.', type: 'interview', done: false },
]

function StudyPlan() {
  const todayIdx = PLAN.findIndex(d => d.date === 'Jun 26')
  const wcPct = Math.max(0, Math.min(100, Math.round(((13 - daysToWC) / 13) * 100)))

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Mastery Study Plan</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {daysToWC} days to Work Coach · {daysToCM} days to Case Manager
            </p>
          </div>
          <div className="flex gap-2 text-[10px] font-semibold">
            <span className="flex items-center gap-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />Work Coach Jul 9
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#10B981]/10 text-[#10B981] px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />Case Mgr Jul 15
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#10B981] rounded-full transition-all" style={{ width: `${wcPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 mt-1">
          <span>Jun 26</span><span>Jul 9 — WC</span><span>Jul 15 — CM</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
        {PLAN.map((day, i) => (
          <div
            key={day.date}
            className={`flex items-start gap-3 px-5 py-3 ${
              day.type === 'interview'
                ? 'bg-gradient-to-r from-[#4F46E5]/5 to-transparent dark:from-[#4F46E5]/10'
                : i === todayIdx
                ? 'bg-[#F59E0B]/5 dark:bg-[#F59E0B]/5'
                : ''
            }`}
          >
            {day.type === 'interview' ? (
              <AlertCircle className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
            ) : day.done ? (
              <CheckCircle2 className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${i === todayIdx ? 'text-[#F59E0B]' : 'text-slate-200 dark:text-slate-700'}`} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  day.type === 'interview' ? 'text-[#4F46E5]' :
                  day.type === 'cm' ? 'text-[#10B981]' :
                  day.type === 'bridge' ? 'text-[#F59E0B]' :
                  i === todayIdx ? 'text-[#F59E0B]' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {day.date}
                </span>
                {i === todayIdx && (
                  <span className="rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] font-bold px-1.5 py-0.5">TODAY</span>
                )}
              </div>
              <p className={`text-xs ${day.type === 'interview' ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {day.focus}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Download prep files */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-medium uppercase tracking-widest">Prep Files — Upload to Fluency Coach</p>
        <div className="flex gap-2">
          <a
            href="/prep/work-coach-prep.txt"
            download
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#4F46E5]/30 bg-[#4F46E5]/5 text-[#4F46E5] text-xs font-semibold py-2 hover:bg-[#4F46E5]/10 transition-colors"
          >
            <Download className="h-3 w-3" /> Work Coach
          </a>
          <a
            href="/prep/case-manager-prep.txt"
            download
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#10B981]/30 bg-[#10B981]/5 text-[#10B981] text-xs font-semibold py-2 hover:bg-[#10B981]/10 transition-colors"
          >
            <Download className="h-3 w-3" /> Case Manager
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function CompetencyBar({ name, score }: { name: string; score: number }) {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-5 lg:p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#4F46E5] uppercase tracking-widest mb-1">Career Command Center</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DWP Interviews — {daysToWC} days to go</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Work Coach (Jul 9) · Case Manager (Jul 15). Your readiness is 74 — three focused sessions will close the gap to the Civil Service hiring bar.
            </p>
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
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Session History</h2>
                <Link href="/dashboard" className="text-xs text-[#4F46E5] hover:underline font-medium">Full analysis</Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentSessions.map(session => (
                  <Link key={session.id} href={`/scorecard/${session.id}`}>
                    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 flex-shrink-0">
                        <Mic className="h-4 w-4 text-[#4F46E5]" />
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

            {/* Study plan — full width in left column */}
            <StudyPlan />
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Competency breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-[#4F46E5]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Civil Service Competencies</h2>
              </div>
              <div className="space-y-3">
                {competencies.map(c => (
                  <CompetencyBar key={c.name} {...c} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-3">Based on STAR framework · EO level benchmarks</p>
            </div>

            {/* Practice tools */}
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
                Your weakest competency is <strong className="text-slate-700 dark:text-slate-300">Making Effective Decisions</strong>. Civil Service panels specifically probe for evidence of sound judgement under pressure. Close every decision story with a documented outcome — not just what you decided, but what happened as a result.
              </p>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 font-medium uppercase tracking-wide">Priority gap · 2 sessions to close</div>
              <Link href="/fluency">
                <button className="w-full py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors">
                  Open Fluency Coach
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
