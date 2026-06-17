'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Play, Pause, Star, StarOff, Trash2,
  Search, Filter, Mic, TrendingUp, BookOpen, Clock,
  ChevronRight, Download, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AppShell } from '@/components/AppShell'

interface AnswerEntry {
  id: string
  question: string
  category: string
  date: string
  duration: number        // seconds
  score: number
  isGoldMaster: boolean
  fillerRate: number
  confidenceScore: number
  wpm: number
  transcript: string
  sessionRole: string
  sessionCompany: string
  improvement: number | null  // delta vs previous best
}

const LIBRARY: AnswerEntry[] = [
  {
    id: 'a1',
    question: 'Tell me about yourself.',
    category: 'behavioral',
    date: 'Jun 15, 2026',
    duration: 87,
    score: 91,
    isGoldMaster: true,
    fillerRate: 1.8,
    confidenceScore: 92,
    wpm: 148,
    transcript: "I'm a product manager with six years of experience building fintech products. Most recently at Acme Pay, I led a team that grew our payment success rate from 87% to 96%, adding $4M in annual revenue. I'm passionate about using data to drive decisions, and I'm excited about Stripe because it operates at exactly the intersection I care most about.",
    sessionRole: 'Senior Product Manager',
    sessionCompany: 'Stripe',
    improvement: +13,
  },
  {
    id: 'a2',
    question: 'How do you prioritize features when engineering resources are constrained?',
    category: 'situational',
    date: 'Jun 15, 2026',
    duration: 102,
    score: 88,
    isGoldMaster: true,
    fillerRate: 2.4,
    confidenceScore: 85,
    wpm: 142,
    transcript: "I start with a RICE framework — Reach, Impact, Confidence, Effort — and map it against our current OKRs. Then I hold a 30-minute stack-rank with engineering and design leads to gut-check assumptions. In my last role, this process cut our backlog from 80 tickets to 12 actionable items in a single sprint.",
    sessionRole: 'Senior Product Manager',
    sessionCompany: 'Stripe',
    improvement: +8,
  },
  {
    id: 'a3',
    question: 'Describe a time you had conflict with a stakeholder.',
    category: 'behavioral',
    date: 'Jun 13, 2026',
    duration: 118,
    score: 74,
    isGoldMaster: false,
    fillerRate: 5.1,
    confidenceScore: 71,
    wpm: 156,
    transcript: "So um, at Acme Pay, our engineering lead wanted six weeks for a compliance feature and I needed three for regulatory reasons. We ended up um scoping down to the MVP. It worked out but I think I could have structured this better with a clearer timeline from the start.",
    sessionRole: 'Senior Product Manager',
    sessionCompany: 'Stripe',
    improvement: null,
  },
  {
    id: 'a4',
    question: 'What metrics would you use to measure a new payment feature?',
    category: 'technical',
    date: 'Jun 13, 2026',
    duration: 72,
    score: 65,
    isGoldMaster: false,
    fillerRate: 6.3,
    confidenceScore: 63,
    wpm: 130,
    transcript: "I would look at conversion rate and error rates primarily. Also things like time-to-complete. I think user feedback is also important here for qualitative signal.",
    sessionRole: 'Senior Product Manager',
    sessionCompany: 'Stripe',
    improvement: null,
  },
  {
    id: 'a5',
    question: 'Tell me about a project you are most proud of.',
    category: 'behavioral',
    date: 'Jun 10, 2026',
    duration: 95,
    score: 82,
    isGoldMaster: false,
    fillerRate: 3.1,
    confidenceScore: 84,
    wpm: 144,
    transcript: "The project I'm most proud of is redesigning our checkout flow at Acme Pay. We had a 34% drop-off at payment entry. I ran 8 user interviews, identified that error messages were confusing, and proposed a simplified two-step flow. After A/B testing, we reduced drop-off to 18% and increased revenue by $1.2M annually.",
    sessionRole: 'Senior Product Manager',
    sessionCompany: 'Stripe',
    improvement: +7,
  },
]

const CATEGORIES = ['All', 'behavioral', 'technical', 'situational', 'culture']

function WaveformMini({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5 w-16">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="flex-1 rounded-full bg-[#4F46E5]"
          style={{
            height: `${25 + Math.abs(Math.sin(i * 1.1)) * 75}%`,
            opacity: active ? 0.8 : 0.25,
          }} />
      ))}
    </div>
  )
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-[#10B981]/10 text-[#10B981]' : score >= 70 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#EF4444]/10 text-[#EF4444]'
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>{score}</span>
}

