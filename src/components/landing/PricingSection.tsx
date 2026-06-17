'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const tiers = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Get a feel for the future of interview prep.',
    cta: 'Start Free',
    ctaHref: '/auth/signup',
    popular: false,
    features: [
      '2 mock sessions per month',
      '15-minute session max',
      '1 AI interviewer voice',
      'Basic scorecard',
      'Last 1 session history',
    ],
    missing: ['AI coaching notes', 'Resume optimizer', 'Panel mode', 'Audio playback'],
  },
  {
    name: 'Pro',
    monthlyPrice: 19,
    annualPrice: 15,
    description: 'Unlimited practice. Full coaching. Real results.',
    cta: 'Start Pro',
    ctaHref: '/auth/signup?plan=pro',
    popular: true,
    features: [
      'Unlimited mock sessions',
      'Up to 60-minute sessions',
      '6 AI interviewer voices',
      'Full scorecard + audio playback',
      'AI coaching notes per question',
      'Resume optimizer + ATS score',
      'Unlimited session history',
      'Panel mode',
      'Stress & Shadow modes',
    ],
    missing: [],
  },
  {
    name: 'Teams',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'For bootcamps, universities, and recruiting firms.',
    cta: 'Contact Sales',
    ctaHref: 'mailto:hello@voiceprepai.com',
    popular: false,
    features: [
      'Everything in Pro',
      'Team admin dashboard',
      'Bulk seat management (min 5)',
      'Usage analytics per seat',
      'Priority support',
      'Custom company question bank',
    ],
    missing: [],
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="bg-[#F8FAFC] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-[#4F46E5]/10 px-4 py-1.5 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">
            Invest in your next offer
          </h2>
          <p className="text-lg text-[#64748B] mb-8">
            One month of Pro costs less than a single bad interview.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !annual ? 'bg-[#4F46E5] text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                annual ? 'bg-[#4F46E5] text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Annual
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${annual ? 'bg-white/20' : 'bg-[#10B981]/15 text-[#10B981]'}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-[#1E1B4B] border-2 border-[#4F46E5] shadow-xl shadow-[#4F46E5]/20'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-[#4F46E5] px-4 py-1.5 text-xs font-semibold text-white">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${tier.popular ? 'text-white' : 'text-[#1E1B4B]'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-4 ${tier.popular ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${tier.popular ? 'text-white' : 'text-[#1E1B4B]'}`}>
                    ${annual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className={`text-sm ${tier.popular ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    {tier.monthlyPrice > 0 ? '/mo' : ''}
                  </span>
                </div>
                {annual && tier.annualPrice > 0 && (
                  <p className="text-xs text-[#10B981] mt-1">billed annually</p>
                )}
              </div>

              <Link href={tier.ctaHref}>
                <Button
                  className={`w-full mb-6 ${
                    tier.popular
                      ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#1E1B4B]'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-[#10B981]' : 'text-[#10B981]'}`} />
                    <span className={tier.popular ? 'text-slate-300' : 'text-[#1E1B4B]'}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#64748B] mt-8">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  )
}
