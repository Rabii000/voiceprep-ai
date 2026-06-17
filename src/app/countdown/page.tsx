'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Calendar, Clock, CheckCircle2, Circle, Mic, BookOpen, Zap, Repeat2, Target, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppShell } from '@/components/AppShell'

interface InterviewEvent {
  id: string
  role: string
  company: string
  date: string
  type: string
  round: string
}

interface ScheduledDay {
  date: string
  label: string
  tasks: { icon: React.ElementType; text: string; href: string; done: boolean }[]
  isToday: boolean
  isPast: boolean
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function buildSchedule(interview: InterviewEvent): ScheduledDay[] {
  const days = daysUntil(interview.date)
  const today = new Date()
  const schedule: ScheduledDay[] = []

  const taskSets = [
    [
      { icon: Mic, text: '30-min behavioral mock session', href: '/session', done: false },
      { icon: BookOpen, text: 'Review your top 5 STAR stories in Fluency Coach', href: '/fluency', done: false },
    ],
    [
      { icon: Repeat2, text: 'Shadow Speaking — "Tell me about yourself"', href: '/shadow', done: false },
      { icon: Zap, text: 'Quick Drill — 8 random questions', href: '/drill', done: false },
    ],
    [
      { icon: Mic, text: '45-min technical mock session', href: '/session', done: false },
      { icon: BookOpen, text: 'Fluency Coach — technical answers', href: '/fluency', done: false },
    ],
    [
      { icon: Zap, text: 'Quick Drill — weakness & situational focus', href: '/drill', done: false },
      { icon: Target, text: 'Review scorecard from yesterday', href: '/dashboard', done: false },
    ],
    [
      { icon: Repeat2, text: 'Shadow Speaking — full answer bank', href: '/shadow', done: false },
      { icon: Mic, text: '15-min rapid-fire session', href: '/session', done: false },
    ],
    [
      { icon: BookOpen, text: 'Fluency Coach — memory mode run-through', href: '/fluency', done: false },
      { icon: Target, text: 'Light review only — rest your voice', href: '/dashboard', done: false },
    ],
    [
      { icon: CheckCircle2, text: 'Interview day — you\'ve got this 🎯', href: '#', done: false },
    ],
  ]

  const count = Math.min(days + 1, 7)
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const taskIdx = i % taskSets.length
    schedule.push({
      date: dateStr,
      label: i === 0 ? 'Today' : i === days ? 'Interview Day 🎯' :
        d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      tasks: taskSets[taskIdx],
      isToday: i === 0,
      isPast: false,
    })
  }
  return schedule
}

const INTERVIEW_TYPES = ['Behavioral', 'Technical', 'Panel', 'Case Study', 'Executive', 'Culture Fit']
const ROUNDS = ['Phone Screen', 'First Round', 'Second Round', 'Final Round', 'Offer Discussion']

