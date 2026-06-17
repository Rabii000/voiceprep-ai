import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 20 session creates per user per hour
    const rl = rateLimit(`session-create:${user.id}`, 20, 60 * 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before starting another session.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) } }
      )
    }

    const body = await req.json()
    const { duration_minutes, interview_type, mode, voice_id, resume_text, jd_text } = body

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        duration_minutes,
        interview_type,
        mode,
        voice_id,
        resume_text,
        jd_text,
        status: 'setup',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ session: data })
  } catch (err) {
    console.error('[/api/session]', err)
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { session_id, status, score } = await req.json()

    const VALID_STATUSES = ['setup', 'active', 'completed', 'abandoned']
    if (!session_id || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      return NextResponse.json({ error: 'Invalid score.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sessions')
      .update({
        status,
        score,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq('id', session_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ session: data })
  } catch (err) {
    console.error('[/api/session PATCH]', err)
    return NextResponse.json({ error: 'Failed to update session.' }, { status: 500 })
  }
}
