'use client'

import Link from 'next/link'
import {
  Mic, Plus, TrendingUp, Calendar, Flame, Clock,
  ChevronRight, BarChart3, Target, Award, BookOpen,
  Repeat2, Zap, Star, Grid3x3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const recentSessions = [
  { id: '1', role: 'Senior Product Manager', company: 'Stripe', score: 78, date: 'Jun 15', duration: '30 min', type: 'Behavioral' },
  { id: '2', role: 'Senior Product Manager', company: 'Stripe', score: 65, date: 'Jun 13', duration: '45 min', type: 'Technical' },
  { id: '3', role: 'Senior Product Manager', company: 'Stripe', score: 71, date: 'Jun 10', duration: '30 min', type: 'Panel' },
]

const stats = [
  { label: 'Sessions Done', value: '12', icon: Mic, color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/10' },
  { label: 'Avg. Score', value: '74', icon: BarChart3, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  { label: 'Day Streak', value: '5', icon: Flame, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  { label: 'Hours Practiced', value: '8.5', icon: Clock, color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/10' },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-[#10B981]/10 text-[#10B981]' : score >= 65 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#EF4444]/10 text-[#EF4444]'
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{score}</span>
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar + main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#1E1B4B] border-r border-white/10 px-4 py-6 fixed left-0 top-0">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">VoicePrep <span className="text-[#10B981]">AI</span></span>
          </Link>

          <nav className="flex-1 space-y-1">
            {[
              { label: 'Dashboard', icon: BarChart3, href: '/dashboard', active: true },
              { label: 'New Session', icon: Plus, href: '/session', active: false },
              { label: 'Practice Hub', icon: Grid3x3, href: '/tools', active: false },
              { label: 'Fluency Coach', icon: BookOpen, href: '/fluency', active: false },
              { label: 'Shadow Speaking', icon: Repeat2, href: '/shadow', active: false },
              { label: 'Quick Drill', icon: Zap, href: '/drill', active: false },
              { label: 'Answer Library', icon: Star, href: '/library', active: false },
              { label: 'Interview Countdown', icon: Calendar, href: '/countdown', active: false },
              { label: 'Progress', icon: TrendingUp, href: '/dashboard/progress', active: false },
              { label: 'Achievements', icon: Award, href: '/dashboard/achievements', active: false },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-[#4F46E5]/20 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 p-4">
            <p className="text-xs font-semibold text-white mb-1">Free Plan</p>
            <p className="text-xs text-slate-400 mb-3">1 of 2 sessions used</p>
            <Progress value={50} className="h-1.5 mb-3" />
            <Link href="/auth/signup?plan=pro">
              <Button size="sm" className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:ml-64 flex-1 p-6 lg:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold text-[#1E1B4B]">Good morning, Jane 👋</h1>
              <p className="text-[#64748B] mt-1">You have an interview next Tuesday. Let's get ready.</p>
            </div>
            <Link href="/session">
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white gap-2">
                <Plus className="h-4 w-4" />
                New Session
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <Card key={stat.label} className="border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-[#1E1B4B]">{stat.value}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent sessions */}
            <div className="lg:col-span-2">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-[#1E1B4B]">Recent Sessions</CardTitle>
                    <Link href="/dashboard/progress" className="text-xs text-[#4F46E5] hover:underline">View all</Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions.map(session => (
                      <Link key={session.id} href={`/scorecard/${session.id}`}>
                        <div className="flex items-center gap-4 rounded-xl border border-slate-100 hover:border-[#4F46E5]/20 hover:bg-slate-50 p-4 transition-colors cursor-pointer">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E1B4B] flex-shrink-0">
                            <Mic className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1E1B4B] truncate">{session.role}</p>
                            <p className="text-xs text-[#64748B]">{session.company} · {session.date} · {session.duration}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-slate-200 text-[#64748B]">{session.type}</Badge>
                            <ScoreBadge score={session.score} />
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Score trend + quick actions */}
            <div className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-[#1E1B4B] flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10B981]" />
                    Score Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-1.5 h-20 mb-3">
                    {[55, 62, 58, 65, 71, 69, 78].map((v, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-[#4F46E5]/20 relative" style={{ height: `${(v / 100) * 100}%` }}>
                        {i === 6 && (
                          <div className="absolute inset-0 rounded-sm bg-[#4F46E5]" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Jun 1</span>
                    <span className="text-[#10B981] font-semibold">↑ +23 pts</span>
                    <span>Jun 15</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-[#1E1B4B] flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#4F46E5]" />
                    Quick Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['15-min rapid fire', '30-min behavioral', 'STAR method drill'].map(item => (
                    <Link key={item} href="/session">
                      <button className="w-full text-left rounded-lg border border-slate-100 hover:border-[#4F46E5]/20 hover:bg-slate-50 px-3 py-2.5 text-sm text-[#1E1B4B] transition-colors flex items-center justify-between">
                        {item}
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                      </button>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Fluency Coach card */}
              <Card className="border-[#4F46E5]/20 bg-gradient-to-br from-[#4F46E5]/5 to-[#10B981]/5 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-[#1E1B4B] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                    Fluency Coach
                    <span className="ml-auto rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-xs font-semibold text-[#4F46E5]">New</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                    Upload your prepared Q&amp;A pairs and practice reading them aloud. Your script
                    gradually fades over sessions until you deliver every answer from memory.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {[
                      { label: 'Sessions 1–2', sub: 'Full script', color: 'bg-[#4F46E5]/10 text-[#4F46E5]' },
                      { label: 'Sessions 3–4', sub: 'Keywords', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
                      { label: 'Session 5+', sub: 'Memory', color: 'bg-[#10B981]/10 text-[#10B981]' },
                    ].map(s => (
                      <div key={s.label} className={`rounded-lg p-2 text-center ${s.color}`}>
                        <p className="text-xs font-bold">{s.label}</p>
                        <p className="text-xs opacity-70">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/fluency">
                    <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm h-9">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                      Open Fluency Coach
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
