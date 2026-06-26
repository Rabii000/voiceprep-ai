import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// pdf-parse v2 ships an ESM build without a default export; use require() to
// force CJS resolution and avoid Turbopack's static-export check.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (
  buf: Buffer
) => Promise<{ text: string; numpages: number }>

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
  } catch {
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
