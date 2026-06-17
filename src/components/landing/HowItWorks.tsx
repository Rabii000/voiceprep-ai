import { Upload, Sparkles, Mic } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload',
    description:
      'Drag and drop your resume and paste your target job description. Our AI analyzes both in seconds.',
    color: 'text-[#4F46E5]',
    bg: 'bg-[#4F46E5]/10',
    border: 'border-[#4F46E5]/30',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Generate',
    description:
      'Claude AI generates 30–60 hyper-personalized interview questions across behavioral, technical, and situational categories.',
    color: 'text-[#10B981]',
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/30',
  },
  {
    icon: Mic,
    number: '03',
    title: 'Practice',
    description:
      'Your AI interviewer speaks, listens, and probes in real time. Get a full scorecard with coaching notes when you\'re done.',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/30',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F8FAFC] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-[#4F46E5]/10 px-4 py-1.5 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">
            From upload to offer — in three steps
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            No scheduling. No waiting for a partner. Just you, your AI coach, and the confidence to walk into any interview.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border ${step.border} ${step.bg} p-8 transition-transform hover:-translate-y-1`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.bg} border ${step.border}`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <span className="text-5xl font-bold text-black/5 select-none">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] mb-3">{step.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
