'use client'

import { useEffect, useRef, useState } from 'react'

interface ConfidenceMeterProps {
  isActive: boolean
  wpm?: number
  pauseFreq?: number   // pauses per minute
  fillerRate?: number  // % filler words so far
}

type ConfidenceLevel = 'calm' | 'confident' | 'nervous' | 'overconfident'

function inferLevel(wpm: number, pauseFreq: number, fillerRate: number): ConfidenceLevel {
  if (fillerRate > 8 || pauseFreq > 4)            return 'nervous'
  if (wpm > 180)                                    return 'overconfident'
  if (wpm >= 130 && fillerRate <= 4 && pauseFreq <= 2) return 'confident'
  return 'calm'
}

const LEVEL_CONFIG: Record<ConfidenceLevel, { label: string; color: string; bg: string; desc: string; value: number }> = {
  nervous:       { label: 'Nervous',        color: '#EF4444', bg: 'bg-[#EF4444]',  desc: 'Slow down — breathe',             value: 20 },
  calm:          { label: 'Calm',           color: '#64748B', bg: 'bg-[#64748B]',  desc: 'Warm up your energy slightly',    value: 45 },
  confident:     { label: 'Confident',      color: '#10B981', bg: 'bg-[#10B981]',  desc: 'Perfect zone — keep going',       value: 80 },
  overconfident: { label: 'Overconfident',  color: '#F59E0B', bg: 'bg-[#F59E0B]',  desc: 'Slow down, let ideas breathe',    value: 95 },
}

export default function ConfidenceMeter({ isActive, wpm = 145, pauseFreq = 1.5, fillerRate = 3 }: ConfidenceMeterProps) {
  // Simulate live fluctuation when active
  const [liveWpm, setLiveWpm] = useState(wpm)
  const [liveFiller, setLiveFiller] = useState(fillerRate)
  const [livePause, setLivePause] = useState(pauseFreq)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isActive) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setLiveWpm(w => Math.max(90, Math.min(200, w + (Math.random() - 0.5) * 12)))
      setLiveFiller(f => Math.max(0, Math.min(15, f + (Math.random() - 0.5) * 0.8)))
      setLivePause(p => Math.max(0, Math.min(8, p + (Math.random() - 0.5) * 0.3)))
    }, 1800)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isActive])

  const level = inferLevel(liveWpm, livePause, liveFiller)
  const cfg = LEVEL_CONFIG[level]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#1E1B4B]">Live Confidence</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold`} style={{ background: `${cfg.color}15`, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 rounded-full bg-gradient-to-r from-[#EF4444] via-[#10B981] to-[#F59E0B] overflow-hidden">
        <div className="absolute inset-y-0 right-0 bg-slate-100 transition-all duration-700 rounded-full"
          style={{ width: `${100 - cfg.value}%` }} />
        {/* Needle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm transition-all duration-700"
          style={{ left: `${cfg.value}%` }} />
      </div>

      <div className="flex justify-between text-xs text-slate-300">
        <span>Nervous</span>
        <span>Confident</span>
        <span>Rushed</span>
      </div>

      <p className="text-xs text-[#64748B]" style={{ color: cfg.color }}>→ {cfg.desc}</p>

      {/* Sub-metrics */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
        {[
          { label: 'WPM', value: Math.round(liveWpm) },
          { label: 'Pauses/min', value: livePause.toFixed(1) },
          { label: 'Fillers', value: `${liveFiller.toFixed(1)}%` },
        ].map(m => (
          <div key={m.label} className="text-center">
            <p className="text-xs font-bold text-[#1E1B4B]">{m.value}</p>
            <p className="text-xs text-[#64748B]">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
