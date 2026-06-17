'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Upload, Plus, Trash2, Play, Pause,
  ChevronRight, ChevronDown, ChevronUp, RotateCcw,
  Mic, MicOff, CheckCircle2, AlertCircle, Eye, EyeOff,
  BookOpen, Zap, Trophy, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

// ─── Types ───────────────────────────────────────────────────────────────────

interface QAPair {
  id: string
  question: string
  answer: string
  sessions: number   // how many times practised
  mastery: number    // 0–100
}

type Stage = 'setup' | 'practice' | 'results'
type ScriptVisibility = 'full' | 'keywords' | 'hidden'

// ─── Mastery helpers ─────────────────────────────────────────────────────────

function scriptVisibilityForSessions(sessions: number): ScriptVisibility {
  if (sessions < 3) return 'full'
  if (sessions < 5) return 'keywords'
  return 'hidden'
}

function masteryLabel(m: number) {
  if (m >= 85) return { text: 'Mastered', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' }
  if (m >= 55) return { text: 'Progressing', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' }
  return { text: 'Learning', color: 'text-[#64748B]', bg: 'bg-[#64748B]/10' }
}

// Extract first word of each sentence as keywords for partial-script mode
function extractKeywords(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => {
      const words = sentence.trim().split(' ')
      return words.slice(0, 3).join(' ') + ' ...'
    })
    .join('\n')
}

// ─── Demo seed data ───────────────────────────────────────────────────────────

const SEED: QAPair[] = [
  {
    id: 'q1',
    question: 'Tell me about yourself.',
    answer:
      "I'm a product manager with six years of experience building fintech products. Most recently at Acme Pay, I led a team that grew our payment success rate from 87% to 96%, adding $4M in annual revenue. I'm passionate about using data to make decisions that actually move the needle — and I'm excited about this role because Stripe operates at the intersection of everything I love about the space.",
    sessions: 5,
    mastery: 88,
  },
  {
    id: 'q2',
    question: 'What is your greatest strength?',
    answer:
      "My greatest strength is translating ambiguous problems into clear, actionable roadmaps. In my last role, our leadership team couldn't agree on a product direction for six months. I ran a structured discovery sprint — five customer interviews, a competitive matrix, and a prioritisation workshop — and we aligned in two weeks. That sprint became the standard process across the company.",
    sessions: 3,
    mastery: 62,
  },
  {
    id: 'q3',
    question: 'Describe a time you handled conflict with a stakeholder.',
    answer:
      "At Acme, our engineering lead and I disagreed on timelines for a compliance feature. He wanted six weeks; I needed three for regulatory reasons. Instead of escalating, I proposed we scope down to the MVP that satisfied the compliance requirement and defer nice-to-haves. We shipped in three weeks, passed the audit, and added the deferred features in the next sprint. The relationship actually got stronger because we found a creative path together.",
    sessions: 1,
    mastery: 24,
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function MasteryBar({ value }: { value: number }) {
  const color =
    value >= 85 ? 'bg-[#10B981]' : value >= 55 ? 'bg-[#F59E0B]' : 'bg-[#64748B]'
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  pairs,
  onChange,
  onStart,
}: {
  pairs: QAPair[]
  onChange: (pairs: QAPair[]) => void
  onStart: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const addRow = () =>
    onChange([
      ...pairs,
      { id: crypto.randomUUID(), question: '', answer: '', sessions: 0, mastery: 0 },
    ])

  const updateRow = (id: string, field: 'question' | 'answer', value: string) =>
    onChange(pairs.map(p => (p.id === id ? { ...p, [field]: value } : p)))

  const removeRow = (id: string) => onChange(pairs.filter(p => p.id !== id))

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      // Parse simple Q: / A: format
      const blocks = text.split(/\n\s*\n/).filter(Boolean)
      const parsed: QAPair[] = blocks.flatMap(block => {
        const qMatch = block.match(/Q[:\.]?\s*(.+)/i)
        const aMatch = block.match(/A[:\.]?\s*([\s\S]+)/i)
        if (!qMatch || !aMatch) return []
        return [{ id: crypto.randomUUID(), question: qMatch[1].trim(), answer: aMatch[1].trim(), sessions: 0, mastery: 0 }]
      })
      if (parsed.length) onChange([...pairs, ...parsed])
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const ready = pairs.some(p => p.question.trim() && p.answer.trim())

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5]/10">
          <BookOpen className="h-7 w-7 text-[#4F46E5]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1E1B4B]">Fluency Coach</h1>
        <p className="mt-2 text-sm text-[#64748B] max-w-md mx-auto">
          Upload your prepared Q&amp;A pairs. Practice reading your answers aloud, then watch your
          script gradually fade as you build mastery — until you can deliver every answer cold.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { icon: Eye, label: 'Sessions 1–2', desc: 'Full script visible', color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/8' },
          { icon: EyeOff, label: 'Sessions 3–4', desc: 'Key phrases only', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/8' },
          { icon: Zap, label: 'Session 5+', desc: 'Blank — from memory', color: 'text-[#10B981]', bg: 'bg-[#10B981]/8' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.bg}`}>
            <s.icon className={`mx-auto mb-1.5 h-5 w-5 ${s.color}`} />
            <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload banner */}
      <button
        onClick={() => fileRef.current?.click()}
        className="mb-4 w-full rounded-xl border-2 border-dashed border-[#4F46E5]/30 bg-[#4F46E5]/3 py-5 text-center hover:border-[#4F46E5]/60 hover:bg-[#4F46E5]/6 transition-colors"
      >
        <Upload className="mx-auto mb-1.5 h-5 w-5 text-[#4F46E5]" />
        <p className="text-sm font-medium text-[#4F46E5]">Upload a .txt file</p>
        <p className="text-xs text-[#64748B] mt-0.5">Format: Q: question / A: answer — one pair per blank line</p>
      </button>
      <input ref={fileRef} type="file" accept=".txt,.md" className="hidden" onChange={handleFile} />

      {/* Q&A Pairs */}
      <div className="space-y-4 mb-6">
        {pairs.map((pair, i) => {
          const ml = masteryLabel(pair.mastery)
          return (
            <Card key={pair.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64748B]">Q{i + 1}</span>
                  <div className="flex items-center gap-2">
                    {pair.sessions > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ml.bg} ${ml.color}`}>
                        {ml.text} · {pair.mastery}%
                      </span>
                    )}
                    <button onClick={() => removeRow(pair.id)} className="text-slate-300 hover:text-[#EF4444] transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {pair.sessions > 0 && <MasteryBar value={pair.mastery} />}
                <Textarea
                  value={pair.question}
                  onChange={e => updateRow(pair.id, 'question', e.target.value)}
                  placeholder="Interview question…"
                  rows={2}
                  className="resize-none text-sm border-slate-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                />
                <Textarea
                  value={pair.answer}
                  onChange={e => updateRow(pair.id, 'answer', e.target.value)}
                  placeholder="Your prepared answer…"
                  rows={4}
                  className="resize-none text-sm border-slate-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button
        variant="outline"
        onClick={addRow}
        className="w-full mb-4 border-dashed border-slate-300 text-[#64748B] hover:border-[#4F46E5] hover:text-[#4F46E5]"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Q&amp;A Pair
      </Button>

      <Button
        disabled={!ready}
        onClick={onStart}
        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white h-12 text-base font-semibold"
      >
        <Mic className="mr-2 h-4 w-4" />
        Start Fluency Session
      </Button>
    </div>
  )
}

