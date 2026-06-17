import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VoicePrep AI — Speak your way in.',
  description:
    'The world\'s most intelligent AI interview coach. Upload your resume and JD. Your AI interviewer takes it from there.',
  keywords: ['interview prep', 'AI interview coach', 'mock interview', 'voice interview practice'],
  openGraph: {
    title: 'VoicePrep AI — Speak your way in.',
    description: 'AI-powered voice mock interviews tailored to your resume and job description.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
