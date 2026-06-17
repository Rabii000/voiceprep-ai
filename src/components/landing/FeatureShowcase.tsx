'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const bigFeatures = [
  {
    tag: 'Flagship',
    tagColor: 'bg-[#4F46E5]/10 text-[#4F46E5]',
    title: 'A real interviewer, not a chatbot',
    desc: 'Alex, your AI interviewer, speaks in a natural voice, waits for your answer, and digs deeper when you\'re vague. The conversation changes based on what you actually say.',
    points: ['Natural voice synthesis', 'Follow-ups that push back on weak answers', 'Panel mode: two AI interviewers, one candidate', 'Stress mode: rapid-fire, no pauses'],
    accent: '#4F46E5',
  },
  {
    tag: 'Intelligence',
    tagColor: 'bg-[#10B981]/10 text-[#10B981]',
    title: 'Questions built from your own story',
    desc: 'We read your resume. Every question references your actual experience, the role\'s real requirements, and the company\'s culture. Nothing generic.',
    points: ['PDF, DOCX, plain text', 'Skill-gap + alignment matrix', 'Difficulty scoring 1 – 5', 'Pin, swap, or regenerate any question'],
    accent: '#10B981',
  },
]

const smallFeatures = [
  { title: 'Coaching Scorecard', desc: 'Per-question breakdown, STAR compliance, audio playback, and trend charts — all in one report.', icon: '📊', accent: '#F59E0B' },
  { title: 'Fluency Coach', desc: 'Upload your Q&A pairs. Your script fades session by session until you can deliver from memory.', icon: '📖', accent: '#6366f1' },
  { title: 'Shadow Speaking', desc: 'Hear a model answer, then repeat it. Builds rhythm, pacing, and vocabulary muscle memory.', icon: '🔊', accent: '#4F46E5' },
  { title: 'Live Confidence Meter', desc: 'Real-time gauge that scores your WPM, pause frequency, and filler rate as you speak.', icon: '⚡', accent: '#10B981' },
  { title: 'Answer Library', desc: 'Star your best takes. Compare against previous sessions to track real delivery improvements.', icon: '⭐', accent: '#F59E0B' },
  { title: 'Interview Countdown', desc: '7-day prep schedule that auto-builds based on your interview date and readiness gaps.', icon: '📅', accent: '#EF4444' },
]

export function FeatureShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="features" ref={ref} className="bg-[#0f0e1a] py-28 px-5 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#4F46E5]/6 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#10B981]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-semibold text-[#10B981] uppercase tracking-[0.15em] mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-xl">
            Everything in one<br />
            <span className="shimmer-text">practice loop.</span>
          </h2>
        </motion.div>

        {/* Big feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {bigFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 p-8 transition-all duration-300 hover:border-white/15"
            >
              <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold mb-5 ${f.tagColor}`}>{f.tag}</span>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {f.points.map((p, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: f.accent }} />
                    <span className="text-xs text-slate-400">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small feature grid — 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {smallFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
              className="group rounded-xl border border-white/8 bg-white/2 hover:bg-white/5 p-5 transition-all duration-300 hover:border-white/15 cursor-default"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="text-sm font-bold text-white">{f.title}</h4>
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
