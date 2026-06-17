'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Start fade-out at 3.4 s, fully gone by 4 s
    const fadeTimer = setTimeout(() => setFading(true), 3400)
    const hideTimer = setTimeout(() => setVisible(false), 4000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #2d2a6e 50%, #1E1B4B 100%)',
        transition: 'opacity 0.6s ease',
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Logo mark */}
      <div style={{ marginBottom: 28, animation: 'splashPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <svg viewBox="0 0 120 120" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5"/>
              <stop offset="100%" stopColor="#3730A3"/>
            </linearGradient>
            <linearGradient id="sp-mint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34D399"/>
              <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
          </defs>
          <rect width="120" height="120" rx="28" fill="url(#sp-bg)"/>
          {/* Capsule / speech bubble */}
          <rect x="33" y="16" width="54" height="62" rx="27" fill="white" opacity="0.97"/>
          {/* Tail */}
          <path d="M 42 72 L 33 90 L 56 76" fill="white" opacity="0.97"/>
          {/* Waveform bars */}
          <rect x="41" y="54" width="7" height="16" rx="3.5" fill="url(#sp-mint)"/>
          <rect x="52" y="44" width="7" height="26" rx="3.5" fill="url(#sp-mint)"/>
          <rect x="63" y="36" width="7" height="34" rx="3.5" fill="#4F46E5"/>
          <rect x="74" y="44" width="7" height="26" rx="3.5" fill="url(#sp-mint)"/>
          <rect x="85" y="54" width="7" height="16" rx="3.5" fill="url(#sp-mint)"/>
          {/* Stand stem */}
          <rect x="57" y="78" width="6" height="16" rx="3" fill="white" opacity="0.9"/>
          {/* Base */}
          <rect x="43" y="91" width="34" height="6" rx="3" fill="white" opacity="0.9"/>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ animation: 'splashFadeUp 0.5s 0.2s ease both' }}>
        <span style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: 'white',
        }}>
          VoicePrep{' '}
          <span style={{ color: '#34D399' }}>AI</span>
        </span>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 10, animation: 'splashFadeUp 0.5s 0.35s ease both' }}>
        <span style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Speak your way in.
        </span>
      </div>

      {/* Pulsing mic dot */}
      <div style={{ marginTop: 48, animation: 'splashFadeUp 0.5s 0.5s ease both' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#10B981',
          animation: 'splashPulse 1.2s ease-in-out infinite',
        }}/>
      </div>

      <style>{`
        @keyframes splashPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes splashFadeUp {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes splashPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
