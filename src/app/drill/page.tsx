'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, Mic, MicOff, Zap, RotateCcw, ChevronRight, CheckCircle2, XCircle, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppShell } from '@/components/AppShell'

const DRILL_BANK = [
  { id: '1', text: 'Tell me about a time you failed and what you learned.', category: 'behavioral', difficulty: 3 },
  { id: '2', text: 'Why do you want to leave your current role?', category: 'behavioral', difficulty: 2 },
  { id: '3', text: 'Describe your ideal work environment.', category: 'culture', difficulty: 1 },
  { id: '4', text: 'Walk me through how you would design a payment retry system.', category: 'technical', difficulty: 5 },
  { id: '5', text: 'Tell me about a time you influenced without authority.', category: 'behavioral', difficulty: 4 },
  { id: '6', text: 'How do you handle competing priorities?', category: 'situational', difficulty: 3 },
  { id: '7', text: 'What is your biggest weakness?', category: 'behavioral', difficulty: 3 },
  { id: '8', text: 'Where do you see yourself in 5 years?', category: 'behavioral', difficulty: 2 },
  { id: '9', text: 'How would you improve our onboarding product?', category: 'situational', difficulty: 4 },
  { id: '10', text: 'Describe a time you had to make a decision with incomplete data.', category: 'behavioral', difficulty: 4 },
  { id: '11', text: 'How do you measure the success of a feature?', category: 'technical', difficulty: 3 },
  { id: '12', text: 'Tell me about a project you are most proud of.', category: 'behavioral', difficulty: 2 },
]

const DRILL_DURATION = 60

type DrillState = 'idle' | 'running' | 'rating' | 'results'

interface DrillResult {
  questionId: string
  text: string
  category: string
  rating: 'good' | 'ok' | 'retry'
  timeUsed: number
}

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    behavioral: 'bg-[#4F46E5]/10 text-[#4F46E5]',
    technical: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    situational: 'bg-[#10B981]/10 text-[#10B981]',
    culture: 'bg-[#6366f1]/10 text-[#6366f1]',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[cat] ?? 'bg-slate-100 text-slate-500'}`}>
      {cat}
    </span>
  )
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i <= level ? 'bg-[#F59E0B]' : 'bg-slate-200'}`} />
      ))}
    </div>
  )
}

