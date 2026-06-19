import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

async function cookieHandlers() {
  const cookieStore = await cookies()
  return {
    get(name: string) { return cookieStore.get(name)?.value },
    set(name: string, value: string, options: CookieOptions) {
      try { cookieStore.set({ name, value, ...options }) } catch {}
    },
    remove(name: string, options: CookieOptions) {
      try { cookieStore.set({ name, value: '', ...options }) } catch {}
    },
  }
}

export async function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: await cookieHandlers() }
  )
}

export async function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: await cookieHandlers() }
  )
}

// Untyped client for tables where the generated Database type doesn't match
// the actual schema (e.g. email_accounts uses a different column layout).
export async function createUntypedServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: await cookieHandlers() }
  )
}
