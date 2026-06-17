import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
