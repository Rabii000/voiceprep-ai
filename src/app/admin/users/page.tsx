'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Search, ChevronLeft, ChevronRight, MoreHorizontal,
  Crown, User as UserIcon, Building2, X, Loader2,
  ChevronDown, ChevronUp, Trash2, Shield, Mic, Calendar,
  TrendingUp, ArrowUpDown,
} from 'lucide-react'

interface UserRow {
  id: string
  full_name: string | null
  email: string
  plan: 'free' | 'pro' | 'teams'
  sessions_used: number
  sessions_completed: number
  avg_score: number | null
  streak_days: number
  last_active_date: string | null
  created_at: string
  experience_level: string | null
  target_role: string | null
  is_admin: boolean
}

interface UserDetail {
  profile: UserRow
  sessions: {
    id: string; status: string; interview_type: string; mode: string
    overall_score: number | null; duration_minutes: number | null
    target_role: string | null; target_company: string | null; created_at: string
  }[]
}

interface PageData {
  users: UserRow[]; total: number; page: number; pageSize: number; totalPages: number
}

const PLAN_META = {
  free:  { label: 'Free',  bg: 'bg-slate-100 dark:bg-slate-800',   text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400', icon: UserIcon },
  pro:   { label: 'Pro',   bg: 'bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20', text: 'text-[#4F46E5]',  dot: 'bg-[#4F46E5]', icon: Crown },
  teams: { label: 'Teams', bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/20', text: 'text-[#10B981]',  dot: 'bg-[#10B981]', icon: Building2 },
}

function PlanBadge({ plan }: { plan: string }) {
  const meta = PLAN_META[plan as keyof typeof PLAN_META] ?? PLAN_META.free
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
  const color = score >= 80 ? 'text-[#10B981]' : score >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
  return <span className={`text-sm font-bold tabular-nums ${color}`}>{score}</span>
}

function Avatar({ name, email }: { name: string | null; email: string }) {
  const ch = (name ?? email ?? 'U')[0].toUpperCase()
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex-shrink-0 text-white text-xs font-bold">
      {ch}
    </div>
  )
}

// Detail drawer
function UserDrawer({ userId, onClose, onUpdated }: {
  userId: string; onClose: () => void; onUpdated: () => void
}) {
  const [data, setData] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [planLoading, setPlanLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [userId])

  const changePlan = async (plan: string) => {
    setPlanLoading(true)
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const r = await fetch(`/api/admin/users/${userId}`)
    setData(await r.json())
    setPlanLoading(false)
    onUpdated()
  }

  const deleteUser = async () => {
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    onClose()
    onUpdated()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#111118] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">User Detail</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto">
            {/* profile header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#10B981] text-white text-xl font-bold">
                  {(data.profile.full_name ?? data.profile.email ?? 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{data.profile.full_name || 'Unnamed user'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{data.profile.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <PlanBadge plan={data.profile.plan} />
                    {data.profile.is_admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 px-2 py-0.5 text-xs font-semibold">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sessions', value: data.profile.sessions_completed },
                  { label: 'Avg Score', value: data.profile.avg_score ?? '—' },
                  { label: 'Streak', value: `${data.profile.streak_days}d` },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* change plan */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Change Plan</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['free', 'pro', 'teams'] as const).map(p => {
                  const meta = PLAN_META[p]
                  const active = data.profile.plan === p
                  return (
                    <button
                      key={p}
                      disabled={active || planLoading}
                      onClick={() => changePlan(p)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border transition-all text-sm font-semibold ${
                        active
                          ? `${meta.bg} ${meta.text} border-transparent`
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      } ${planLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <meta.icon className="h-4 w-4" />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* meta */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Profile</h3>
              <dl className="space-y-2.5">
                {[
                  { label: 'Joined', value: new Date(data.profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                  { label: 'Last active', value: data.profile.last_active_date ? new Date(data.profile.last_active_date).toLocaleDateString() : 'Never' },
                  { label: 'Target role', value: data.profile.target_role ?? '—' },
                  { label: 'Experience', value: data.profile.experience_level ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="text-xs font-medium text-slate-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* session history */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Recent Sessions ({data.sessions.length})
              </h3>
              {data.sessions.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-600">No sessions yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.sessions.map(s => (
                    <div key={s.id} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                      <Mic className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {s.interview_type || s.mode || 'Session'}
                          {s.target_company ? ` · ${s.target_company}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {new Date(s.created_at).toLocaleDateString()} · {s.duration_minutes ? `${s.duration_minutes}m` : '—'}
                        </p>
                      </div>
                      <ScoreBadge score={s.overall_score} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800">
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/5 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete user
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-center text-slate-500 dark:text-slate-400">This will permanently delete the user and all their data.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(false)} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button onClick={deleteUser} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors">
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function AdminUsersPage() {
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('all')
  const [sort, setSort] = useState('created_at')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ search, plan, sort, order, page: String(page) })
    fetch(`/api/admin/users?${params}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search, plan, sort, order, page])

  useEffect(() => { load() }, [load])

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
  }

  const toggleSort = (col: string) => {
    if (sort === col) setOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSort(col); setOrder('desc') }
    setPage(1)
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sort !== col) return <ArrowUpDown className="h-3 w-3 text-slate-300 dark:text-slate-600" />
    return order === 'asc'
      ? <ChevronUp className="h-3 w-3 text-[#4F46E5]" />
      : <ChevronDown className="h-3 w-3 text-[#4F46E5]" />
  }

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-1">User Management</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Users</h1>
        {data && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {data.total.toLocaleString()} total users
          </p>
        )}
      </div>

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 dark:focus:ring-[#4F46E5]/30"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'free', 'pro', 'teams'] as const).map(p => (
            <button
              key={p}
              onClick={() => { setPlan(p); setPage(1) }}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                plan === p
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {p === 'all' ? 'All plans' : p}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {[
                  { label: 'User', col: 'full_name' },
                  { label: 'Plan', col: 'plan' },
                  { label: 'Sessions', col: 'sessions_used' },
                  { label: 'Avg Score', col: null },
                  { label: 'Last active', col: 'last_active_date' },
                  { label: 'Joined', col: 'created_at' },
                  { label: '', col: null },
                ].map(({ label, col }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 ${col ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white select-none' : ''}`}
                    onClick={col ? () => toggleSort(col) : undefined}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      {col && <SortIcon col={col} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" style={{ width: j === 0 ? '140px' : j === 6 ? '24px' : '70px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (data?.users ?? []).map(u => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(u.id)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.full_name} email={u.email} />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white leading-none">
                          {u.full_name || 'Unnamed user'}
                          {u.is_admin && <Shield className="inline h-3 w-3 ml-1 text-rose-500" />}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><PlanBadge plan={u.plan} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Mic className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                      <span className="text-slate-900 dark:text-white font-medium tabular-nums">{u.sessions_completed}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><ScoreBadge score={u.avg_score} /></td>
                  <td className="px-4 py-3.5">
                    {u.last_active_date ? (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(u.last_active_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 dark:text-slate-600">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedUser(u.id) }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Page {data.page} of {data.totalPages} · {data.total} users
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* empty */}
        {!loading && data?.users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UserIcon className="h-10 w-10 text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No users found</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* detail drawer */}
      {selectedUser && (
        <UserDrawer
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={load}
        />
      )}
    </div>
  )
}
