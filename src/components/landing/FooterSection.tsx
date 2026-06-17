import Link from 'next/link'
import { Mic, ExternalLink } from 'lucide-react'

export function FooterSection() {
  return (
    <footer className="bg-[#0f0e1a] border-t border-white/10 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                VoicePrep <span className="text-[#10B981]">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The world's most intelligent interview coach — always available, radically personalized.
            </p>
            <div className="flex gap-4 text-xs">
              {['X', 'LinkedIn', 'YouTube'].map(s => (
                <a key={s} href="#" className="text-slate-500 hover:text-white transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Compare', 'Roadmap'].map(item => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 VoicePrep AI — Rabii Digital Solutions. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with Claude AI + ElevenLabs
          </p>
        </div>
      </div>
    </footer>
  )
}
