import Link from 'next/link'

export function FooterSection() {
  return (
    <footer className="bg-[#0f0e1a]">
      {/* Big CTA band */}
      <div className="border-t border-b border-white/8">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <p className="text-xs font-semibold text-[#10B981] uppercase tracking-[0.15em] mb-5">Ready to start?</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
            The interview is<br />
            <span className="shimmer-text">coming regardless.</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
            Two free sessions, no credit card. See what 30 minutes of deliberate practice actually feels like.
          </p>
          <Link href="/auth/signup">
            <button className="inline-flex items-center gap-2 bg-white text-[#0f0e1a] hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-2xl shadow-white/10 hover:scale-[1.02]">
              Start practising free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
                <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                <rect x="14" y="6" width="4" height="14" rx="2" fill="white"/>
                <path d="M9 16c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <line x1="16" y1="23" x2="16" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="27" x2="20" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-base font-bold text-white">VoicePrep<span className="text-[#10B981]"> AI</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              Interview practice that feels like the real thing.
            </p>
          </div>

          {[
            {
              heading: 'Product',
              links: ['Features', 'Pricing', 'Roadmap', 'Changelog'],
            },
            {
              heading: 'Tools',
              links: ['Fluency Coach', 'Quick Drill', 'Answer Library', 'Countdown'],
            },
            {
              heading: 'Company',
              links: ['About', 'Blog', 'Privacy', 'Terms'],
            },
          ].map(col => (
            <div key={col.heading}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 VoicePrep AI · Rabii Digital Solutions</p>
          <div className="flex gap-5 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-300 transition-colors">X / Twitter</a>
            <a href="#" className="hover:text-slate-300 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
