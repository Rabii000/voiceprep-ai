import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const result = await requireAdmin()
  if ('error' in result) return result.error
  const { adminDb } = result

  const [
    { count: totalUsers },
    { count: totalSessions },
    { count: todaySessions },
    { data: planDist },
    { data: recentSignups },
  ] = await Promise.all([
    adminDb.from('profiles').select('*', { count: 'exact', head: true }),
    adminDb.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    adminDb.from('sessions').select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    adminDb.from('profiles').select('plan'),
    adminDb.from('profiles')
      .select('id, full_name, email, plan, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const plans = { free: 0, pro: 0, teams: 0 }
  planDist?.forEach(p => {
    const plan = p.plan as keyof typeof plans
    if (plan in plans) plans[plan]++
  })

  // 7-day signups trend
  const { data: signupTrend } = await adminDb
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString())

  const trendByDay: Record<string, number> = {}
  signupTrend?.forEach(r => {
    const day = r.created_at.slice(0, 10)
    trendByDay[day] = (trendByDay[day] ?? 0) + 1
  })
  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400_000)
    const key = d.toISOString().slice(0, 10)
    return { date: key, count: trendByDay[key] ?? 0 }
  })

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalSessions: totalSessions ?? 0,
    todaySessions: todaySessions ?? 0,
    plans,
    recentSignups: recentSignups ?? [],
    signupTrend: trend,
  })
}
