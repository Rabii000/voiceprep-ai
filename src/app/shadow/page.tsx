'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Volume2, Mic, MicOff, RotateCcw,
  ChevronRight, CheckCircle2, Play, Pause, Repeat2,
  BookOpen, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AppShell } from '@/components/AppShell'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShadowItem {
  id: string
  question: string
  modelAnswer: string
  segments: string[]   // broken into speakable chunks
  category: string
}

type PhaseState = 'listen' | 'repeat' | 'done'

// ─── Demo data ────────────────────────────────────────────────────────────────

const SHADOW_ITEMS: ShadowItem[] = [
  {
    id: 's1',
    question: 'Tell me about yourself.',
    category: 'behavioral',
    modelAnswer:
      "I'm a product manager with six years of experience building fintech products. Most recently I led a team that grew our payment success rate from 87% to 96%, adding four million in annual revenue. I'm passionate about using data to make decisions that move the needle, and I'm excited about this role because Stripe operates at the intersection of everything I love about the space.",
    segments: [
      "I'm a product manager with six years of experience building fintech products.",
      "Most recently I led a team that grew our payment success rate from 87% to 96%, adding four million in annual revenue.",
      "I'm passionate about using data to make decisions that move the needle.",
      "And I'm excited about this role because Stripe operates at the intersection of everything I love about this space.",
    ],
  },
  {
    id: 's2',
    question: 'What is your greatest strength?',
    category: 'behavioral',
    modelAnswer:
      "My greatest strength is translating ambiguous problems into clear actionable roadmaps. In my last role, our leadership team couldn't agree on a direction for six months. I ran a structured discovery sprint — five customer interviews, a competitive matrix, and a prioritisation workshop — and we aligned in two weeks. That sprint became the standard process across the company.",
    segments: [
      "My greatest strength is translating ambiguous problems into clear actionable roadmaps.",
      "In my last role, our leadership team couldn't agree on a direction for six months.",
      "I ran a structured discovery sprint — five customer interviews, a competitive matrix, and a prioritisation workshop — and we aligned in two weeks.",
      "That sprint became the standard process across the entire company.",
    ],
  },
  {
    id: 's3',
    question: 'Describe a time you handled conflict with a stakeholder.',
    category: 'situational',
    modelAnswer:
      "At my previous company, our engineering lead and I disagreed on timelines for a compliance feature. He wanted six weeks, I needed three for regulatory reasons. Instead of escalating, I proposed we scope down to the MVP that satisfied compliance and defer the nice-to-haves. We shipped in three weeks, passed the audit, and added the deferred features the next sprint. The relationship got stronger because we found a creative path together.",
    segments: [
      "At my previous company, our engineering lead and I disagreed on timelines for a compliance feature.",
      "He wanted six weeks — I needed three for regulatory reasons.",
      "Instead of escalating, I proposed we scope down to the MVP that satisfied compliance and defer the nice-to-haves.",
      "We shipped in three weeks, passed the audit, and added the deferred features the next sprint.",
      "The relationship actually got stronger because we found a creative path together.",
    ],
  },
]

// ─── Waveform decoration ─────────────────────────────────────────────────────

