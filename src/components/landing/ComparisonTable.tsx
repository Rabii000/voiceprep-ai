import { Check, X, Minus } from 'lucide-react'

const features = [
  'Voice AI Interviewer',
  'Agentic Follow-ups',
  'Resume + JD Tailoring',
  'Post-Session Scorecard',
  'Filler Word Detection',
  'Mobile First / PWA',
  'Panel Simulation',
  '24/7 Availability',
  'Free Tier',
]

type Status = 'yes' | 'no' | 'partial'

const competitors: { name: string; data: Status[] }[] = [
  { name: 'VoicePrep AI', data: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes'] },
  { name: 'Pramp', data: ['no', 'no', 'no', 'partial', 'no', 'no', 'no', 'partial', 'yes'] },
  { name: 'Interviewing.io', data: ['no', 'no', 'no', 'partial', 'no', 'no', 'no', 'partial', 'partial'] },
  { name: 'ChatGPT', data: ['no', 'partial', 'partial', 'no', 'no', 'partial', 'no', 'yes', 'yes'] },
  { name: 'Big Interview', data: ['partial', 'no', 'partial', 'partial', 'no', 'no', 'no', 'yes', 'partial'] },
]

function StatusIcon({ status, highlight }: { status: Status; highlight?: boolean }) {
  if (status === 'yes') return <Check className={`h-5 w-5 mx-auto ${highlight ? 'text-[#10B981]' : 'text-[#10B981]/50'}`} />
  if (status === 'no') return <X className="h-5 w-5 mx-auto text-slate-300" />
  return <Minus className="h-5 w-5 mx-auto text-[#F59E0B]" />
}

export function ComparisonTable() {
  return (
    <section id="compare" className="bg-[#1E1B4B] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Compare
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            See why VoicePrep AI wins
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-5 text-left text-slate-400 font-medium w-48">Feature</th>
                {competitors.map((c, i) => (
                  <th
                    key={i}
                    className={`py-4 px-4 text-center font-semibold ${
                      i === 0
                        ? 'text-white bg-[#4F46E5]/20 border-x border-[#4F46E5]/30'
                        : 'text-slate-400'
                    }`}
                  >
                    {i === 0 ? (
                      <span className="flex flex-col items-center gap-1">
                        <span className="rounded-full bg-[#4F46E5] px-2 py-0.5 text-xs text-white">Best</span>
                        {c.name}
                      </span>
                    ) : c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fi) => (
                <tr key={fi} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3.5 px-5 text-slate-300">{feature}</td>
                  {competitors.map((c, ci) => (
                    <td
                      key={ci}
                      className={`py-3.5 px-4 text-center ${
                        ci === 0 ? 'bg-[#4F46E5]/10 border-x border-[#4F46E5]/20' : ''
                      }`}
                    >
                      <StatusIcon status={c.data[fi]} highlight={ci === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
