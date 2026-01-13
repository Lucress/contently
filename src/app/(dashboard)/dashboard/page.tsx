import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '.'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch dashboard data
  const [
    { data: profile },
    { data: ideas },
    { data: inspirations },
    { data: deals },
    { data: tasks },
    { data: revenues },
    { data: contentPillars },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('inspirations').select('*').eq('user_id', user.id).eq('is_processed', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('deals').select('*, brands(name)').eq('user_id', user.id).not('status', 'in', '("completed","lost","cancelled")').order('created_at', { ascending: false }).limit(5),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', false).order('due_date', { ascending: true }).limit(5),
    supabase.from('revenues').select('amount, date, source').eq('user_id', user.id).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    supabase.from('content_pillars').select('*').eq('user_id', user.id).eq('is_active', true).order('sort_order', { ascending: true }),
  ])

  // Calculate stats with type assertion
  const ideasTyped = ideas as { status: string; pillar_id: string | null; [key: string]: unknown }[] | null
  const revenuesTyped = revenues as { amount: number; date: string; source: string }[] | null
  const contentPillarsTyped = contentPillars as { id: string; name: string; description: string | null; color: string; icon: string }[] | null
  
  const stats = {
    totalIdeas: ideasTyped?.length || 0,
    draftIdeas: ideasTyped?.filter(i => i.status === 'draft').length || 0,
    toFilmIdeas: ideasTyped?.filter(i => i.status === 'to_film').length || 0,
    publishedIdeas: ideasTyped?.filter(i => i.status === 'published').length || 0,
    pendingInspirations: inspirations?.length || 0,
    activeDeals: deals?.length || 0,
    pendingTasks: tasks?.length || 0,
    monthlyRevenue: revenuesTyped?.reduce((sum, r) => sum + Number(r.amount), 0) || 0,
  }

  // Ideas by status for chart - use brand colors
  const ideasByStatus = [
    { status: 'Draft', count: stats.draftIdeas, color: '#9ca3af' },
    { status: 'To Film', count: stats.toFilmIdeas, color: '#a78bfa' },
    { status: 'Editing', count: ideasTyped?.filter(i => i.status === 'editing').length || 0, color: '#8b5cf6' },
    { status: 'Published', count: stats.publishedIdeas, color: '#22c55e' },
  ]

  // Map content pillars with idea counts
  const pillarsWithData = contentPillarsTyped?.map(pillar => {
    const ideasForPillar = ideasTyped?.filter(i => i.pillar_id === pillar.id) || []
    return {
      ...pillar,
      ideaCount: ideasForPillar.length,
    }
  }) || []

  return (
    <DashboardContent
      profile={profile}
      stats={stats}
      ideas={ideas || []}
      inspirations={inspirations || []}
      deals={deals || []}
      tasks={tasks || []}
      ideasByStatus={ideasByStatus}
      contentPillars={pillarsWithData}
    />
  )
}
