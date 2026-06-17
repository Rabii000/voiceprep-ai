import {
  Mic2,
  BarChart3,
  FileText,
  Brain,
  Users,
  Smartphone,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Mic2,
    tag: 'Flagship',
    tagColor: 'bg-[#4F46E5] text-white',
    title: 'Agentic Voice Interviewer',
    description:
      'A fully agentic AI interviewer that speaks, listens, probes for deeper answers, and adapts — just like a real interviewer.',
    bullets: [
      'ElevenLabs real-time voice synthesis',
      'Contextual follow-up questions',
      'Panel simulation with 2 AI voices',
      'Filler word live detection',
    ],
  },
  {
    icon: Brain,
    tag: 'Intelligence',
    tagColor: 'bg-[#10B981] text-white',
    title: 'Resume + JD Intelligence',
    description:
      'Deep document analysis extracts your achievements, maps skill gaps, and generates hyper-personalized question sets.',
    bullets: [
      'PDF, DOCX & plain text support',
      'Gap and alignment matrix',
      'Difficulty-scored questions (1–5)',
      'Regenerate, pin, or swap questions',
    ],
  },
  {
    icon: BarChart3,
    tag: 'Analytics',
    tagColor: 'bg-[#F59E0B] text-white',
    title: 'Multi-Dimensional Scorecard',
    description:
      'After every session, get a comprehensive performance report with audio playback, coaching notes, and trend tracking.',
    bullets: [
      'Overall score + per-question breakdown',
      'STAR compliance analysis',
      'Audio playback with transcript sync',
      'Session history & progress charts',
    ],
  },
  {
    icon: FileText,
    tag: 'Resume',
    tagColor: 'bg-[#6366f1] text-white',
    title: 'Resume Optimizer',
    description:
      'Built-in ATS scoring, bullet rewriting, and keyword matching against your target JD — all in one workflow.',
    bullets: [
      'ATS compatibility score',
      'STAR/XYZ bullet rewriter',
      'Keyword gap analysis',
      'One-click export DOCX/PDF',
    ],
  },
  {
    icon: Users,
    tag: 'Community',
    tagColor: 'bg-[#64748B] text-white',
    title: 'Social & Community',
    description:
      'Anonymous leaderboards, peer review mode, and a crowdsourced company question database.',
    bullets: [
      'Weekly industry leaderboards',
      'Peer answer review',
      'Real company question bank',
      'Interview war stories forum',
    ],
  },
  {
    icon: Smartphone,
    tag: 'Mobile First',
    tagColor: 'bg-[#1E1B4B] text-white',
    title: 'PWA — No App Store Needed',
    description:
      'Install directly from your browser. Full voice session support on mobile with dark mode and offline recovery.',
    bullets: [
      'Voice-only mode (zero taps)',
      'Haptic feedback on interactions',
      'Offline session auto-save',
      'Dark mode out of the box',
    ],
  },
]

export function FeatureShowcase() {
  return (
    <section id="features" className="bg-[#1E1B4B] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need to walk in confident
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            VoicePrep AI covers the full prep cycle — from document upload to real-time voice sessions to in-depth coaching.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/8 transition-colors"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${feature.tagColor}`}>
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
