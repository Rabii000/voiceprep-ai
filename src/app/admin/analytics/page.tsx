'use client'

import { BarChart3 } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-1">Insights</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Session trends, retention, and engagement metrics.</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <BarChart3 className="h-12 w-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analytics dashboard coming soon</p>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-xs">Session trends, engagement cohorts, and retention analysis will appear here.</p>
      </div>
    </div>
  )
}
