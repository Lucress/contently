import { createClient } from '@/lib/supabase/server'
import { getPlan, type PlanConfig } from '@/lib/plans'

// Fetch the user's current plan from the DB.
// Always returns a PlanConfig — defaults to free if no subscription found.
export async function getUserPlan(userId: string): Promise<PlanConfig & { status: string }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single() as { data: { plan: string; status: string } | null }

  const plan = getPlan(data?.plan)
  const status = data?.status || 'active'

  // Downgrade to free if subscription is in a non-paying state
  if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
    return { ...getPlan('free'), status }
  }

  return { ...plan, status }
}
