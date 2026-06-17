'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Upload, FileText, Briefcase, Mic, Clock, Zap,
  ChevronRight, ChevronLeft, X, RefreshCw, Pin,
  Volume2, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { INTERVIEWER_VOICES } from '@/types'
import { AppShell } from '@/components/AppShell'

const STEPS = ['Documents', 'Questions', 'Configure', 'Audio Check']

const MOCK_QUESTIONS = [
  { id: '1', text: 'Tell me about a time you led a cross-functional project. What was the outcome?', category: 'behavioral', difficulty: 3, pinned: false },
  { id: '2', text: 'How do you prioritize features when engineering resources are constrained?', category: 'situational', difficulty: 4, pinned: false },
  { id: '3', text: 'Walk me through how you would design a payment flow for a marketplace.', category: 'technical', difficulty: 4, pinned: false },
  { id: '4', text: 'What is your approach to building alignment across stakeholders with competing priorities?', category: 'behavioral', difficulty: 3, pinned: true },
  { id: '5', text: "Describe Stripe's core product and how you'd improve the developer onboarding experience.", category: 'culture', difficulty: 3, pinned: false },
  { id: '6', text: 'What is your biggest professional weakness and how are you actively working on it?', category: 'weakness', difficulty: 2, pinned: false },
]

const CATEGORY_COLORS: Record<string, string> = {
  behavioral: 'bg-[#4F46E5]/10 text-[#4F46E5]',
  situational: 'bg-[#10B981]/10 text-[#10B981]',
  technical: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  culture: 'bg-[#6366f1]/10 text-[#6366f1]',
  weakness: 'bg-[#64748B]/10 text-[#64748B]',
  closing: 'bg-[#EF4444]/10 text-[#EF4444]',
}

