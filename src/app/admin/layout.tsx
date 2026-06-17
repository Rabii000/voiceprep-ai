import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { AdminShell } from '@/components/AdminShell'

export const metadata = { title: 'Admin — VoicePrep AI' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()
  if (!admin) redirect('/dashboard')

  return <AdminShell>{children}</AdminShell>
}
