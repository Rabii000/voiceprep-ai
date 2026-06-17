/**
 * Sliding-window in-memory rate limiter.
 * Works per warm serverless instance — good enough to stop runaway abuse
 * without Redis. Each limit key is namespaced so routes don't share counters.
 */

interface Window {
  timestamps: number[]
  blocked: boolean
}

const store = new Map<string, Window>()

// Prune entries older than 10 minutes every 5 minutes to avoid memory growth
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000
  for (const [key, win] of store) {
    win.timestamps = win.timestamps.filter(t => t > cutoff)
    if (win.timestamps.length === 0) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * @param key      Unique key — combine route + user id, e.g. "questions:user-uuid"
 * @param limit    Max requests allowed within `windowMs`
 * @param windowMs Sliding window in milliseconds (default 60s)
 * @returns        { allowed: boolean, remaining: number, resetInMs: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const cutoff = now - windowMs

  if (!store.has(key)) store.set(key, { timestamps: [], blocked: false })
  const win = store.get(key)!

  win.timestamps = win.timestamps.filter(t => t > cutoff)

  if (win.timestamps.length >= limit) {
    const oldest = win.timestamps[0]
    return { allowed: false, remaining: 0, resetInMs: oldest + windowMs - now }
  }

  win.timestamps.push(now)
  return { allowed: true, remaining: limit - win.timestamps.length, resetInMs: 0 }
}
