'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronLeft, BarChart3, Mic, Play, MessageSquare,
  TrendingUp, Award, AlertCircle, CheckCircle2, Clock,
  SkipForward, Volume2, GitCompare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AppShell } from '@/components/AppShell'

const SCORECARD_DATA = {
  overall: 78,
  completeness: 82,
  star_compliance: 74,
  filler_rate: 4.2,
  confidence: 81,
  talk_time: 76,
  skipped: 1,
  role: 'Senior Product Manager',
  company: 'Stripe',
  date: 'Jun 15, 2026',
  duration: '30 min',
  mode: 'Solo Mode',
  coach_summary:
    'Strong overall performance with clear communication and confident delivery. Your behavioral answers were well-structured but occasionally lacked quantifiable outcomes. Focus on tightening your STAR closings — the Result component was often vague. Filler word rate is improving from your last session (6.1 → 4.2). Your strongest area was situational reasoning; your weakest was technical depth in system design.',
  questions: [
    {
      id: 'q1',
      text: 'Tell me about yourself and what brought you to apply for this role at Stripe.',
      category: 'behavioral',
      score: 85,
      answer: 'I\'ve been in product for six years, most recently at a fintech startup where I led growth...',
      feedback: 'Excellent opening — clear narrative arc with strong motivation link to the company mission.',
      strengths: ['Confident delivery', 'Company-specific motivation', 'Concise under 90 seconds'],
      improvements: ['Add a specific metric from your current role early on'],
      suggested_rewrite: null,
      skipped: false,
    },
    {
      id: 'q2',
      text: 'Walk me through a time you had to make a difficult product decision with incomplete data.',
      category: 'behavioral',
      score: 72,
      answer: 'We had a decision about whether to build native mobile or continue with our PWA...',
      feedback: 'Good Situation and Task setup. However, the Action was detailed but the Result lacked numbers — what was the actual outcome?',
      strengths: ['Clear problem framing', 'Good stakeholder context'],
      improvements: ['Quantify the result (e.g., "reduced churn by 12%")', 'STAR Result component was vague'],
      suggested_rewrite: 'Situation: In Q3 2024, with 60% of users on mobile and growing churn... [add specific metric for outcome]',
      skipped: false,
    },
    {
      id: 'q3',
      text: 'How do you prioritize features when engineering resources are constrained?',
      category: 'situational',
      score: 88,
      answer: 'I use a combination of RICE scoring and user impact mapping...',
      feedback: 'Outstanding answer. Demonstrated deep PM methodology fluency with a specific real-world example.',
      strengths: ['Framework-first thinking', 'Real example backing', 'Confident delivery', 'Under 2 minutes'],
      improvements: ['Could have acknowledged team buy-in process'],
      suggested_rewrite: null,
      skipped: false,
    },
    {
      id: 'q4',
      text: 'What metrics would you use to measure the success of a new payment feature?',
      category: 'technical',
      score: 65,
      answer: 'I would look at conversion rate and error rates...',
      feedback: 'Answer was too high-level for a Stripe interview. Expected deeper payment-specific metric fluency.',
      strengths: ['Mentioned conversion rate'],
      improvements: ['Add: authorization rate, chargeback rate, p95 latency, decline codes', 'Show Stripe product knowledge'],
      suggested_rewrite: 'I\'d start with authorization rate as the north star, then segment by: error codes (4xx vs 5xx), payment method mix, fraud rate (dispute ratio), and p95 latency...',
      skipped: false,
    },
    {
      id: 'q5',
      text: 'Describe a project where you had to align multiple stakeholders with competing priorities.',
      category: 'behavioral',
      score: 0,
      answer: '',
      feedback: 'Question was skipped.',
      strengths: [],
      improvements: ['Practice this — stakeholder alignment is a core PM competency'],
      suggested_rewrite: null,
      skipped: true,
    },
  ],
}

const CATEGORY_COLORS: Record<string, string> = {
  behavioral: 'bg-[#4F46E5]/10 text-[#4F46E5]',
  situational: 'bg-[#10B981]/10 text-[#10B981]',
  technical: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  culture: 'bg-[#6366f1]/10 text-[#6366f1]',
  weakness: 'bg-[#64748B]/10 text-slate-500 dark:text-slate-400',
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="50" y="56" textAnchor="middle" className="rotate-90" fill="currentColor"
        style={{ transform: 'rotate(90deg) translate(0px, -100px)', fontWeight: 700, fontSize: 22 }}>
        {score}
      </text>
    </svg>
  )
}