// ─── Practice Screen ──────────────────────────────────────────────────────────

function PracticeScreen({
  pairs,
  onComplete,
}: {
  pairs: QAPair[]
  onComplete: (results: QAPair[]) => void
}) {
  const [idx, setIdx] = useState(0)
  const [listening, setListening] = useState(false)
  const [showAnswer, setShowAnswer] = useState(true)
  const [scores, setScores] = useState<Record<string, number>>({})

  const current = pairs[idx]
  const visibility = scriptVisibilityForSessions(current.sessions)

  const answerDisplay = () => {
    if (!showAnswer) return null
    if (visibility === 'full') return current.answer
    if (visibility === 'keywords') return extractKeywords(current.answer)
    return null // hidden — from memory
  }

  const markAnswer = (score: number) => {
    setScores(prev => ({ ...prev, [current.id]: score }))
    if (idx < pairs.length - 1) {
      setIdx(idx + 1)
      setListening(false)
      setShowAnswer(true)
    } else {
      // Build updated pairs with new mastery scores
      const updated = pairs.map(p => {
        const s = scores[p.id] ?? (p.id === current.id ? score : 50)
        const newMastery = Math.min(100, Math.round((p.mastery * p.sessions + s) / (p.sessions + 1)))
        return { ...p, sessions: p.sessions + 1, mastery: newMastery }
      })
      onComplete(updated)
    }
  }

  const progressPct = ((idx) / pairs.length) * 100

  return (
    <div className="min-h-screen bg-[#0f0e1e] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <span className="text-xs text-white/40 font-mono">
          {idx + 1} / {pairs.length}
        </span>
        <div className="w-32">
          <Progress value={progressPct} className="h-1 bg-white/10" />
        </div>
        <Badge className={`text-xs border-0 ${
          visibility === 'full' ? 'bg-[#4F46E5]/20 text-[#818CF8]' :
          visibility === 'keywords' ? 'bg-[#F59E0B]/20 text-[#FCD34D]' :
          'bg-[#10B981]/20 text-[#34D399]'
        }`}>
          {visibility === 'full' ? '📖 Full Script' : visibility === 'keywords' ? '🔑 Keywords' : '🧠 Memory'}
        </Badge>
      </header>

      <div className="flex-1 flex flex-col px-4 py-6 max-w-xl mx-auto w-full">
        {/* Question */}
        <div className="mb-6">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Question</p>
          <p className="text-lg font-semibold text-white leading-relaxed">
            "{current.question}"
          </p>
        </div>

        {/* Answer display area */}
        <div className="flex-1 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/40 uppercase tracking-widest">
              {visibility === 'hidden' ? 'Your Answer (from memory)' : 'Your Script'}
            </p>
            {visibility !== 'hidden' && (
              <button
                onClick={() => setShowAnswer(v => !v)}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showAnswer ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {visibility === 'hidden' ? (
            <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/5 p-6 min-h-[140px] flex items-center justify-center">
              <div className="text-center">
                <Trophy className="mx-auto mb-3 h-8 w-8 text-[#10B981]" />
                <p className="text-sm text-[#34D399] font-medium">Session 5+ — Deliver from memory</p>
                <p className="text-xs text-white/30 mt-1">You've practised this {current.sessions} times</p>
              </div>
            </div>
          ) : answerDisplay() ? (
            <div className={`rounded-2xl border p-5 leading-relaxed text-sm whitespace-pre-line transition-all ${
              visibility === 'full'
                ? 'border-white/10 bg-white/5 text-white/80'
                : 'border-[#F59E0B]/20 bg-[#F59E0B]/5 text-[#FCD34D]/80'
            }`}>
              {visibility === 'keywords' && (
                <p className="text-xs text-[#F59E0B] mb-3 font-medium">Key phrases only — fill in the gaps yourself</p>
              )}
              {answerDisplay()}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/3 p-5 min-h-[140px] flex items-center justify-center">
              <p className="text-sm text-white/20">Answer hidden — tap Show to reveal</p>
            </div>
          )}
        </div>

        {/* Mic button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setListening(l => !l)}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
              listening
                ? 'bg-[#EF4444] shadow-[0_0_0_0_rgba(239,68,68,0.7)]'
                : 'bg-[#4F46E5] hover:bg-[#4338CA]'
            }`}
            style={listening ? { animation: 'pulse-ring 2s infinite' } : {}}
          >
            {listening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>
          <p className="text-xs text-white/30">
            {listening ? 'Speak your answer — tap to stop' : 'Tap to start speaking'}
          </p>

          {/* Self-rating buttons — always available */}
          <div className="w-full">
            <p className="text-xs text-white/30 text-center mb-3">How did that feel?</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Struggled', score: 30, color: 'border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10' },
                { label: 'Getting there', score: 65, color: 'border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10' },
                { label: 'Nailed it', score: 92, color: 'border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/10' },
              ].map(r => (
                <button
                  key={r.label}
                  onClick={() => markAnswer(r.score)}
                  className={`rounded-xl border py-3 text-xs font-semibold transition-colors ${r.color}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  pairs,
  onReset,
  onRetry,
}: {
  pairs: QAPair[]
  onReset: () => void
  onRetry: () => void
}) {
  const avgMastery = Math.round(pairs.reduce((s, p) => s + p.mastery, 0) / pairs.length)
  const mastered = pairs.filter(p => p.mastery >= 85).length

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      {/* Score hero */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#4F46E5]/10">
          <span className="text-3xl font-bold text-[#4F46E5]">{avgMastery}</span>
        </div>
        <h2 className="text-xl font-bold text-[#1E1B4B]">Session Complete</h2>
        <p className="text-sm text-[#64748B] mt-1">
          {mastered}/{pairs.length} answers mastered · avg mastery {avgMastery}%
        </p>
      </div>

      {/* Per-question results */}
      <div className="space-y-3 mb-8">
        {pairs.map((p, i) => {
          const ml = masteryLabel(p.mastery)
          const nextVis = scriptVisibilityForSessions(p.sessions)
          return (
            <Card key={p.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${ml.bg} ${ml.color}`}>
                    {p.mastery}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E1B4B] truncate">{p.question}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <MasteryBar value={p.mastery} />
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      {p.sessions} sessions · next: {' '}
                      <span className="font-medium">
                        {nextVis === 'full' ? '📖 Full script' : nextVis === 'keywords' ? '🔑 Keywords only' : '🧠 Memory mode'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={onRetry} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
          <RotateCcw className="mr-2 h-4 w-4" />
          Practice Again
        </Button>
        <Button variant="outline" onClick={onReset} className="border-slate-200 text-[#64748B]">
          New Q&amp;A Set
        </Button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FluencyCoachPage() {
  const [stage, setStage] = useState<Stage>('setup')
  const [pairs, setPairs] = useState<QAPair[]>(SEED)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top nav — only show on non-practice screens */}
      {stage !== 'practice' && (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E1B4B]">
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-slate-200">·</span>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#4F46E5]" />
            <span className="text-sm font-semibold text-[#1E1B4B]">Fluency Coach</span>
          </div>
          <Badge className="ml-auto bg-[#4F46E5]/10 text-[#4F46E5] border-0 text-xs">Beta</Badge>
        </header>
      )}

      {stage === 'setup' && (
        <SetupScreen
          pairs={pairs}
          onChange={setPairs}
          onStart={() => setStage('practice')}
        />
      )}

      {stage === 'practice' && (
        <PracticeScreen
          pairs={pairs.filter(p => p.question.trim() && p.answer.trim())}
          onComplete={updated => { setPairs(updated); setStage('results') }}
        />
      )}

      {stage === 'results' && (
        <ResultsScreen
          pairs={pairs}
          onReset={() => { setPairs(SEED); setStage('setup') }}
          onRetry={() => setStage('practice')}
        />
      )}
    </div>
  )
}