function WaveformBars({ active, color = '#4F46E5' }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all"
          style={{
            background: color,
            height: active
              ? `${20 + Math.abs(Math.sin(i * 0.8)) * 80}%`
              : '20%',
            opacity: active ? 0.9 : 0.3,
            animation: active ? `wave ${0.8 + (i % 4) * 0.15}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ─── Segment row ─────────────────────────────────────────────────────────────

function SegmentRow({
  text,
  index,
  isActive,
  isDone,
  phase,
}: {
  text: string
  index: number
  isActive: boolean
  isDone: boolean
  phase: PhaseState
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 border transition-all duration-300 ${
        isDone
          ? 'border-[#10B981]/30 bg-[#10B981]/5'
          : isActive && phase === 'listen'
          ? 'border-[#4F46E5]/40 bg-[#4F46E5]/6 shadow-sm'
          : isActive && phase === 'repeat'
          ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5 shadow-sm'
          : 'border-slate-100 bg-slate-50/50 opacity-40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
          isDone ? 'bg-[#10B981] text-white' :
          isActive ? 'bg-[#4F46E5] text-white' :
          'bg-slate-200 text-slate-400'
        }`}>
          {isDone ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
        </div>
        <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShadowSpeakingPage() {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [segmentIdx, setSegmentIdx] = useState(0)
  const [phase, setPhase] = useState<PhaseState>('listen')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())
  const [showFullAnswer, setShowFullAnswer] = useState(false)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const item = SHADOW_ITEMS[questionIdx]
  const segment = item.segments[segmentIdx]
  const isLastSegment = segmentIdx === item.segments.length - 1
  const isLastQuestion = questionIdx === SHADOW_ITEMS.length - 1
  const progress = ((questionIdx * 100 + (segmentIdx / item.segments.length) * 100) / SHADOW_ITEMS.length)

  // Text-to-speech via Web Speech API
  const speakSegment = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(segment)
    utter.rate = 0.88
    utter.pitch = 1.05
    utter.onstart = () => setIsPlaying(true)
    utter.onend = () => {
      setIsPlaying(false)
      setPhase('repeat')
    }
    synthRef.current = utter
    window.speechSynthesis.speak(utter)
  }

  const stopSpeech = () => {
    window.speechSynthesis?.cancel()
    setIsPlaying(false)
  }

  const advanceSegment = () => {
    setIsRecording(false)
    if (!isLastSegment) {
      setSegmentIdx(s => s + 1)
      setPhase('listen')
    } else {
      setPhase('done')
      setCompletedQuestions(prev => new Set([...prev, item.id]))
    }
  }

  const nextQuestion = () => {
    stopSpeech()
    setSegmentIdx(0)
    setPhase('listen')
    setIsRecording(false)
    setShowFullAnswer(false)
    if (!isLastQuestion) setQuestionIdx(q => q + 1)
  }

  const reset = () => {
    stopSpeech()
    setQuestionIdx(0)
    setSegmentIdx(0)
    setPhase('listen')
    setIsRecording(false)
    setShowFullAnswer(false)
    setCompletedQuestions(new Set())
  }

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const allDone = completedQuestions.size === SHADOW_ITEMS.length

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Shadow Speaking</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{questionIdx + 1}/{SHADOW_ITEMS.length}</span>
            <Progress value={progress} className="w-20 h-1.5" />
          </div>
        </div>
        {allDone ? (
          /* ── Completion screen ── */
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <CheckCircle2 className="h-10 w-10 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">All answers shadowed!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              You've completed one full shadow session. Repeat daily until delivery feels effortless.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                <RotateCcw className="mr-2 h-4 w-4" /> Repeat Session
              </Button>
              <Link href="/fluency">
                <Button variant="outline" className="border-slate-200 text-slate-500 dark:text-slate-400">
                  <BookOpen className="mr-2 h-4 w-4" /> Fluency Coach
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Question */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`border-0 text-xs ${
                  item.category === 'behavioral' ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'bg-[#10B981]/10 text-[#10B981]'
                }`}>{item.category}</Badge>
                {completedQuestions.has(item.id) && (
                  <Badge className="border-0 text-xs bg-[#10B981]/10 text-[#10B981]">
                    <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> Completed
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">"{item.question}"</h2>
            </div>

            {/* Phase indicator */}
            <div className="flex gap-2 mb-6">
              {(['listen', 'repeat'] as const).map(p => (
                <div key={p} className={`flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all ${
                  phase === p
                    ? p === 'listen'
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-[#F59E0B] text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {p === 'listen' ? '1. Listen' : '2. Repeat'}
                </div>
              ))}
            </div>

            {/* Current segment spotlight */}
            <Card className={`mb-6 border-2 dark:bg-slate-900 transition-all ${
              phase === 'listen' ? 'border-[#4F46E5]/30' :
              phase === 'repeat' ? 'border-[#F59E0B]/30' :
              'border-[#10B981]/30'
            }`}>
              <CardContent className="p-6">
                <p className="text-base text-slate-900 dark:text-white leading-relaxed font-medium mb-5">
                  "{segment}"
                </p>

                <div className="flex justify-center mb-5">
                  <WaveformBars
                    active={isPlaying || isRecording}
                    color={isRecording ? '#EF4444' : '#4F46E5'}
                  />
                </div>

                {phase === 'listen' ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={isPlaying ? stopSpeech : speakSegment}
                      className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                    >
                      {isPlaying
                        ? <><Pause className="mr-2 h-4 w-4" /> Stop</>
                        : <><Volume2 className="mr-2 h-4 w-4" /> Listen</>
                      }
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { stopSpeech(); setPhase('repeat') }}
                      className="border-slate-200 text-slate-500 dark:text-slate-400"
                    >
                      Skip to Repeat
                    </Button>
                  </div>
                ) : phase === 'repeat' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
                      Now say it yourself — as closely as you can
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setIsRecording(r => !r)}
                        className={`flex-1 ${isRecording ? 'bg-[#EF4444] hover:bg-red-600' : 'bg-[#F59E0B] hover:bg-amber-600'} text-white`}
                      >
                        {isRecording
                          ? <><MicOff className="mr-2 h-4 w-4" /> Stop Recording</>
                          : <><Mic className="mr-2 h-4 w-4" /> Record Repeat</>
                        }
                      </Button>
                      <Button onClick={speakSegment} variant="outline" size="icon" className="border-slate-200 text-slate-500 dark:text-slate-400" title="Listen again">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={advanceSegment} className="w-full bg-[#10B981] hover:bg-emerald-600 text-white">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {isLastSegment ? 'Complete Answer' : 'Next Segment'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <p className="text-sm font-semibold text-[#10B981]">Answer complete!</p>
                    <Button onClick={nextQuestion} className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                      {isLastQuestion ? 'Finish Session' : 'Next Question'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All segments list */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Answer segments</p>
              {item.segments.map((seg, i) => (
                <SegmentRow
                  key={i}
                  text={seg}
                  index={i}
                  isActive={i === segmentIdx}
                  isDone={i < segmentIdx || phase === 'done'}
                  phase={phase}
                />
              ))}
            </div>

            {/* Full answer toggle */}
            <button
              onClick={() => setShowFullAnswer(v => !v)}
              className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white mb-2"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {showFullAnswer ? 'Hide' : 'View'} full model answer
            </button>
            {showFullAnswer && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.modelAnswer}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </AppShell>
  )
}