export default function AnswerLibraryPage() {
  const [library, setLibrary] = useState(LIBRARY)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [showGoldOnly, setShowGoldOnly] = useState(false)

  const filtered = library.filter(a => {
    const matchSearch = a.question.toLowerCase().includes(search.toLowerCase()) ||
      a.transcript.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || a.category === cat
    const matchGold = !showGoldOnly || a.isGoldMaster
    return matchSearch && matchCat && matchGold
  })

  const toggleGold = (id: string) =>
    setLibrary(prev => prev.map(a => a.id === id ? { ...a, isGoldMaster: !a.isGoldMaster } : a))

  const remove = (id: string) =>
    setLibrary(prev => prev.filter(a => a.id !== id))

  const goldCount = library.filter(a => a.isGoldMaster).length

  return (
    <AppShell>
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Answer Library</h1>
          <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-0 text-xs">
            {goldCount} gold master{goldCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        {/* Explainer */}
        <div className="mb-5 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-4 flex items-start gap-3">
          <Star className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#1E1B4B] leading-relaxed">
            <strong>Gold Masters</strong> are your personal-best deliveries — saved here as the reference
            standard to beat. Star any answer to promote it. Use them in Shadow Speaking to hear your own
            best version before repeating.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions or transcripts…"
              className="pl-9 h-9 text-sm border-slate-200" />
          </div>
          <button onClick={() => setShowGoldOnly(v => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${showGoldOnly ? 'border-[#F59E0B] bg-[#F59E0B] text-white' : 'border-slate-200 text-[#64748B] hover:border-[#F59E0B]/40'}`}>
            <Star className="h-3.5 w-3.5" /> Gold only
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${cat === c ? 'bg-[#4F46E5] text-white' : 'bg-white border border-slate-200 text-[#64748B] hover:border-[#4F46E5]/40'}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Entries */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-[#64748B]">No answers match your filters.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => {
              const isPlaying = playingId === a.id
              const isExpanded = expandedId === a.id
              return (
                <Card key={a.id} className={`border shadow-sm transition-all ${a.isGoldMaster ? 'border-[#F59E0B]/40' : 'border-slate-200 dark:border-slate-800 dark:bg-slate-900'}`}>
                  <CardContent className="p-0">
                    {/* Top row */}
                    <div className="flex items-start gap-3 p-4">
                      {/* Play button */}
                      <button
                        onClick={() => setPlayingId(isPlaying ? null : a.id)}
                        className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-[#EF4444]' : 'bg-[#4F46E5]'}`}>
                        {isPlaying
                          ? <Pause className="h-4 w-4 text-white" />
                          : <Play className="h-4 w-4 text-white ml-0.5" />}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.category === 'behavioral' ? 'bg-[#4F46E5]/10 text-[#4F46E5]' :
                            a.category === 'technical' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            'bg-[#10B981]/10 text-[#10B981]'
                          }`}>{a.category}</span>
                          <ScorePill score={a.score} />
                          {a.isGoldMaster && (
                            <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-0 text-xs">
                              ⭐ Gold Master
                            </Badge>
                          )}
                          {a.improvement != null && a.improvement > 0 && (
                            <span className="text-xs text-[#10B981] font-semibold">
                              <TrendingUp className="inline h-3 w-3 mr-0.5" />+{a.improvement} pts
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#1E1B4B] leading-snug">{a.question}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{a.sessionCompany} · {a.date} · {Math.floor(a.duration / 60)}:{String(a.duration % 60).padStart(2, '0')}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-1.5">
                        <button onClick={() => toggleGold(a.id)}
                          className={`transition-colors ${a.isGoldMaster ? 'text-[#F59E0B]' : 'text-slate-300 hover:text-[#F59E0B]'}`}>
                          {a.isGoldMaster ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                        </button>
                        <button onClick={() => remove(a.id)} className="text-slate-200 hover:text-[#EF4444] transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Waveform player strip */}
                    {isPlaying && (
                      <div className="px-4 pb-3">
                        <div className="rounded-lg bg-[#1E1B4B] p-3 flex items-center gap-3">
                          <WaveformMini active={true} />
                          <div className="flex-1 h-0.5 bg-white/10 rounded-full">
                            <div className="h-full w-[40%] bg-[#4F46E5] rounded-full" />
                          </div>
                          <span className="font-mono text-xs text-white/60">0:34 / {Math.floor(a.duration / 60)}:{String(a.duration % 60).padStart(2, '0')}</span>
                        </div>
                      </div>
                    )}

                    {/* Metrics row */}
                    <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
                      {[
                        { label: 'Confidence', value: `${a.confidenceScore}%` },
                        { label: 'Filler words', value: `${a.fillerRate}%` },
                        { label: 'WPM', value: String(a.wpm) },
                      ].map(m => (
                        <div key={m.label} className="py-2 text-center">
                          <p className="text-xs font-bold text-[#1E1B4B]">{m.value}</p>
                          <p className="text-xs text-[#64748B]">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Transcript expand */}
                    <div className="border-t border-slate-100">
                      <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#64748B] hover:text-[#1E1B4B] transition-colors">
                        <span>View transcript</span>
                        {isExpanded ? <ChevronLeft className="h-3.5 w-3.5 rotate-90" /> : <ChevronRight className="h-3.5 w-3.5 rotate-90" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-xs text-[#64748B] leading-relaxed italic">"{a.transcript}"</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
    </AppShell>
  )
}