export default function ScorecardPage() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const data = SCORECARD_DATA

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111118] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.role} · {data.company}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{data.date} · {data.duration} · {data.mode}</p>
        </div>
        <Link href="/session">
          <Button size="sm" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
            <Mic className="mr-1.5 h-3.5 w-3.5" />
            Practice Again
          </Button>
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />Overview
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />Per Question
            </TabsTrigger>
            <TabsTrigger value="audio" className="rounded-lg data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <Play className="mr-1.5 h-3.5 w-3.5" />Audio Playback
            </TabsTrigger>
            <TabsTrigger value="coach" className="rounded-lg data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <Award className="mr-1.5 h-3.5 w-3.5" />AI Coach Notes
            </TabsTrigger>
            <TabsTrigger value="compare" className="rounded-lg data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <GitCompare className="mr-1.5 h-3.5 w-3.5" />Compare
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            {/* Score hero */}
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <ScoreRing score={data.overall} size={140} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">{data.overall}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">Overall Score</p>
                    <Badge className="mt-1 bg-[#10B981]/10 text-[#10B981] border-0">
                      {data.overall >= 80 ? 'Excellent' : data.overall >= 65 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {[
                      { label: 'Answer Completeness', value: data.completeness, icon: CheckCircle2, color: 'text-[#10B981]' },
                      { label: 'STAR Compliance', value: data.star_compliance, icon: TrendingUp, color: 'text-[#4F46E5]' },
                      { label: 'Confidence Score', value: data.confidence, icon: Award, color: 'text-[#6366f1]' },
                      { label: 'Talk Time Balance', value: data.talk_time, icon: Clock, color: 'text-[#F59E0B]' },
                    ].map(m => (
                      <div key={m.label} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{m.label}</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{m.value}%</span>
                        </div>
                        <Progress value={m.value} className="h-1.5" />
                      </div>
                    ))}

                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Filler Word Rate</p>
                      <p className={`text-lg font-bold ${data.filler_rate < 3 ? 'text-[#10B981]' : data.filler_rate < 6 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {data.filler_rate}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Questions Skipped</p>
                      <p className="text-lg font-bold text-[#EF4444]">{data.skipped}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 3 + Bottom 3 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-[#10B981]/20 bg-[#10B981]/3 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-[#10B981] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Strongest Answers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.questions.filter(q => !q.skipped).sort((a, b) => b.score - a.score).slice(0, 3).map(q => (
                    <div key={q.id} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#10B981] mt-0.5">{q.score}</span>
                      <p className="text-xs text-slate-900 dark:text-white leading-relaxed">{q.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-[#F59E0B]/20 bg-[#F59E0B]/3 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-[#F59E0B] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.questions.sort((a, b) => a.score - b.score).slice(0, 3).map(q => (
                    <div key={q.id} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#F59E0B] mt-0.5">{q.skipped ? '–' : q.score}</span>
                      <p className="text-xs text-slate-900 dark:text-white leading-relaxed">{q.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PER-QUESTION TAB */}
          <TabsContent value="questions">
            <div className="space-y-4">
              {data.questions.map((q, i) => (
                <Card key={q.id} className={`border shadow-sm ${q.skipped ? 'border-slate-200 opacity-60' : 'border-slate-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        q.skipped ? 'bg-slate-100 text-slate-400' :
                        q.score >= 80 ? 'bg-[#10B981]/10 text-[#10B981]' :
                        q.score >= 65 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {q.skipped ? <SkipForward className="h-4 w-4" /> : q.score}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[q.category] || 'bg-slate-100 text-slate-600'}`}>
                            {q.category}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Q{i + 1}</span>
                          {q.skipped && <Badge className="bg-slate-100 text-slate-500 border-0 text-xs">Skipped</Badge>}
                        </div>

                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">"{q.text}"</p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{q.feedback}</p>

                        {(q.strengths.length > 0 || q.improvements.length > 0) && (
                          <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            {q.strengths.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#10B981] mb-1.5">What worked</p>
                                <ul className="space-y-1">
                                  {q.strengths.map((s, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-slate-900 dark:text-white">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {q.improvements.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#F59E0B] mb-1.5">Improve this</p>
                                <ul className="space-y-1">
                                  {q.improvements.map((s, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-slate-900 dark:text-white">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B] flex-shrink-0" />
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {q.suggested_rewrite && (
                          <div className="rounded-lg bg-[#4F46E5]/5 border border-[#4F46E5]/10 p-3">
                            <p className="text-xs font-semibold text-[#4F46E5] mb-1">Suggested STAR rewrite</p>
                            <p className="text-xs text-slate-900 dark:text-white leading-relaxed italic">"{q.suggested_rewrite}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AUDIO TAB */}
          <TabsContent value="audio">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 dark:text-white">Full Session Playback</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Audio player mockup */}
                <div className="rounded-xl bg-[#1E1B4B] p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] hover:bg-[#4338CA] transition-colors">
                      <Play className="h-4 w-4 text-white ml-0.5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-end gap-0.5 h-8 mb-1">
                        {Array.from({ length: 60 }, (_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full bg-[#4F46E5]/40"
                            style={{ height: `${20 + Math.sin(i * 0.5) * 60 + Math.random() * 20}%` }}
                          />
                        ))}
                      </div>
                      <div className="h-0.5 bg-white/10 rounded-full">
                        <div className="h-full w-[35%] bg-[#4F46E5] rounded-full" />
                      </div>
                    </div>
                    <div className="font-mono text-sm text-white">10:24 / 28:11</div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button className="px-3 py-1 rounded-full bg-white/10 text-slate-300 hover:bg-white/20">0.75×</button>
                    <button className="px-3 py-1 rounded-full bg-[#4F46E5] text-white">1×</button>
                    <button className="px-3 py-1 rounded-full bg-white/10 text-slate-300 hover:bg-white/20">1.25×</button>
                    <button className="px-3 py-1 rounded-full bg-white/10 text-slate-300 hover:bg-white/20">1.5×</button>
                  </div>
                </div>

                {/* Jump to question markers */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Jump to Question</p>
                <div className="space-y-2">
                  {data.questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setPlayingId(q.id)}
                      className={`w-full text-left rounded-lg border px-4 py-3 flex items-center gap-3 transition-colors ${
                        playingId === q.id
                          ? 'border-[#4F46E5]/40 bg-[#4F46E5]/5'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {playingId === q.id ? <Volume2 className="h-3 w-3 text-[#4F46E5]" /> : i + 1}
                      </div>
                      <span className="text-sm text-slate-900 dark:text-white truncate flex-1">{q.text}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{`0${i + 1}:${String(i * 4 + 12).padStart(2, '0')}`}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPARE TAB */}
          <TabsContent value="compare">
            <div className="space-y-4">
              <div className="rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/10 p-3 text-xs text-slate-500 dark:text-slate-400">
                Side-by-side view of your spoken answer versus the AI-generated model answer.
                Word-level differences are highlighted.
              </div>
              {data.questions.filter(q => !q.skipped).slice(0, 3).map(q => (
                <Card key={q.id} className="border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">"{q.text}"</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Your answer */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />
                          <p className="text-xs font-bold text-[#4F46E5]">Your answer</p>
                          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                            q.score >= 80 ? 'bg-[#10B981]/10 text-[#10B981]' :
                            q.score >= 65 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            'bg-[#EF4444]/10 text-[#EF4444]'
                          }`}>{q.score}</span>
                        </div>
                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 text-xs text-slate-900 dark:text-white leading-relaxed min-h-[80px]">
                          {q.answer || <span className="text-slate-400 italic">No transcript recorded</span>}
                        </div>
                      </div>
                      {/* Model answer */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                          <p className="text-xs font-bold text-[#10B981]">Model answer</p>
                          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold bg-[#10B981]/10 text-[#10B981]">100</span>
                        </div>
                        <div className="rounded-lg bg-[#10B981]/5 border border-[#10B981]/10 p-3 text-xs text-slate-900 dark:text-white leading-relaxed min-h-[80px]">
                          {q.suggested_rewrite ??
                            "Strong, structured response that opens with context, demonstrates clear action using the STAR framework, and closes with a quantified result. The tone is confident without being arrogant."
                          }
                        </div>
                      </div>
                    </div>
                    {/* Key delta */}
                    {q.improvements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-semibold text-[#F59E0B] mb-1">Key gap</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{q.improvements[0]}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI COACH TAB */}
          <TabsContent value="coach">
            <div className="space-y-4">
              <Card className="border-[#4F46E5]/20 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#4F46E5]" />
                    AI Coach Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{data.coach_summary}</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { priority: 'High', text: 'Practice the "skipped" stakeholder alignment question — it\'s a core PM competency at Stripe.' },
                      { priority: 'High', text: 'Add quantified results to your behavioral answers. Every STAR story should end with a number.' },
                      { priority: 'Medium', text: 'Study Stripe\'s payment metric vocabulary: authorization rate, decline codes, chargeback ratio.' },
                      { priority: 'Low', text: 'Continue reducing filler words. You\'re at 4.2% — target < 3% in your next session.' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold flex-shrink-0 ${
                          step.priority === 'High' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                          step.priority === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          'bg-[#10B981]/10 text-[#10B981]'
                        }`}>{step.priority}</span>
                        <p className="text-sm text-slate-900 dark:text-white">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Link href="/session" className="flex-1">
                  <Button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                    <Mic className="mr-2 h-4 w-4" />
                    Practice Again
                  </Button>
                </Link>
                <Button variant="outline" className="border-slate-200 text-slate-500 dark:text-slate-400">
                  Share Scorecard
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AppShell>
  )
}
