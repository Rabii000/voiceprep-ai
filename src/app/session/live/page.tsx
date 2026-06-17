'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, SkipForward, Square, Volume2, Clock, Wifi, WifiOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfidenceMeter from '@/components/ConfidenceMeter'

// ─── ElevenLabs Conversational AI ──────────────────────────────
// Uses the @elevenlabs/client SDK (web SDK for browser)
// Falls back to mock mode when ELEVENLABS_AGENT_ID is not set

const MOCK_QUESTIONS = [
  'Tell me about yourself and why you\'re interested in this role.',
  'Walk me through a time you had to make a difficult decision with incomplete data.',
  'How do you prioritize features when engineering resources are constrained?',
  'Describe a project where you had to align stakeholders with competing priorities.',
  'What metrics would you use to measure the success of a new feature?',
]

const MOCK_CHUNKS = [
  'Sure, happy to share that. I\'ve been working in product for six years,',
  ' most recently at a fintech startup where I led the core payments team.',
  ' What brought me to apply here specifically is the opportunity to work on infrastructure',
  ' that really matters — the kind of product that founders depend on every day.',
]

function WaveformBars({ active, color = '#4F46E5' }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${active ? 'wave-bar' : ''}`}
          style={{
            height: active ? `${20 + Math.random() * 80}%` : '15%',
            background: active ? color : 'rgba(255,255,255,0.12)',
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  )
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

function LiveSessionInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [fillerCount, setFillerCount] = useState(0)
  const [skipped, setSkipped] = useState<number[]>([])
  const [sessionEnded, setSessionEnded] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [mode] = useState<'elevenlabs' | 'mock'>(agentId ? 'elevenlabs' : 'mock')
  const [currentWpm, setCurrentWpm] = useState(140)

  const transcriptRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef<{ endSession: () => void } | null>(null)
  const mockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── ElevenLabs WebSocket connection ────────────────────────
  const startElevenLabsSession = useCallback(async () => {
    if (!agentId) return
    setConnectionStatus('connecting')
    try {
      // Dynamic import to avoid SSR issues
      const { Conversation } = await import('@11labs/client')

      const conversation = await Conversation.startSession({
        agentId,
        connectionType: 'webrtc' as const,
        dynamicVariables: {
          candidate_name: searchParams.get('name') ?? 'candidate',
          target_role: searchParams.get('role') ?? 'the role',
          questions: MOCK_QUESTIONS.join(' | '),
        },
        onConnect: () => {
          setConnectionStatus('connected')
          setIsSpeaking(true)
        },
        onDisconnect: () => {
          setConnectionStatus('disconnected')
          setIsListening(false)
          setIsSpeaking(false)
        },
        onError: (err: unknown) => {
          console.error('[ElevenLabs]', err)
          setConnectionStatus('error')
        },
        onModeChange: ({ mode: m }: { mode: string }) => {
          setIsSpeaking(m === 'speaking')
          setIsListening(m === 'listening')
        },
        onMessage: ({ source, message }: { source: string; message: string }) => {
          if (source === 'user') {
            setTranscript(prev => prev + ' ' + message)
            const fillers = (message.match(/\b(um|uh|like|you know|basically|literally)\b/gi) ?? []).length
            if (fillers > 0) setFillerCount(c => c + fillers)
            const words = message.split(' ').length
            setCurrentWpm(Math.min(220, Math.max(80, Math.round(words * 4))))
          }
        },
      })

      conversationRef.current = { endSession: () => conversation.endSession() }
    } catch (err) {
      console.error('[ElevenLabs connection failed]', err)
      setConnectionStatus('error')
    }
  }, [agentId, searchParams])

  // ── Mock mode simulation ───────────────────────────────────
  const runMockQuestion = useCallback(() => {
    setIsSpeaking(true)
    setIsListening(false)
    setTranscript('')

    mockTimerRef.current = setTimeout(() => {
      setIsSpeaking(false)
      setIsListening(true)
      let i = 0
      const run = () => {
        if (i < MOCK_CHUNKS.length) {
          setTranscript(t => t + MOCK_CHUNKS[i])
          i++
          if (Math.random() > 0.8) setFillerCount(c => c + 1)
          mockTimerRef.current = setTimeout(run, 1000)
        }
      }
      run()
    }, 2800)
  }, [])

  useEffect(() => {
    if (mode === 'elevenlabs') {
      startElevenLabsSession()
    } else {
      setConnectionStatus('connected')
      runMockQuestion()
    }

    return () => {
      if (conversationRef.current) conversationRef.current.endSession()
      if (mockTimerRef.current) clearTimeout(mockTimerRef.current)
    }
  }, [mode, startElevenLabsSession, runMockQuestion])

  // Timer
  useEffect(() => {
    if (sessionEnded) return
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [sessionEnded])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const nextQuestion = () => {
    if (questionIndex < MOCK_QUESTIONS.length - 1) {
      setTranscript('')
      setFillerCount(0)
      setQuestionIndex(i => i + 1)
      if (mode === 'mock') runMockQuestion()
    } else {
      endSession()
    }
  }

  const skipQuestion = () => {
    setSkipped(s => [...s, questionIndex])
    nextQuestion()
  }

  const endSession = () => {
    setSessionEnded(true)
    if (conversationRef.current) conversationRef.current.endSession()
    setTimeout(() => router.push('/scorecard/demo'), 1800)
  }

  const progress = ((questionIndex + 1) / MOCK_QUESTIONS.length) * 100

  // ── Session ended overlay ──────────────────────────────────
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#10B981]/15 flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Session complete</h1>
          <p className="text-slate-400">Building your scorecard...</p>
          <div className="mt-6 h-px w-48 mx-auto bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#4F46E5]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0910] flex flex-col select-none">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#0f0e1a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="recording-pulse h-2.5 w-2.5 rounded-full bg-[#EF4444] flex-shrink-0" />
          <span className="text-sm font-semibold text-white">Live Session</span>
          {/* Connection indicator */}
          <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            connectionStatus === 'connected'
              ? 'text-[#10B981] bg-[#10B981]/10'
              : connectionStatus === 'connecting'
              ? 'text-[#F59E0B] bg-[#F59E0B]/10'
              : 'text-[#EF4444] bg-[#EF4444]/10'
          }`}>
            {connectionStatus === 'connected' ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
            {connectionStatus === 'connected' ? (mode === 'elevenlabs' ? 'ElevenLabs' : 'Demo') : connectionStatus}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xl font-black tabular-nums">
          <Clock className="h-4 w-4 text-slate-600" />
          <span className={timeLeft < 300 ? 'text-[#EF4444]' : 'text-white'}>{formatTime(timeLeft)}</span>
        </div>

        <Button
          onClick={endSession}
          size="sm"
          className="border border-[#EF4444]/30 bg-transparent text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/60 text-xs gap-1.5"
        >
          <Square className="h-3 w-3 fill-current" />
          End
        </Button>
      </header>

      {/* Progress */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5">
          <span>Question {questionIndex + 1} / {MOCK_QUESTIONS.length}</span>
          {skipped.length > 0 && <span>{skipped.length} skipped</span>}
        </div>
        <div className="h-[2px] w-full bg-white/6 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#4F46E5] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Interview panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* AI avatar */}
          <motion.div
            animate={isSpeaking ? { scale: [1, 1.04, 1], boxShadow: ['0 0 0 0 rgba(79,70,229,0)', '0 0 0 16px rgba(79,70,229,0.15)', '0 0 0 0 rgba(79,70,229,0)'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative mb-7"
          >
            <div className={`h-[88px] w-[88px] rounded-full flex items-center justify-center transition-all duration-300 ${
              isSpeaking
                ? 'bg-gradient-to-br from-[#4F46E5] to-[#6366f1] shadow-xl shadow-[#4F46E5]/30'
                : 'bg-white/8 border border-white/12'
            }`}>
              <Volume2 className={`h-8 w-8 transition-colors ${isSpeaking ? 'text-white' : 'text-slate-600'}`} />
            </div>
          </motion.div>

          {/* Status label */}
          <div className="flex items-center gap-2 mb-6 h-6">
            <AnimatePresence mode="wait">
              {isSpeaking && (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 text-[#4F46E5] text-sm font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
                  Alex is speaking
                </motion.div>
              )}
              {isListening && (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 text-[#10B981] text-sm font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Your turn
                </motion.div>
              )}
              {!isSpeaking && !isListening && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-600 text-sm">
                  Ready
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={questionIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center text-white text-lg font-medium leading-relaxed max-w-lg mb-8"
            >
              "{MOCK_QUESTIONS[questionIndex]}"
            </motion.p>
          </AnimatePresence>

          {/* User waveform */}
          <div className="mb-6">
            <WaveformBars active={isListening} color="#10B981" />
          </div>

          {/* Mic indicator */}
          <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-8 transition-all duration-300 border-2 ${
            isListening
              ? 'border-[#10B981] bg-[#10B981]/10 shadow-lg shadow-[#10B981]/20'
              : 'border-white/10 bg-white/4'
          }`}>
            {isListening
              ? <Mic className="h-5 w-5 text-[#10B981]" />
              : <MicOff className="h-5 w-5 text-slate-600" />
            }
          </div>

          {/* Confidence meter */}
          <div className="mb-8 w-full max-w-xs">
            <ConfidenceMeter isActive={isListening} wpm={currentWpm} pauseFreq={1.1} fillerRate={fillerCount * 0.5} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={skipQuestion}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
            >
              <SkipForward className="h-3.5 w-3.5" />
              Skip
            </button>
            <button
              onClick={nextQuestion}
              disabled={isSpeaking}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next question →
            </button>
          </div>
        </div>

        {/* Transcript sidebar */}
        <div className="lg:w-80 border-l border-white/8 bg-black/25 flex flex-col">
          <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Transcript</p>
            <span className="text-[10px] text-slate-600">Filler: <span className={fillerCount > 5 ? 'text-[#EF4444]' : fillerCount > 2 ? 'text-[#F59E0B]' : 'text-[#10B981]'}>{fillerCount}</span></span>
          </div>

          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4">
            {transcript ? (
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {transcript.split(/(um|uh|like|you know|basically|literally)/gi).map((part, i) =>
                  /^(um|uh|like|you know|basically|literally)$/i.test(part) ? (
                    <mark key={i} className="bg-[#F59E0B]/25 text-[#F59E0B] rounded px-0.5 not-italic">{part}</mark>
                  ) : <span key={i}>{part}</span>
                )}
                {isListening && <span className="cursor-blink text-[#10B981] ml-0.5">|</span>}
              </p>
            ) : (
              <p className="text-xs text-slate-600 italic mt-2">Transcript appears here as you speak...</p>
            )}
          </div>

          {/* Live stats */}
          <div className="border-t border-white/8 grid grid-cols-3 divide-x divide-white/8">
            {[
              { label: 'Q', value: `${questionIndex + 1}/${MOCK_QUESTIONS.length}`, color: 'text-slate-300' },
              { label: 'WPM', value: isListening ? currentWpm : '—', color: currentWpm > 180 ? 'text-[#EF4444]' : currentWpm < 110 ? 'text-[#F59E0B]' : 'text-[#10B981]' },
              { label: 'Fillers', value: fillerCount, color: fillerCount > 5 ? 'text-[#EF4444]' : fillerCount > 2 ? 'text-[#F59E0B]' : 'text-[#10B981]' },
            ].map(s => (
              <div key={s.label} className="py-3 text-center">
                <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LiveSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0910]" />}>
      <LiveSessionInner />
    </Suspense>
  )
}
