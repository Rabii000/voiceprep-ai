'use client'

import Link from 'next/link'
import { ChevronLeft, BookOpen, Repeat2, Zap, Calendar, Star, Target, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import MasteryHeatmap from '@/components/MasteryHeatmap'
import PronunciationCoach from '@/components/PronunciationCoach'
import ConfidenceMeter from '@/components/ConfidenceMeter'

const TOOLS = [
  {
    href: '/fluency',
    icon: BookOpen,
    label: 'Fluency Coach',
    desc: 'Upload Q&A pairs. Script fades as mastery builds.',
    color: 'text-[#4F46E5]', bg: 'bg-[#4F46E5]/10', border: 'border-[#4F46E5]/20',
    badge: null,
  },
  {
    href: '/shadow',
    icon: Repeat2,
    label: 'Shadow Speaking',
    desc: 'Listen to the model answer, then repeat it segment by segment.',
    color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20',
    badge: null,
  },
  {
    href: '/drill',
    icon: Zap,
    label: 'Quick Drill',
    desc: '8 random questions. 60 seconds each. No preparation.',
    color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20',
    badge: 'Fast',
  },
  {
    href: '/countdown',
    icon: Calendar,
    label: 'Interview Countdown',
    desc: 'Set your interview date and get a day-by-day prep schedule.',
    color: 'text-[#6366f1]', bg: 'bg-[#6366f1]/10', border: 'border-[#6366f1]/20',
    badge: null,
  },
  {
    href: '/library',
    icon: Star,
    label: 'Answer Library',
    desc: 'Save your best deliveries as Gold Masters and replay them.',
    color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20',
    badge: null,
  },
  {
    href: '/session',
    icon: Target,
    label: 'Mock Session',
    desc: 'Full agentic voice interview powered by ElevenLabs + Claude.',
    color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20',
    badge: 'AI',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E1B4B]">
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>
        <span className="text-slate-200">·</span>
        <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
        <span className="text-sm font-semibold text-[#1E1B4B]">Practice Hub</span>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-10">

        {/* Tool grid */}
        <section>
          <h2 className="text-base font-bold text-[#1E1B4B] mb-4">All Practice Tools</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href}>
                <Card className={`border ${t.border} hover:shadow-md transition-all cursor-pointer group h-full`}>
                  <CardContent className="p-4 flex gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${t.bg}`}>
                      <t.icon className={`h-5 w-5 ${t.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#1E1B4B] group-hover:text-[#4F46E5] transition-colors">{t.label}</p>
                        {t.badge && (
                          <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${t.bg} ${t.color}`}>{t.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">{t.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Mastery heatmap */}
        <section>
          <h2 className="text-base font-bold text-[#1E1B4B] mb-1">Mastery Heatmap</h2>
          <p className="text-xs text-[#64748B] mb-4">Hover any tile to see question details. Red = needs work, green = mastered.</p>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <MasteryHeatmap />
            </CardContent>
          </Card>
        </section>

        {/* Pronunciation Coach */}
        <section>
          <h2 className="text-base font-bold text-[#1E1B4B] mb-1">Pronunciation Coach</h2>
          <p className="text-xs text-[#64748B] mb-4">Words you've stumbled on across sessions — with fix tips.</p>
          <PronunciationCoach />
        </section>

        {/* Confidence Meter demo */}
        <section>
          <h2 className="text-base font-bold text-[#1E1B4B] mb-1">Live Confidence Meter</h2>
          <p className="text-xs text-[#64748B] mb-4">
            Inferred from WPM, pause frequency, and filler rate. Active during every mock session.
          </p>
          <ConfidenceMeter isActive={true} wpm={148} pauseFreq={1.2} fillerRate={3.1} />
        </section>

      </div>
    </div>
  )
}
