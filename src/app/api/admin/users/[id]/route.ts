import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/users/[id] — full user profile + session history
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin()
  if ('error' in result) return result.error
  const { adminDb } = result
  const { id } = await params

  const [{ data: profile }, { data: sessions }] = await Promise.all([
    adminDb
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single(),
    adminDb
      .from('sessions')
      .select('id, status, interview_type, mode, overall_score, duration_minutes, target_role, target_company, created_at, completed_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ profile, sessions: sessions ?? [] })
}

// PATCH /api/admin/users/[id] — update plan, is_admin, or suspend
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin()
  if ('error' in result) return result.error
  const { adminDb } = result
  const { id } = await params

  const body = await req.json()

  // Only allow specific fields to be updated
  const allowed: Record<string, unknown> = {}
  const ALLOWED_FIELDS = ['plan', 'is_admin', 'sessions_used', 'target_role', 'experience_level', 'full_name']
  for (const field of ALLOWED_FIELDS) {
    if (field in body) allowed[field] = body[field]
  }

  // Validate plan value
  if ('plan' in allowed && !['free', 'pro', 'teams'].includes(allowed.plan as string)) {
    return NextResponse.json({ error: 'Invalid plan value' }, { status: 400 })
  }

  const { data, error } = await adminDb
    .from('profiles')
    .update({ ...allowed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: data })
}

// DELETE /api/admin/users/[id] — hard delete user from auth + cascade
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin()
  if ('error' in result) return result.error
  const { adminDb } = result
  const { id } = await params

  const { error } = await adminDb.auth.admin.deleteUser(id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
