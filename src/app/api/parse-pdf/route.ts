import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'PDF must be under 5 MB' }, { status: 400 })

    const buf = Buffer.from(await file.arrayBuffer())
    const result = await pdfParse(buf)
    return NextResponse.json({ text: result.text, pages: result.numpages })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
