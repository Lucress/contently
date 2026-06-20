import { createClient } from '@/lib/supabase/server'
import { RevenueContent } from '.'
import { subMonths, format } from 'date-fns'
import { getUserPlan } from '@/lib/subscription'
import { PlanGate } from '@/components/plan-gate'

export const dynamic = 'force-dynamic'

export default async function RevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const plan = await getUserPlan(user.id)
  if (!plan.features.revenue) {
    return (
      <PlanGate
        featureName="Revenue Tracking"
        featureDescription="Log sponsorship income, track deals, and see your monthly earnings at a glance."
        requiredPlan="pro"
        currentPlan={plan.id}
        featureEmoji="💰"
      />
    )
  }

  const today = new Date()
  const sixMonthsAgo = subMonths(today, 6)

  // Fetch revenues for the last 6 months
  const { data: revenues } = await supabase
    .from('revenues')
    .select(`
      *,
      deal:deals(id, title, brand:brands(id, name))
    `)
    .eq('user_id', user.id)
    .gte('date', format(sixMonthsAgo, 'yyyy-MM-dd'))
    .order('date', { ascending: false })

  // Fetch analytics snapshots
  const { data: analytics } = await supabase
    .from('analytics_snapshots')
    .select('*')
    .eq('user_id', user.id)
    .gte('snapshot_date', format(sixMonthsAgo, 'yyyy-MM-dd'))
    .order('snapshot_date')

  // Fetch completed/paid/invoiced deals for revenue tracking
  const { data: wonDeals } = await supabase
    .from('deals')
    .select(`
      id,
      title,
      budget,
      currency,
      brand:brands(id, name)
    `)
    .eq('user_id', user.id)
    .in('status', ['completed', 'paid', 'invoiced'])
    .order('created_at', { ascending: false })

  return (
    <RevenueContent 
      revenues={revenues || []}
      analytics={analytics || []}
      wonDeals={wonDeals || []}
      userId={user.id}
    />
  )
}
