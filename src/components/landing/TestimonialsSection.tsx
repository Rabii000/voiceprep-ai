import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer → Senior SWE at Stripe',
    avatar: 'PS',
    quote:
      'I did 12 sessions in two weeks before my Stripe final. The AI interviewer asked a follow-up I\'d never thought about — and that exact question came up in the real interview. I knew exactly what to say.',
    outcome: 'Offer accepted',
  },
  {
    name: 'Marcus Williams',
    role: 'Marketing Manager → Director at Adobe',
    avatar: 'MW',
    quote:
      'The filler word analysis was eye-opening. I said "um" 34 times in my first session. By my third, I was down to 6. That kind of feedback is impossible to get from a friend.',
    outcome: '40% salary increase',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Career Returner → Product Manager at Shopify',
    avatar: 'YT',
    quote:
      'After three years away, I had no idea how to talk about my gap. VoicePrep helped me reframe it into a strength. The confidence score going up each session kept me motivated.',
    outcome: 'Returned to tech',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-[#F8FAFC] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-[#4F46E5]/10 px-4 py-1.5 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider mb-4">
            Success Stories
          </span>
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">
            Real candidates. Real offers.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#1E1B4B] leading-relaxed mb-6 text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-white text-sm font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#1E1B4B] text-sm">{t.name}</p>
                  <p className="text-xs text-[#64748B]">{t.role}</p>
                </div>
                <div className="ml-auto rounded-full bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981]">
                  {t.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
