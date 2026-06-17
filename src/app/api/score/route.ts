import { NextRequest, NextResponse } from 'next/server'
import { scoreSession } from '@/lib/ai/questions'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const MAX_TRANSCRIPT_ENTRIES = 200
const MAX_TEXT_LENGTH = 50_000

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 10 score requests per user per minute
    const rl = rateLimit(`score:${user.id}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) } }
      )
    }

    const { transcript, resumeText, jdText } = await req.json()

    if (!transcript?.length) {
      return NextResponse.json({ error: 'Transcript is required.' }, { status: 400 })
    }
    if (!Array.isArray(transcript) || transcript.length > MAX_TRANSCRIPT_ENTRIES) {
      return NextResponse.json({ error: 'Invalid transcript.' }, { status: 400 })
    }
    if ((resumeText?.length ?? 0) > MAX_TEXT_LENGTH || (jdText?.length ?? 0) > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: 'Input too large.' }, { status: 413 })
    }

    const scorecard = await scoreSession(transcript, resumeText ?? '', jdText ?? '')
    return NextResponse.json({ scorecard })
  } catch (err) {
    console.error('[/api/score]', err)
    return NextResponse.json({ error: 'Failed to score session.' }, { status: 500 })
  }
}