export default function CountdownPage() {
  const [interviews, setInterviews] = useState<InterviewEvent[]>([
    {
      id: '1',
      role: 'Senior Product Manager',
      company: 'Stripe',
      date: (() => {
        const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().split('T')[0]
      })(),
      type: 'Behavioral',
      round: 'Final Round',
    },
  ])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ role: '', company: '', date: '', type: 'Behavioral', round: 'First Round' })
  const [selected, setSelected] = useState<string>('1')
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set())

  const active = interviews.find(i => i.id === selected)
  const schedule = active ? buildSchedule(active) : []
  const days = active ? daysUntil(active.date) : 0

  const addInterview = () => {
    if (!form.role || !form.company || !form.date) return
    const id = crypto.randomUUID()
    setInterviews(prev => [...prev, { ...form, id }])
    setSelected(id)
    setAdding(false)
    setForm({ role: '', company: '', date: '', type: 'Behavioral', round: 'First Round' })
  }

  const toggleTask = (key: string) => {
    setDoneTasks(prev => {
      const n = new Set(prev)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
  }

  const todayTasks = schedule.find(s => s.isToday)?.tasks ?? []
  const todayDone = todayTasks.filter((_, i) => doneTasks.has(`today-${i}`)).length

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Interview Countdown</h1>

        {/* Interview selector */}
        <div className="flex gap-2 flex-wrap">
          {interviews.map(iv => (
            <button key={iv.id} onClick={() => setSelected(iv.id)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                selected === iv.id
                  ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                  : 'border-slate-200 bg-white text-[#64748B] hover:border-[#4F46E5]/40'
              }`}>
              {iv.company} · {iv.role.split(' ').slice(-1)[0]}
            </button>
          ))}
          <button onClick={() => setAdding(v => !v)}
            className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-[#64748B] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
            + Add Interview
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs text-[#64748B] mb-1 block">Role</Label>
                <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Senior PM" className="h-9 text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs text-[#64748B] mb-1 block">Company</Label>
                <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Stripe" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-[#64748B] mb-1 block">Interview Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-[#64748B] mb-1 block">Round</Label>
                <select value={form.round} onChange={e => setForm(f => ({ ...f, round: e.target.value }))}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm bg-white text-[#1E1B4B]">
                  {ROUNDS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={addInterview} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white flex-1">Save</Button>
                <Button variant="outline" onClick={() => setAdding(false)} className="border-slate-200 text-[#64748B]">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {active && (
          <>
            {/* Countdown hero */}
            <Card className={`border-2 shadow-sm overflow-hidden dark:bg-slate-900 ${days <= 1 ? 'border-[#EF4444]/40' : days <= 3 ? 'border-[#F59E0B]/40' : 'border-[#4F46E5]/20'}`}>
              <div className={`h-1.5 ${days <= 1 ? 'bg-[#EF4444]' : days <= 3 ? 'bg-[#F59E0B]' : 'bg-[#4F46E5]'}`}
                style={{ width: `${Math.max(10, 100 - (days / 14) * 100)}%`, transition: 'width 1s ease' }} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">{active.round} · {active.type}</p>
                    <h2 className="text-xl font-bold text-[#1E1B4B]">{active.role}</h2>
                    <p className="text-sm text-[#64748B]">{active.company}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-5xl font-black tabular-nums ${days <= 1 ? 'text-[#EF4444]' : days <= 3 ? 'text-[#F59E0B]' : 'text-[#4F46E5]'}`}>
                      {days <= 0 ? '🎯' : days}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium">{days <= 0 ? 'TODAY' : days === 1 ? 'day to go' : 'days to go'}</p>
                  </div>
                </div>

                {/* Today's progress */}
                {todayTasks.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-[#1E1B4B]">Today's tasks</p>
                      <span className="text-xs text-[#64748B]">{todayDone}/{todayTasks.length} done</span>
                    </div>
                    <Progress value={(todayDone / todayTasks.length) * 100} className="h-1.5 mb-3" />
                    <div className="space-y-2">
                      {todayTasks.map((task, i) => {
                        const key = `today-${i}`
                        const done = doneTasks.has(key)
                        return (
                          <button key={i} onClick={() => toggleTask(key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${done ? 'bg-[#10B981]/5 border border-[#10B981]/20' : 'bg-slate-50 border border-slate-100 hover:border-slate-200'}`}>
                            {done
                              ? <CheckCircle2 className="h-4 w-4 text-[#10B981] flex-shrink-0" />
                              : <Circle className="h-4 w-4 text-slate-300 flex-shrink-0" />
                            }
                            <task.icon className={`h-3.5 w-3.5 flex-shrink-0 ${done ? 'text-[#10B981]' : 'text-[#64748B]'}`} />
                            <span className={`text-xs font-medium ${done ? 'line-through text-[#64748B]' : 'text-[#1E1B4B]'}`}>{task.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Full schedule timeline */}
            <div>
              <h3 className="text-sm font-bold text-[#1E1B4B] mb-4">Prep Schedule</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100" />

                <div className="space-y-4">
                  {schedule.map((day, di) => (
                    <div key={day.date} className="relative pl-10">
                      {/* Dot */}
                      <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        day.isToday
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                          : day.date === active.date
                          ? 'border-[#10B981] bg-[#10B981] text-white'
                          : 'border-slate-200 bg-white text-[#64748B]'
                      }`}>
                        {day.isToday ? '→' : day.date === active.date ? '🎯' : di + 1}
                      </div>

                      <div className={`rounded-xl border p-4 ${day.isToday ? 'border-[#4F46E5]/20 bg-[#4F46E5]/3' : day.date === active.date ? 'border-[#10B981]/20 bg-[#10B981]/3' : 'border-slate-100 bg-white'}`}>
                        <p className="text-xs font-bold text-[#1E1B4B] mb-2">{day.label}</p>
                        <div className="space-y-1.5">
                          {day.tasks.map((task, ti) => (
                            <Link key={ti} href={task.href} className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#4F46E5] transition-colors group">
                              <task.icon className="h-3.5 w-3.5 flex-shrink-0 group-hover:text-[#4F46E5]" />
                              {task.text}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </AppShell>
  )
}
