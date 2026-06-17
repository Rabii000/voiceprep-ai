'use client'

import { useState } from 'react'

interface HeatmapQuestion {
  id: string
  text: string
  category: string
  mastery: number   // 0–100
  sessions: number
}

const DEMO: HeatmapQuestion[] = [
  { id: '1', text: 'Tell me about yourself.', category: 'behavioral', mastery: 91, sessions: 7 },
  { id: '2', text: 'Greatest strength?', category: 'behavioral', mastery: 78, sessions: 5 },
  { id: '3', text: 'Greatest weakness?', category: 'behavioral', mastery: 55, sessions: 3 },
  { id: '4', text: 'Why this company?', category: 'behavioral', mastery: 88, sessions: 6 },
  { id: '5', text: 'Conflict with a stakeholder?', category: 'behavioral', mastery: 62, sessions: 4 },
  { id: '6', text: 'Career gap explanation', category: 'behavioral', mastery: 30, sessions: 1 },
  { id: '7', text: 'Prioritise features?', category: 'situational', mastery: 88, sessions: 6 },
  { id: '8', text: 'Handle ambiguity?', category: 'situational', mastery: 71, sessions: 4 },
  { id: '9', text: 'Decision with no data?', category: 'situational', mastery: 45, sessions: 2 },
  { id: '10', text: 'Metrics for a feature?', category: 'technical', mastery: 65, sessions: 4 },
  { id: '11', text: 'System design — payments?', category: 'technical', mastery: 38, sessions: 2 },
  { id: '12', text: 'API rate limiting?', category: 'technical', mastery: 22, sessions: 1 },
  { id: '13', text: 'A/B testing methodology?', category: 'technical', mastery: 74, sessions: 5 },
  { id: '14', text: 'Company values fit?', category: 'culture', mastery: 85, sessions: 6 },
  { id: '15', text: 'Remote work style?', category: 'culture', mastery: 92, sessions: 7 },
  { id: '16', text: 'Elevator pitch', category: 'behavioral', mastery: 95, sessions: 8 },
]

function masteryColor(m: number): string {
  if (m >= 85) return '#10B981'    // green — mastered
  if (m >= 65) return '#4F46E5'    // indigo — progressing
  if (m >= 40) return '#F59E0B'    // amber — learning
  return '#EF4444'                  // red — needs work
}

function masteryLabel(m: number): string {
  if (m >= 85) return 'Mastered'
  if (m >= 65) return 'Progressing'
  if (m >= 40) return 'Learning'
  return 'Needs work'
}

const CATEGORY_ORDER = ['behavioral', 'situational', 'technical', 'culture']

export default function MasteryHeatmap({ questions = DEMO }: { questions?: HeatmapQuestion[] }) {
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const grouped = CATEGORY_ORDER.reduce<Record<string, HeatmapQuestion[]>>((acc, cat) => {
    acc[cat] = questions.filter(q => q.category === cat)
    return acc
  }, {})

  const overall = Math.round(questions.reduce((s, q) => s + q.mastery, 0) / questions.length)

  return (
    <div className="space-y-4">
      {/* Legend + overall */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {[
            { color: '#EF4444', label: '0–39' },
            { color: '#F59E0B', label: '40–64' },
            { color: '#4F46E5', label: '65–84' },
            { color: '#10B981', label: '85–100' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded" style={{ background: l.color, opacity: 0.75 }} />
              <span className="text-xs text-[#64748B]">{l.label}</span>
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-[#1E1B4B]">Avg mastery: <span style={{ color: masteryColor(overall) }}>{overall}%</span></span>
      </div>

      {/* Grid by category */}
      {CATEGORY_ORDER.map(cat => {
        const qs = grouped[cat]
        if (!qs?.length) return null
        return (
          <div key={cat}>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {qs.map(q => (
                <div
                  key={q.id}
                  onMouseEnter={() => { setHovered(q.id); setTooltip(q.text) }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                  className="relative cursor-default"
                >
                  <div
                    className="h-9 w-9 rounded-lg transition-transform hover:scale-110 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: masteryColor(q.mastery),
                      opacity: 0.25 + (q.mastery / 100) * 0.75,
                      boxShadow: hovered === q.id ? `0 0 0 2px ${masteryColor(q.mastery)}` : 'none',
                    }}
                    title={`${q.text} — ${q.mastery}%`}
                  >
                    {q.mastery}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Tooltip — show hovered question */}
      {tooltip && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-xs text-[#1E1B4B]">
          <strong>{tooltip}</strong>
          {(() => {
            const q = questions.find(q => q.text === tooltip)
            return q ? (
              <span className="ml-2 text-[#64748B]">{masteryLabel(q.mastery)} · {q.sessions} session{q.sessions !== 1 ? 's' : ''}</span>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
}
