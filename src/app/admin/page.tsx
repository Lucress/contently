import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { AdminDashboard } from './admin-content'

const ADMIN_EMAIL = 'ulriche.tankeu@celebrate.company'

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const admin = getAdminClient()

  // Parallel fetch all platform stats
  const [
    { data: profiles, count: totalUsers },
    { data: subscriptions },
    { data: recentUsers },
    { data: ideas, count: totalIdeas },
    { data: inspirations, count: totalInspirations },
    { data: deals, count: totalDeals },
    { data: revenues },
    { data: blogViews },
  ] = await Promise.all([
    admin.from('profiles').select('id, created_at, full_name', { count: 'exact' }).order('created_at', { ascending: false }),
    admin.from('subscriptions').select('user_id, plan, status, current_period_end').eq('status', 'active'),
    admin.from('profiles').select('id, full_name, email, created_at').order('created_at', { ascending: false }).limit(10),
    admin.from('ideas').select('id', { count: 'exact' }),
    admin.from('inspirations').select('id', { count: 'exact' }),
    admin.from('deals').select('id', { count: 'exact' }),
    admin.from('revenues').select('amount, source, date').gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    // Approximate signups per day for the last 30 days
    admin.from('profiles').select('created_at').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  // Plan breakdown
  const planBreakdown = {
    free: (totalUsers || 0) - (subscriptions?.length || 0),
    pro: subscriptions?.filter(s => (s as any).plan === 'pro').length || 0,
    creator_plus: subscriptions?.filter(s => (s as any).plan === 'creator_plus').length || 0,
  }

  // MRR calculation
  const mrr =
    planBreakdown.pro * 4.99 +
    planBreakdown.creator_plus * 9.99

  // Sign-ups per day (last 30 days)
  const signupsByDay: Record<string, number> = {}
  blogViews?.forEach((p) => {
    const day = p.created_at.split('T')[0]
    signupsByDay[day] = (signupsByDay[day] || 0) + 1
  })
  const signupChartData = Object.entries(signupsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date, count }))

  // User revenue this month
  const monthlyRevenue = revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

  return (
    <AdminDashboard
      stats={{
        totalUsers: totalUsers || 0,
        activeSubscriptions: subscriptions?.length || 0,
        mrr,
        totalIdeas: totalIdeas || 0,
        totalInspirations: totalInspirations || 0,
        totalDeals: totalDeals || 0,
        monthlyRevenue,
        planBreakdown,
      }}
      recentUsers={recentUsers || []}
      signupChartData={signupChartData}
    />
  )
}
