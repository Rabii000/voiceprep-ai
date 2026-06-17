import { NextRequest, NextResponse } from 'next/server'
import { scoreSession } from '@/lib/ai/questions'

export async function POST(req: NextRequest) {
  try {
    const { transcript, resumeText, jdText } = await req.json()

    if (!transcript?.length) {
      return NextResponse.json({ error: 'Transcript is required.' }, { status: 400 })
    }

    const scorecard = await scoreSession(transcript, resumeText ?? '', jdText ?? '')
    return NextResponse.json({ scorecard })
  } catch (err) {
    console.error('[/api/score]', err)
    return NextResponse.json({ error: 'Failed to score session.' }, { status: 500 })
  }
}
