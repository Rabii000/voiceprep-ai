'use client'

import { Settings } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-1">Configuration</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Platform configuration, feature flags, and limits.</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Settings className="h-12 w-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Settings panel coming soon</p>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-xs">Session limits, plan configuration, and feature flags will be managed here.</p>
      </div>
    </div>
  )
}