const DIFFICULTY_DOTS = (d: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < d ? 'bg-[#F59E0B]' : 'bg-slate-200'}`} />
  ))

export default function SessionSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState(MOCK_QUESTIONS)
  const [config, setConfig] = useState({
    duration: 30,
    mode: 'solo',
    persona: 'friendly_hr',
    voiceId: 'voice_1',
    nervousMode: false,
  })
  const [micOk, setMicOk] = useState(false)

  const generateQuestions = async () => {
    if (!resumeText.trim() || !jdText.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    setStep(1)
  }

  const togglePin = (id: string) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, pinned: !q.pinned } : q))

  const removeQuestion = (id: string) =>
    setQuestions(qs => qs.filter(q => q.id !== id || q.pinned))

  const startSession = () => router.push('/session/live')

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      {/* Top bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111118] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i === step ? 'bg-[#4F46E5] text-white' : i < step ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-400'
              }`}>{i + 1}</div>
              <span className={`hidden sm:block text-sm ${i === step ? 'font-semibold text-[#1E1B4B]' : 'text-[#64748B]'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
            </div>
          ))}
        </div>
        <div className="w-24" />
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">

        {/* Step 0 — Documents */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">Upload your documents</h1>
              <p className="text-[#64748B]">Your resume + the job description = a perfectly tailored interview.</p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5]/10">
                  <FileText className="h-5 w-5 text-[#4F46E5]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1B4B]">Your Resume</p>
                  <p className="text-xs text-[#64748B]">Paste the text content of your resume below</p>
                </div>
              </div>
              <Textarea
                placeholder="Paste your resume text here... (name, experience, skills, education)"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="min-h-40 resize-none border-slate-200 focus:border-[#4F46E5] text-sm"
              />
              {resumeText && (
                <p className="mt-2 text-xs text-[#10B981] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  {resumeText.split(' ').length} words detected
                </p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10">
                  <Briefcase className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1E1B4B]">Job Description</p>
                  <p className="text-xs text-[#64748B]">Paste the full job description</p>
                </div>
              </div>
              <Textarea
                placeholder="Paste the job description here..."
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                className="min-h-40 resize-none border-slate-200 focus:border-[#4F46E5] text-sm"
              />
            </div>

            <Button
              onClick={generateQuestions}
              disabled={!resumeText.trim() || !jdText.trim() || generating}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-6 text-base font-semibold rounded-xl"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing documents & generating questions...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate My Question Bank
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 1 — Questions */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">Your question bank</h1>
              <p className="text-[#64748B]">
                {questions.length} tailored questions generated. Pin to keep, tap × to remove.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {questions.map(q => (
                <div
                  key={q.id}
                  className={`rounded-xl border bg-white p-4 transition-colors ${
                    q.pinned ? 'border-[#4F46E5]/30 bg-[#4F46E5]/3' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[q.category]}`}>
                          {q.category}
                        </span>
                        <div className="flex items-center gap-0.5">{DIFFICULTY_DOTS(q.difficulty)}</div>
                      </div>
                      <p className="text-sm text-[#1E1B4B] leading-relaxed">{q.text}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => togglePin(q.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          q.pinned ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'text-slate-300 hover:text-[#4F46E5]'
                        }`}
                        title={q.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        disabled={q.pinned}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-[#EF4444] disabled:opacity-30 transition-colors"
                        title="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="border-slate-200">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              >
                Configure Session <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Configure */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">Configure your session</h1>
              <p className="text-[#64748B]">Choose your settings for today's mock interview.</p>
            </div>

            <div className="space-y-6">
              {/* Duration */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-[#4F46E5]" />
                  <p className="font-semibold text-[#1E1B4B]">Session Duration</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig(c => ({ ...c, duration: d }))}
                      className={`rounded-xl border-2 py-3 text-sm font-semibold transition-colors ${
                        config.duration === d
                          ? 'border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]'
                          : 'border-slate-200 text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-semibold text-[#1E1B4B] mb-4">Interview Mode</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'solo', label: 'Solo Mode', desc: 'One-on-one with AI interviewer' },
                    { id: 'panel', label: 'Panel Mode', desc: '2 AI voices alternating questions' },
                    { id: 'stress', label: 'Stress Mode', desc: 'Pressure, interruptions, silence drops' },
                    { id: 'shadow', label: 'Shadow Mode', desc: 'Micro-feedback after each answer' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setConfig(c => ({ ...c, mode: m.id }))}
                      className={`text-left rounded-xl border-2 p-4 transition-colors ${
                        config.mode === m.id
                          ? 'border-[#4F46E5] bg-[#4F46E5]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${config.mode === m.id ? 'text-[#4F46E5]' : 'text-[#1E1B4B]'}`}>{m.label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-semibold text-[#1E1B4B] mb-4">AI Interviewer Voice</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERVIEWER_VOICES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setConfig(c => ({ ...c, voiceId: v.id }))}
                      className={`text-left rounded-xl border-2 p-3 transition-colors ${
                        config.voiceId === v.id
                          ? 'border-[#4F46E5] bg-[#4F46E5]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          config.voiceId === v.id ? 'bg-[#4F46E5]' : 'bg-slate-300'
                        }`}>
                          {v.name[0]}
                        </div>
                        <p className="text-sm font-semibold text-[#1E1B4B]">{v.name}</p>
                      </div>
                      <p className="text-xs text-[#64748B]">{v.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nervous mode toggle */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1E1B4B]">Nervous Mode</p>
                  <p className="text-sm text-[#64748B]">Adds intentional pause and pressure cues</p>
                </div>
                <button
                  onClick={() => setConfig(c => ({ ...c, nervousMode: !c.nervousMode }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    config.nervousMode ? 'bg-[#4F46E5]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    config.nervousMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="border-slate-200">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              >
                Check Audio <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Audio Check */}
        {step === 3 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">Mic check</h1>
            <p className="text-[#64748B] mb-10">Make sure your audio is working before we start.</p>

            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-6">
                <div className="flex justify-center mb-6">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                    micOk ? 'border-[#10B981] bg-[#10B981]/10' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <Mic className={`h-8 w-8 ${micOk ? 'text-[#10B981]' : 'text-slate-400'}`} />
                  </div>
                </div>

                {micOk ? (
                  <div className="flex justify-center items-end gap-1 h-12 mb-4">
                    {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                      <div
                        key={i}
                        className="wave-bar w-2 rounded-full bg-[#10B981]"
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#64748B] mb-4">Click below to test your microphone</p>
                )}

                <Button
                  onClick={() => setMicOk(true)}
                  variant={micOk ? 'outline' : 'default'}
                  className={micOk ? 'border-[#10B981] text-[#10B981] w-full' : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white w-full'}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  {micOk ? 'Audio Confirmed ✓' : 'Test Microphone'}
                </Button>
              </div>

              <div className="rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 p-4 flex gap-3 mb-8 text-left">
                <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#92400E]">
                  Use headphones for the best experience. Find a quiet space — background noise affects your confidence score.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="border-slate-200">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={startSession}
                  disabled={!micOk}
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-5"
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Start Interview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AppShell>
  )
}
