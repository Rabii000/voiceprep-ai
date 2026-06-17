import { NextRequest, NextResponse } from 'next/server'
import { generateQuestions, analyzeDocuments } from '@/lib/ai/questions'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, count } = await req.json()

    if (!resumeText?.trim() || !jdText?.trim()) {
      return NextResponse.json({ error: 'Resume and job description are required.' }, { status: 400 })
    }

    const [questions, analysis] = await Promise.all([
      generateQuestions(resumeText, jdText, count ?? 30),
      analyzeDocuments(resumeText, jdText),
    ])

    return NextResponse.json({ questions, analysis })
  } catch (err) {
    console.error('[/api/questions]', err)
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 })
  }
}
