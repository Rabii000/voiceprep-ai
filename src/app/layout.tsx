import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import SplashScreen from '@/components/SplashScreen'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VoicePrep AI — Speak your way in.',
  description:
    "The world's most intelligent AI interview coach. Upload your resume and JD. Your AI interviewer takes it from there.",
  keywords: ['interview prep', 'AI interview coach', 'mock interview', 'voice interview practice'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'VoicePrep AI — Speak your way in.',
    description: 'AI-powered voice mock interviews tailored to your resume and job description.',
    type: 'website',
    images: [{ url: '/logo.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoicePrep AI',
    description: 'AI-powered voice mock interview coach.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E1B4B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <SplashScreen />
        {children}
      </body>
    </html>
  )
}
