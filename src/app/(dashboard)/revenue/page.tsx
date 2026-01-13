import { createClient } from '@/lib/supabase/server'
import { RevenueContent } from '.'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export default async function RevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

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

  // Fetch won deals for revenue tracking
  const { data: wonDeals } = await supabase
    .from('deals')
    .select(`
      id,
      title,
      amount,
      currency,
      brand:brands(id, name)
    `)
    .eq('user_id', user.id)
    .eq('status', 'won')
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
