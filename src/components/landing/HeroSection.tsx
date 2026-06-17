'use client'

import Link from 'next/link'
import { Mic, ArrowRight, Play, Zap, Star, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

function WaveformAnimation() {
  return (
    <div className="flex items-center gap-1 h-12">
      {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8, 0.5, 1, 0.6, 0.3].map((h, i) => (
        <div
          key={i}
          className="wave-bar w-1.5 rounded-full bg-[#4F46E5]"
          style={{
            height: `${h * 100}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#4F46E5]/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-[#10B981]/15 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-[#4F46E5]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/40 bg-[#4F46E5]/10 px-4 py-1.5 mb-8">
          <Zap className="h-3.5 w-3.5 text-[#10B981]" />
          <span className="text-xs font-medium text-slate-300">Powered by ElevenLabs + Claude AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
          Speak your way in.
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed mb-10">
          Upload your resume and job description. Your AI interviewer generates tailored questions,
          conducts a timed voice mock interview, and delivers a detailed scorecard — instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#4F46E5]/30 transition-all hover:scale-105"
            >
              Start Free Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-xl"
            >
              <Play className="mr-2 h-4 w-4" />
              See How It Works
            </Button>
          </a>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-16">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#10B981]" />
            <span>10,000+ job seekers</span>
          </div>
          <div className="h-4 w-px bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span>4.9 on Product Hunt</span>
          </div>
          <div className="h-4 w-px bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-[#4F46E5]" />
            <span>ElevenLabs Powered</span>
          </div>
        </div>

        {/* Mock interview preview card */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="recording-pulse h-3 w-3 rounded-full bg-[#EF4444]" />
              <span className="text-sm font-medium text-white">Live Interview Session</span>
            </div>
            <div className="font-mono text-sm text-[#10B981]">12:34</div>
          </div>

          <div className="mb-4 rounded-xl bg-white/5 p-4 text-left">
            <p className="text-xs text-slate-400 mb-1">AI Interviewer</p>
            <p className="text-sm text-white">
              "Tell me about a time you led a cross-functional project under a tight deadline.
              What was your approach and what was the outcome?"
            </p>
          </div>

          <div className="flex items-center justify-center py-2">
            <WaveformAnimation />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Filler words: <span className="text-[#F59E0B]">2</span></span>
            <span>Confidence: <span className="text-[#10B981]">High</span></span>
            <span>STAR: <span className="text-[#4F46E5]">In progress</span></span>
          </div>
        </div>
      </div>
    </section>
  )
}
