import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const result = await requireAdmin()
  if ('error' in result) return result.error
  const { adminDb } = result

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const plan = searchParams.get('plan') ?? 'all'
  const sort = searchParams.get('sort') ?? 'created_at'
  const order = searchParams.get('order') ?? 'desc'
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const pageSize = 25

  let query = adminDb
    .from('profiles')
    .select(`
      id, full_name, email, plan, sessions_used, streak_days,
      last_active_date, experience_level, target_role, target_industry,
      created_at, updated_at, is_admin
    `, { count: 'exact' })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (plan !== 'all') {
    query = query.eq('plan', plan)
  }

  const validSortCols = ['created_at', 'last_active_date', 'sessions_used', 'full_name', 'plan']
  const col = validSortCols.includes(sort) ? sort : 'created_at'
  query = query
    .order(col, { ascending: order === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch session counts + avg scores in one query
  const userIds = (data ?? []).map(u => u.id)
  const { data: sessionStats } = await adminDb
    .from('sessions')
    .select('user_id, overall_score')
    .in('user_id', userIds)
    .eq('status', 'completed')

  const statsMap: Record<string, { count: number; total: number }> = {}
  sessionStats?.forEach(s => {
    if (!statsMap[s.user_id]) statsMap[s.user_id] = { count: 0, total: 0 }
    statsMap[s.user_id].count++
    if (s.overall_score) statsMap[s.user_id].total += s.overall_score
  })

  const enriched = (data ?? []).map(u => ({
    ...u,
    sessions_completed: statsMap[u.id]?.count ?? 0,
    avg_score: statsMap[u.id]?.count
      ? Math.round(statsMap[u.id].total / statsMap[u.id].count)
      : null,
  }))

  return NextResponse.json({
    users: enriched,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  })
}
