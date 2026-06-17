'use client'

import { useState } from 'react'
import { Volume2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

interface StumbledWord {
  word: string
  count: number
  phonetic: string
  tip: string
  sessions: string[]  // which session dates it appeared in
}

const DEMO_WORDS: StumbledWord[] = [
  { word: 'specifically', count: 7, phonetic: '/spɪˈsɪf.ɪ.kli/', tip: 'Break it: spe-SIF-ick-lee. Stress the second syllable.', sessions: ['Jun 15', 'Jun 13', 'Jun 10'] },
  { word: 'particularly', count: 5, phonetic: '/pəˈtɪk.jʊ.lə.li/', tip: 'Try: par-TIC-you-ler-lee. Slow the middle.', sessions: ['Jun 15', 'Jun 13'] },
  { word: 'prioritisation', count: 4, phonetic: '/praɪˌɒr.ɪ.taɪˈzeɪ.ʃən/', tip: 'Break at the "ize": prior-it-IZE-ation. Or just say "prioritizing".', sessions: ['Jun 13', 'Jun 10'] },
  { word: 'measurable', count: 3, phonetic: '/ˈmeʒ.ər.ə.bəl/', tip: 'MEZ-yer-uh-bul. Three syllables, not four.', sessions: ['Jun 10'] },
  { word: 'collaborative', count: 2, phonetic: '/kəˈlæb.ər.ə.tɪv/', tip: 'co-LAB-or-uh-tiv. Stress the second syllable.', sessions: ['Jun 15'] },
]

function FrequencyBar({ count, max }: { count: number; max: number }) {
  const pct = (count / max) * 100
  const color = pct >= 60 ? '#EF4444' : pct >= 35 ? '#F59E0B' : '#64748B'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-4 text-right" style={{ color }}>{count}×</span>
    </div>
  )
}

export default function PronunciationCoach({ words = DEMO_WORDS }: { words?: StumbledWord[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const maxCount = Math.max(...words.map(w => w.count))

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <Volume2 className="h-4 w-4 text-[#F59E0B]" />
        <p className="text-sm font-semibold text-[#1E1B4B]">Pronunciation Coach</p>
        <span className="ml-auto text-xs text-[#64748B]">{words.length} flagged words</span>
      </div>

      {words.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-5 text-sm text-[#10B981]">
          <CheckCircle2 className="h-4 w-4" />
          No repeated stumbles detected — great pronunciation!
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {words.map(w => {
            const isOpen = expanded === w.word
            return (
              <div key={w.word}>
                <button
                  onClick={() => setExpanded(isOpen ? null : w.word)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#1E1B4B]">{w.word}</span>
                      <span className="text-xs text-[#64748B] font-mono">{w.phonetic}</span>
                    </div>
                    <FrequencyBar count={w.count} max={maxCount} />
                  </div>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-slate-300 flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  }
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 bg-[#F59E0B]/3">
                    <div className="flex items-start gap-2 rounded-lg bg-[#F59E0B]/8 border border-[#F59E0B]/20 p-3 mb-2">
                      <AlertCircle className="h-3.5 w-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-[#1E1B4B] leading-relaxed">{w.tip}</p>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Appeared in: {w.sessions.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
