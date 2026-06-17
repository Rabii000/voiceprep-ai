'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Senior SWE',
    company: 'Stripe',
    gradient: ['#4F46E5', '#6366f1'],
    initials: 'PS',
    quote: 'I did 12 sessions in two weeks. The AI asked a follow-up I\'d never thought about — and that exact question came up in the real interview. I knew exactly what to say.',
    outcome: 'Got the offer',
    outcomeColor: '#10B981',
  },
  {
    name: 'Marcus Williams',
    role: 'Director of Marketing',
    company: 'Adobe',
    gradient: ['#D97706', '#F59E0B'],
    initials: 'MW',
    quote: 'Said "um" 34 times in my first session. By my third, I was at 6. That kind of specific feedback is impossible to get from a friend or a career coach.',
    outcome: '+40% salary',
    outcomeColor: '#F59E0B',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Product Manager',
    company: 'Shopify',
    gradient: ['#059669', '#10B981'],
    initials: 'YT',
    quote: 'After three years away, I had no idea how to talk about my gap. VoicePrep helped me reframe it into a strength. Watching my confidence score climb kept me going.',
    outcome: 'Back in tech',
    outcomeColor: '#4F46E5',
  },
  {
    name: 'Amara Okafor',
    role: 'Engineering Manager',
    company: 'Notion',
    gradient: ['#7C3AED', '#8B5CF6'],
    initials: 'AO',
    quote: 'The panel mode simulation is unreal. Switching between two different AI voices with different question styles genuinely prepared me for the multi-round format.',
    outcome: 'L7 offer',
    outcomeColor: '#8B5CF6',
  },
  {
    name: 'Daniel Park',
    role: 'Data Scientist',
    company: 'Airbnb',
    gradient: ['#DC2626', '#EF4444'],
    initials: 'DP',
    quote: 'Used it the night before. Practiced the exact questions it generated — two of them appeared verbatim. The document analysis is genuinely intelligent, not just keyword matching.',
    outcome: 'Hired in 3 weeks',
    outcomeColor: '#10B981',
  },
  {
    name: 'Sarah Chen',
    role: 'VP Product',
    company: 'Linear',
    gradient: ['#0891B2', '#06B6D4'],
    initials: 'SC',
    quote: 'I usually hate mock interviews because the feedback is too vague. Here the STAR analysis told me exactly where my structure broke down and gave me a suggested rewrite.',
    outcome: 'Role upgraded',
    outcomeColor: '#F59E0B',
  },
]

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-[340px] flex-shrink-0 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm mx-3">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
        >
          {t.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1E1B4B]">{t.name}</p>
          <p className="text-xs text-[#64748B] truncate">{t.role} · {t.company}</p>
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{ color: t.outcomeColor, background: `${t.outcomeColor}15` }}
        >
          {t.outcome}
        </span>
      </div>
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[1,2,3,4,5].map(s => (
          <svg key={s} className="h-3.5 w-3.5 fill-[#F59E0B]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        ))}
      </div>
      <p className="text-sm text-[#475569] leading-relaxed">"{t.quote}"</p>
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="bg-[#F8FAFC] py-24 overflow-hidden" ref={ref}>
      <div className="mx-auto max-w-6xl px-5 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold text-[#4F46E5] uppercase tracking-[0.15em] mb-4">Success Stories</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B4B] leading-[1.1] tracking-tight">
              Real candidates.<br />Real offers.
            </h2>
            <p className="text-sm text-[#64748B] max-w-xs">
              Over 10,000 job seekers have used VoicePrep to prepare for their interviews.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#F8FAFC] to-transparent" />

        <div className="flex marquee-track w-max pb-2 pt-2">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