export default function QuickDrillPage() {
  const [state, setState] = useState<DrillState>('idle')
  const [queue, setQueue] = useState<typeof DRILL_BANK>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DRILL_DURATION)
  const [isRecording, setIsRecording] = useState(false)
  const [results, setResults] = useState<DrillResult[]>([])
  const [timeUsed, setTimeUsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  const current = queue[currentIdx]

  const shuffle = (arr: typeof DRILL_BANK) =>
    [...arr].sort(() => Math.random() - 0.5)

  const startDrill = () => {
    const q = shuffle(DRILL_BANK).slice(0, 8)
    setQueue(q)
    setCurrentIdx(0)
    setResults([])
    setTimeLeft(DRILL_DURATION)
    setIsRecording(false)
    setState('running')
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setState('rating')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const handleRecord = () => {
    if (!isRecording) {
      startTimeRef.current = Date.now()
      setIsRecording(true)
    } else {
      setIsRecording(false)
      clearInterval(timerRef.current!)
      const used = Math.round((Date.now() - startTimeRef.current) / 1000)
      setTimeUsed(used)
      setState('rating')
    }
  }

  const rate = (rating: DrillResult['rating']) => {
    const r: DrillResult = {
      questionId: current.id,
      text: current.text,
      category: current.category,
      rating,
      timeUsed,
    }
    const updated = [...results, r]
    setResults(updated)

    if (currentIdx < queue.length - 1) {
      setCurrentIdx(i => i + 1)
      setTimeLeft(DRILL_DURATION)
      setIsRecording(false)
      setState('running')
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!)
            setState('rating')
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      setState('results')
    }
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const timerColor = timeLeft > 30 ? '#10B981' : timeLeft > 15 ? '#F59E0B' : '#EF4444'
  const timerPct = (timeLeft / DRILL_DURATION) * 100
  const goodCount = results.filter(r => r.rating === 'good').length
  const retryCount = results.filter(r => r.rating === 'retry').length

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">

      <div className="mx-auto max-w-md px-4 py-8">

        {/* ── IDLE ── */}
        {state === 'idle' && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F59E0B]/10">
              <Zap className="h-10 w-10 text-[#F59E0B]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quick Drill</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              8 random questions. 60 seconds each. Answer cold — no preparation. Rate yourself
              honestly, and we'll flag the ones to retry in your next Fluency Coach session.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Timer, label: '60 sec', sub: 'per question', color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/8' },
                { icon: Zap, label: '8 questions', sub: 'randomised', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/8' },
                { icon: Mic, label: 'Voice', sub: 'answers', color: 'text-[#10B981]', bg: 'bg-[#10B981]/8' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${s.bg}`}>
                  <s.icon className={`mx-auto mb-1 h-5 w-5 ${s.color}`} />
                  <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                  <p className="text-xs text-[#64748B]">{s.sub}</p>
                </div>
              ))}
            </div>
            <Button onClick={startDrill} className="w-full h-12 bg-[#F59E0B] hover:bg-amber-500 text-white text-base font-semibold">
              <Zap className="mr-2 h-4 w-4" /> Start Drill
            </Button>
          </div>
        )}

        {/* ── RUNNING ── */}
        {state === 'running' && current && (
          <div>
            {/* Timer ring */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={timerColor} strokeWidth="8"
                    strokeDasharray={`${(timerPct / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono" style={{ color: timerColor }}>{timeLeft}</span>
                </div>
              </div>
              <span className="text-xs text-[#64748B]">seconds remaining</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <CategoryBadge cat={current.category} />
              <DifficultyDots level={current.difficulty} />
            </div>

            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm mb-6">
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                  "{current.text}"
                </p>
              </CardContent>
            </Card>

            <button
              onClick={handleRecord}
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                isRecording
                  ? 'bg-[#EF4444] recording-pulse'
                  : 'bg-[#4F46E5] hover:bg-[#4338CA]'
              }`}
              style={{ display: 'flex', margin: '0 auto 1.5rem' }}
            >
              {isRecording
                ? <MicOff className="h-8 w-8 text-white" />
                : <Mic className="h-8 w-8 text-white" />
              }
            </button>
            <p className="text-center text-xs text-[#64748B]">
              {isRecording ? 'Recording… tap to stop and rate' : 'Tap to start your answer'}
            </p>
          </div>
        )}

        {/* ── RATING ── */}
        {state === 'rating' && current && (
          <div>
            <h2 className="text-lg font-bold text-[#1E1B4B] mb-2 text-center">How did you do?</h2>
            <p className="text-sm text-[#64748B] text-center mb-6">"{current.text}"</p>
            <div className="space-y-3">
              {[
                { label: '✅ Nailed it', sub: 'Clear, structured, confident', rating: 'good' as const, color: 'border-[#10B981]/40 hover:bg-[#10B981]/5 text-[#10B981]' },
                { label: '🟡 Getting there', sub: 'Decent but could be sharper', rating: 'ok' as const, color: 'border-[#F59E0B]/40 hover:bg-[#F59E0B]/5 text-[#F59E0B]' },
                { label: '🔁 Retry', sub: 'Struggled — need more practice', rating: 'retry' as const, color: 'border-[#EF4444]/40 hover:bg-[#EF4444]/5 text-[#EF4444]' },
              ].map(opt => (
                <button key={opt.rating} onClick={() => rate(opt.rating)}
                  className={`w-full rounded-xl border-2 px-5 py-4 text-left transition-all ${opt.color}`}>
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {state === 'results' && (
          <div>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4F46E5]/10">
                <span className="text-2xl font-bold text-[#4F46E5]">{goodCount}/{results.length}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Drill complete</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {goodCount} nailed · {results.filter(r => r.rating === 'ok').length} ok · {retryCount} to retry
              </p>
            </div>

            <div className="space-y-2 mb-8">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5">
                  {r.rating === 'good'
                    ? <CheckCircle2 className="h-4 w-4 text-[#10B981] flex-shrink-0" />
                    : r.rating === 'ok'
                    ? <div className="h-4 w-4 rounded-full border-2 border-[#F59E0B] flex-shrink-0" />
                    : <XCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0" />
                  }
                  <p className="text-xs text-slate-900 dark:text-white flex-1 truncate">{r.text}</p>
                  <CategoryBadge cat={r.category} />
                </div>
              ))}
            </div>

            {retryCount > 0 && (
              <div className="rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/20 p-4 mb-6">
                <p className="text-xs font-semibold text-[#EF4444] mb-1">
                  {retryCount} question{retryCount > 1 ? 's' : ''} need more work
                </p>
                <p className="text-xs text-[#64748B]">
                  Add these to your Fluency Coach Q&amp;A bank for deliberate practice.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={startDrill} className="bg-[#F59E0B] hover:bg-amber-500 text-white">
                <RotateCcw className="mr-2 h-4 w-4" /> New Drill
              </Button>
              <Link href="/fluency">
                <Button variant="outline" className="w-full border-slate-200 text-[#64748B]">
                  Fluency Coach
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    </AppShell>
  )
}
