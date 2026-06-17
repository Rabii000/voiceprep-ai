import { NextRequest, NextResponse } from 'next/server'
import { generateQuestions, analyzeDocuments } from '@/lib/ai/questions'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const MAX_TEXT_LENGTH = 50_000
const MAX_COUNT = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 5 question-generation requests per user per minute
    const rl = rateLimit(`questions:${user.id}`, 5, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetInMs / 1000)) } }
      )
    }

    const { resumeText, jdText, count } = await req.json()

    if (!resumeText?.trim() || !jdText?.trim()) {
      return NextResponse.json({ error: 'Resume and job description are required.' }, { status: 400 })
    }
    if (resumeText.length > MAX_TEXT_LENGTH || jdText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: 'Input too large.' }, { status: 413 })
    }

    const safeCount = Math.min(Math.max(1, parseInt(count ?? '30', 10) || 30), MAX_COUNT)

    const [questions, analysis] = await Promise.all([
      generateQuestions(resumeText, jdText, safeCount),
      analyzeDocuments(resumeText, jdText),
    ])

    return NextResponse.json({ questions, analysis })
  } catch (err) {
    console.error('[/api/questions]', err)
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 })
  }
}
