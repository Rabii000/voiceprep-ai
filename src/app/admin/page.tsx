'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users, Mic, TrendingUp, TrendingDown, ArrowUpRight,
  CalendarDays, Crown, Zap, Building2, ChevronRight,
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalSessions: number
  todaySessions: number
  plans: { free: number; pro: number; teams: number }
  recentSignups: { id: string; full_name: string; email: string; plan: string; created_at: string }[]
  signupTrend: { date: string; count: number }[]
}

const PLAN_META = {
  free:  { label: 'Free',  color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
  pro:   { label: 'Pro',   color: 'bg-[#4F46E5]/10 text-[#4F46E5] dark:bg-[#4F46E5]/20',              dot: 'bg-[#4F46E5]' },
  teams: { label: 'Teams', color: 'bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20',              dot: 'bg-[#10B981]' },
}

function PlanBadge({ plan }: { plan: string }) {
  const meta = PLAN_META[plan as keyof typeof PLAN_META] ?? PLAN_META.free
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

function StatCard({ label, value, sub, icon: Icon, trend, color }: {
  label: string; value: string | number; sub: string
  icon: React.ElementType; trend?: 'up' | 'down' | null; color: string
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-[#10B981]" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-[#EF4444]" />}
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{sub}</p>
    </div>
  )
}

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((d, i) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t-sm transition-all ${i === data.length - 1 ? 'bg-rose-500' : 'bg-rose-200 dark:bg-rose-900/50'}`}
            style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalPaid = (stats?.plans.pro ?? 0) + (stats?.plans.teams ?? 0)
  const convRate = stats?.totalUsers
    ? ((totalPaid / stats.totalUsers) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto">

      <div className="mb-8">
        <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-1">Platform Overview</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Real-time platform metrics and user management.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Users" icon={Users} trend="up"
          value={loading ? '—' : (stats?.totalUsers ?? 0).toLocaleString()}
          sub="All time signups"
          color="bg-rose-50 dark:bg-rose-900/20 text-rose-600"
        />
        <StatCard
          label="Sessions Completed" icon={Mic} trend="up"
          value={loading ? '—' : (stats?.totalSessions ?? 0).toLocaleString()}
          sub={`${stats?.todaySessions ?? 0} today`}
          color="bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5]"
        />
        <StatCard
          label="Paid Subscribers" icon={Crown} trend={null}
          value={loading ? '—' : totalPaid.toLocaleString()}
          sub={`${convRate}% conversion`}
          color="bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 text-[#F59E0B]"
        />
        <StatCard
          label="Teams Accounts" icon={Building2} trend={null}
          value={loading ? '—' : (stats?.plans.teams ?? 0).toLocaleString()}
          sub={`${stats?.plans.pro ?? 0} Pro accounts`}
          color="bg-[#10B981]/10 dark:bg-[#10B981]/20 text-[#10B981]"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Signup trend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Signups (7 days)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">New user registrations</p>
            </div>
            <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-600" />
          </div>
          {stats ? (
            <MiniBarChart data={stats.signupTrend} />
          ) : (
            <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          )}
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 mt-2">
            <span>{stats?.signupTrend[0]?.date.slice(5) ?? ''}</span>
            <span>Today</span>
          </div>
        </div>

        {/* Plan distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-[#F59E0B]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Plan Distribution</h2>
          </div>
          {stats ? (
            <div className="space-y-3">
              {(['free', 'pro', 'teams'] as const).map(p => {
                const count = stats.plans[p]
                const pct = stats.totalUsers ? Math.round((count / stats.totalUsers) * 100) : 0
                const meta = PLAN_META[p]
                return (
                  <div key={p}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{count} <span className="font-normal text-slate-400 dark:text-slate-600">({pct}%)</span></span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${meta.dot} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Manage users', sub: 'Search, filter, update plans', href: '/admin/users', icon: Users },
              { label: 'View analytics', sub: 'Session trends, retention', href: '/admin/analytics', icon: TrendingUp },
              { label: 'Platform settings', sub: 'Limits, feature flags', href: '/admin/settings', icon: Zap },
            ].map(a => (
              <Link key={a.href} href={a.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <a.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{a.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent signups */}
      <div className="mt-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Signups</h2>
          <Link href="/admin/users" className="text-xs text-rose-600 hover:underline font-medium">View all users</Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {(stats?.recentSignups ?? []).map(u => (
              <Link key={u.id} href={`/admin/users?highlight=${u.id}`}>
                <div className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex-shrink-0 text-white text-sm font-bold">
                    {(u.full_name ?? u.email ?? 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.full_name || 'Unnamed user'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PlanBadge plan={u.plan} />
                    <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                      {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
