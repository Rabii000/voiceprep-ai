'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Drop your docs',
    sub: 'Resume + Job Description',
    desc: 'Paste or upload your resume and the job description. The system reads both, finds where your experience matches, and spots the gaps worth preparing for.',
    color: '#4F46E5',
    visual: (
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 text-left">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-[#4F46E5]/10 flex items-center justify-center">
            <svg className="h-3 w-3 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span className="text-xs font-semibold text-slate-700">resume.pdf</span>
          <span className="ml-auto text-[10px] text-[#10B981] font-medium">Analyzed ✓</span>
        </div>
        <div className="space-y-1.5 mb-4">
          {['Senior Product Manager', 'Stripe · San Francisco', '5 years experience', 'Skills match: 87%'].map((line, i) => (
            <div key={i} className="h-2 rounded-full bg-slate-100" style={{ width: `${[80, 60, 70, 90][i]}%` }}>
              <div className="h-full rounded-full bg-[#4F46E5]/20" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[#10B981]/8 border border-[#10B981]/20 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          <span className="text-[11px] text-[#059669] font-medium">Ready to generate 47 questions</span>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'Get your question set',
    sub: 'AI-generated · 30–60 questions',
    desc: 'Your questions aren\'t generic. They pull from your actual resume, the job\'s real requirements, and what\'s known about the company\'s interview style. Each one is scored by difficulty.',
    color: '#10B981',
    visual: (
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Generated Questions</span>
          <span className="text-[10px] text-slate-400">47 total</span>
        </div>
        {[
          { q: 'Tell me about a product decision you made with incomplete data.', cat: 'Behavioral', diff: 3 },
          { q: 'How would you prioritize competing feature requests at Stripe?', cat: 'Situational', diff: 4 },
          { q: 'Walk me through your experience with API monetization.', cat: 'Technical', diff: 3 },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0">
            <div className="h-5 w-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-[#10B981]">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-2">{item.q}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-[#10B981] bg-[#10B981]/8 px-1.5 py-0.5 rounded-full">{item.cat}</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(d => (
                    <div key={d} className={`h-1 w-2.5 rounded-full ${d <= item.diff ? 'bg-[#F59E0B]' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'Interview out loud',
    sub: 'Voice AI · Real-time',
    desc: 'Your AI interviewer speaks, waits, and follows up. Answer out loud, get interrupted with probing questions, and walk away with a full scorecard when you\'re done.',
    color: '#F59E0B',
    visual: (
      <div className="rounded-xl bg-[#0f0e1a] border border-white/10 shadow-sm overflow-hidden text-left">
        <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EF4444] recording-pulse" />
          <span className="text-[11px] font-medium text-white">Live Session</span>
          <span className="ml-auto font-mono text-[11px] text-[#10B981]">12:18</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/8 p-3">
            <p className="text-[10px] text-slate-400 mb-1">Alex · AI Interviewer</p>
            <p className="text-[12px] text-slate-200">"...and how did you measure the impact of that decision?"</p>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-2">
            {[0.4,0.8,1,0.7,0.9,0.6,1,0.8,0.5,0.7,0.9,0.6].map((h, i) => (
              <div key={i} className="wave-bar w-1 rounded-full bg-[#F59E0B]" style={{ height: `${h*28}px`, animationDelay: `${i*0.08}s` }} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['84', 'Score', '#10B981'], ['2', 'Fillers', '#F59E0B'], ['STAR', 'Active', '#4F46E5']].map(([v,l,c]) => (
              <div key={l} className="rounded-lg bg-white/5 px-2 py-2 text-center">
                <p className="text-[13px] font-bold font-mono" style={{ color: c }}>{v}</p>
                <p className="text-[9px] text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="bg-[#F8FAFC] py-28 px-5" ref={ref}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-[#4F46E5] uppercase tracking-[0.15em] mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-[#1E1B4B] leading-[1.1] tracking-tight max-w-lg"
          >
            From upload<br /> to offer letter.
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Text */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-6xl font-black text-slate-100 leading-none select-none">{step.num}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-0.5" style={{ color: step.color }}>{step.sub}</p>
                    <h3 className="text-2xl font-bold text-[#1E1B4B]">{step.title}</h3>
                  </div>
                </div>
                <p className="text-[#64748B] leading-relaxed text-base">{step.desc}</p>
                <div className="mt-5 h-px" style={{ background: `linear-gradient(to right, ${step.color}30, transparent)` }} />
              </div>

              {/* Visual */}
              <div>{step.visual}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
