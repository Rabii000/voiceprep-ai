'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic, MicOff, SkipForward, Square, Volume2, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import ConfidenceMeter from '@/components/ConfidenceMeter'
import PronunciationCoach from '@/components/PronunciationCoach'

const MOCK_QUESTIONS = [
  "Tell me about yourself and what brought you to apply for this role at Stripe.",
  "Walk me through a time you had to make a difficult product decision with incomplete data.",
  "How do you prioritize features when engineering resources are constrained?",
  "Describe a project where you had to align multiple stakeholders with competing priorities.",
  "What metrics would you use to measure the success of a new payment feature?",
]

const MOCK_TRANSCRIPT_CHUNKS = [
  "Sure, I'd be happy to...",
  " I've been working in product management for about six years,",
  " most recently at a fintech startup where I led the growth team.",
  " What drew me to Stripe specifically is the developer-first philosophy...",
  " and the opportunity to work on infrastructure that powers real businesses.",
]

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-10">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all ${
            active ? 'bg-[#4F46E5] wave-bar' : 'bg-white/20'
          }`}
          style={{
            height: active ? `${30 + Math.random() * 70}%` : '20%',
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LiveSessionPage() {
  const router = useRouter()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [fillerCount, setFillerCount] = useState(0)
  const [skipped, setSkipped] = useState<number[]>([])
  const [sessionEnded, setSessionEnded] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Timer countdown
  useEffect(() => {
    if (sessionEnded) return
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [sessionEnded])

  // Simulate AI speaking then listening
  useEffect(() => {
    if (sessionEnded) return
    setIsSpeaking(true)
    setIsListening(false)
    const speakTimer = setTimeout(() => {
      setIsSpeaking(false)
      setIsListening(true)
      // Simulate user answering
      let i = 0
      const chunks = MOCK_TRANSCRIPT_CHUNKS
      const chunkTimer = setInterval(() => {
        if (i < chunks.length) {
          setTranscript(t => t + chunks[i])
          i++
          if (Math.random() > 0.8) setFillerCount(c => c + 1)
        } else {
          clearInterval(chunkTimer)
        }
      }, 900)
    }, 3000)
    return () => clearTimeout(speakTimer)
  }, [questionIndex, sessionEnded])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const nextQuestion = () => {
    if (questionIndex < MOCK_QUESTIONS.length - 1) {
      setTranscript('')
      setFillerCount(0)
      setQuestionIndex(i => i + 1)
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
    setTimeout(() => router.push('/scorecard/demo'), 1500)
  }

  const totalQuestions = MOCK_QUESTIONS.length
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  if (sessionEnded) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">Session Complete!</h1>
          <p className="text-slate-300">Generating your scorecard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0e1a] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="recording-pulse h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="text-sm font-medium text-white">Live Session</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-lg font-bold text-white">
          <Clock className="h-4 w-4 text-[#64748B]" />
          <span className={timeLeft < 300 ? 'text-[#EF4444]' : 'text-white'}>{formatTime(timeLeft)}</span>
        </div>

        <Button
          onClick={endSession}
          variant="outline"
          size="sm"
          className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10"
        >
          <Square className="mr-1.5 h-3.5 w-3.5" />
          End Session
        </Button>
      </header>

      {/* Progress */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          <span>{skipped.length} skipped</span>
        </div>
        <Progress value={progress} className="h-1 bg-white/10" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left — Interview area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* AI Avatar */}
          <div className={`relative mb-8 h-24 w-24 rounded-full flex items-center justify-center border-4 transition-all ${
            isSpeaking ? 'border-[#4F46E5] shadow-lg shadow-[#4F46E5]/40' : 'border-white/10'
          }`}>
            <div className="h-16 w-16 rounded-full bg-[#1E1B4B] flex items-center justify-center">
              <Volume2 className={`h-7 w-7 ${isSpeaking ? 'text-[#4F46E5]' : 'text-slate-600'}`} />
            </div>
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full border-4 border-[#4F46E5]/40 animate-ping" />
            )}
          </div>

          {/* AI interviewer label */}
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-[#4F46E5]/20 text-[#6366f1] border-0">
              AI Interviewer · Alex
            </Badge>
            {isSpeaking && (
              <span className="text-xs text-slate-500 animate-pulse">Speaking...</span>
            )}
            {isListening && (
              <span className="text-xs text-[#10B981]">Listening...</span>
            )}
          </div>

          {/* Question */}
          <div className="max-w-xl text-center mb-8">
            <p className="text-lg font-medium text-white leading-relaxed">
              "{MOCK_QUESTIONS[questionIndex]}"
            </p>
          </div>

          {/* User waveform */}
          <div className="flex flex-col items-center gap-3">
            <WaveformBars active={isListening} />
            <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
              isListening
                ? 'border-[#10B981] bg-[#10B981]/10 shadow-lg shadow-[#10B981]/30'
                : 'border-white/10 bg-white/5'
            }`}>
              {isListening ? (
                <Mic className="h-6 w-6 text-[#10B981]" />
              ) : (
                <MicOff className="h-6 w-6 text-slate-600" />
              )}
            </div>
          </div>

          {/* Live metrics row */}
          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">Filler Words</p>
              <p className={`font-bold font-mono ${fillerCount > 5 ? 'text-[#EF4444]' : fillerCount > 2 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                {fillerCount}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">Confidence</p>
              <p className="font-bold font-mono text-[#10B981]">High</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">STAR</p>
              <p className="font-bold font-mono text-[#4F46E5]">Partial</p>
            </div>
          </div>

          {/* Confidence Meter widget */}
          <div className="mt-5">
            <ConfidenceMeter isActive={isListening} wpm={148} pauseFreq={1.2} fillerRate={fillerCount * 0.8} />
          </div>

          {/* Controls */}
          <div className="mt-8 flex gap-3">
            <Button
              onClick={skipQuestion}
              variant="outline"
              className="border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <SkipForward className="mr-1.5 h-4 w-4" />
              Skip
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={isSpeaking}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            >
              Next Question
            </Button>
          </div>
        </div>

        {/* Right — Live transcript */}
        <div className="lg:w-80 border-l border-white/10 bg-black/20 flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Transcript</p>
          </div>
          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {transcript ? (
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {transcript.split(/(um|uh|like|you know)/gi).map((part, i) =>
                  /^(um|uh|like|you know)$/i.test(part) ? (
                    <mark key={i} className="bg-[#F59E0B]/30 text-[#F59E0B] rounded px-0.5">{part}</mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            ) : (
              <p className="text-xs text-slate-600 italic">Transcript will appear here as you speak...</p>
            )}
          </div>

          {/* Pronunciation coach panel */}
          <div className="border-t border-white/10 p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pronunciation Flags</p>
            <div className="space-y-1.5">
              {[
                { word: 'specifically', count: 3 },
                { word: 'prioritisation', count: 2 },
              ].map(w => (
                <div key={w.word} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                  <span className="text-xs text-slate-300 font-mono">{w.word}</span>
                  <span className="text-xs text-[#F59E0B] font-bold">{w.count}×</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
