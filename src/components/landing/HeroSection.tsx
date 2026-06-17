'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

function LiveSessionMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Floating glow */}
      <div className="absolute -inset-4 bg-[#4F46E5]/20 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0d0c18] shadow-2xl float">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444] recording-pulse" />
            <span className="text-[11px] font-medium text-slate-300">Live Session</span>
          </div>
          <span className="font-mono text-[11px] text-[#10B981] font-bold">08:42</span>
        </div>

        {/* AI interviewer */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366f1] flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 9.5 2Z" fill="currentColor"/><path d="M12 14c-3.038 0-5.5-2.23-5.5-4.98V7.5a.5.5 0 0 0-1 0v1.52C5.5 12.35 8.48 15 12 15s6.5-2.65 6.5-5.98V7.5a.5.5 0 0 0-1 0v1.52C17.5 11.77 15.038 14 12 14Z" fill="currentColor"/></svg>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#10B981] border border-[#0d0c18]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 mb-1">Alex · AI Interviewer</p>
              <div className="rounded-xl rounded-tl-sm bg-[#4F46E5]/12 border border-[#4F46E5]/20 p-3">
                <p className="text-[12px] text-slate-200 leading-relaxed">
                  "Walk me through a time you had to influence a decision without direct authority — what was your approach?"
                </p>
              </div>
            </div>
          </div>

          {/* User speaking */}
          <div className="flex items-end gap-3 mb-4 flex-row-reverse">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex-shrink-0 flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">YO</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 mb-1 text-right">You</p>
              <div className="rounded-xl rounded-tr-sm bg-[#10B981]/10 border border-[#10B981]/20 p-3">
                <p className="text-[12px] text-slate-200 leading-relaxed">
                  "In my previous role, I needed buy-in from three separate teams for a product pivot..."
                </p>
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-0.5 h-8 mb-3">
            {[0.3, 0.6, 0.9, 0.7, 1, 0.8, 0.5, 0.9, 0.7, 0.4, 0.8, 0.6, 1, 0.5, 0.3, 0.7, 0.9, 0.6].map((h, i) => (
              <div
                key={i}
                className="wave-bar w-1 rounded-full bg-[#10B981]"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.07}s` }}
              />
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 border-t border-white/8">
          {[
            { label: 'Confidence', value: 'High', color: 'text-[#10B981]' },
            { label: 'Filler words', value: '3', color: 'text-[#F59E0B]' },
            { label: 'STAR', value: '78%', color: 'text-[#4F46E5]' },
          ].map(m => (
            <div key={m.label} className="px-3 py-3 text-center border-r border-white/8 last:border-0">
              <p className={`text-[13px] font-bold font-mono ${m.color}`}>{m.value}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scorecard badge floating */}
      <div className="absolute -bottom-6 -left-10 float-slow">
        <div className="rounded-xl bg-[#0f0e1a] border border-white/12 px-3.5 py-2.5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[#10B981]/15 flex items-center justify-center">
              <svg className="h-3 w-3 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white">Session score</p>
              <p className="text-[9px] text-slate-400">Behavioral interview</p>
            </div>
            <span className="ml-1 text-lg font-black text-[#10B981]">84</span>
          </div>
        </div>
      </div>

      {/* Question badge */}
      <div className="absolute -top-5 -right-6 float" style={{ animationDelay: '1.5s' }}>
        <div className="rounded-xl bg-[#0f0e1a] border border-white/12 px-3 py-2 shadow-xl">
          <p className="text-[9px] text-slate-400">AI-generated</p>
          <p className="text-[11px] font-semibold text-white">47 questions</p>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 60])

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' as const },
    }),
  }

  return (
    <section
      ref={ref}
      className="mesh-bg relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-5"
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="glow-orb absolute top-[15%] left-[8%] h-[480px] w-[480px] rounded-full bg-[#4F46E5]/14 blur-[80px]" />
        <div className="glow-orb absolute bottom-[20%] right-[5%] h-[360px] w-[360px] rounded-full bg-[#10B981]/10 blur-[80px]" style={{ animationDelay: '2.5s' }} />
        <div className="glow-orb absolute top-[50%] right-[30%] h-[200px] w-[200px] rounded-full bg-[#6366f1]/8 blur-[60px]" style={{ animationDelay: '1.2s' }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-[1fr_440px] gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-[#10B981]/8 px-3.5 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] recording-pulse" />
              <span className="text-xs font-medium text-[#10B981]">Voice AI interview coach · Real-time feedback</span>
            </motion.div>

            {/* Headline — editorial, not centered */}
            <div className="mb-7 overflow-hidden">
              {['Ace your', 'next interview.', 'Out loud.'].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={wordVariants}
                  >
                    <span className={`block font-black leading-[1.05] tracking-tight ${
                      i === 0
                        ? 'text-5xl sm:text-6xl lg:text-7xl text-white'
                        : i === 1
                        ? 'text-5xl sm:text-6xl lg:text-7xl shimmer-text'
                        : 'text-4xl sm:text-5xl lg:text-6xl text-slate-400 italic font-bold'
                    }`}>
                      {line}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-[17px] text-slate-400 leading-[1.7] max-w-xl mb-10"
            >
              Upload your resume and job description. An AI interviewer asks tailored questions, listens to your answers,
              and gives you a coaching scorecard. The whole thing takes under 30 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <Link href="/auth/signup">
                <button className="group flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-xl shadow-[#4F46E5]/35 hover:shadow-[#4F46E5]/50 hover:scale-[1.02]">
                  Start your first session
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a href="#how-it-works" className="px-7 py-3.5 text-sm font-medium text-slate-300 hover:text-white border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200">
                See how it works
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-6">
                {/* Avatar stack */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {[
                      ['#4F46E5', '#6366f1', 'PS'],
                      ['#059669', '#10B981', 'MW'],
                      ['#D97706', '#F59E0B', 'YT'],
                      ['#7C3AED', '#8B5CF6', 'AK'],
                    ].map(([from, to, initials], i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-[#0f0e1a] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="h-3 w-3 fill-[#F59E0B]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400"><span className="text-white font-semibold">10,000+</span> people have used VoicePrep to prep</p>
                  </div>
                </div>

                <div className="h-6 w-px bg-white/10 hidden sm:block" />
                <p className="text-[11px] text-slate-500">No credit card required · 2 free sessions</p>
              </div>
            </motion.div>
          </div>

          {/* Right column — mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ y }}
            className="hidden lg:block"
          >
            <LiveSessionMockup />
          </motion.div>
        </div>

        {/* Mobile mockup below text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="lg:hidden mt-12"
        >
          <LiveSessionMockup />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </section>
  )
}
