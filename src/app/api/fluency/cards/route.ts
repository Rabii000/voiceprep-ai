import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('fluency_pairs')
    .eq('id', user.id)
    .single()

  if (error) return NextResponse.json({ error: 'Failed to load cards' }, { status: 500 })
  return NextResponse.json({ pairs: data?.fluency_pairs ?? [] })
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let pairs: unknown
  try {
    const body = await req.json()
    pairs = body.pairs
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!Array.isArray(pairs)) {
    return NextResponse.json({ error: 'pairs must be an array' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ fluency_pairs: pairs })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to save cards' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
