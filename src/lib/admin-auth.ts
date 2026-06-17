import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Call at the top of every admin API route.
 * Returns { user, adminDb } on success, or a 401/403 NextResponse to return immediately.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const email = user.email?.toLowerCase() ?? ''
  const isEnvAdmin = ADMIN_EMAILS.includes(email)

  if (!isEnvAdmin) {
    // Fallback: check is_admin flag in profiles table
    const adminDb = createAdminClient()
    const { data: profile } = await adminDb
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    }
  }

  return { user, adminDb: createAdminClient() }
}

/**
 * Check admin status for use in server components (layout guard).
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const email = user.email?.toLowerCase() ?? ''
    if (ADMIN_EMAILS.includes(email)) return true

    const adminDb = createAdminClient()
    const { data } = await adminDb
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return data?.is_admin === true
  } catch {
    return false
  }
}
