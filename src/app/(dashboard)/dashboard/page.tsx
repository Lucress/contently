import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '.'

export const dynamic = 'force-dynamic'

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
    { data: allIdeaStatuses },
    { data: inspirations },
    { data: deals },
    { data: tasks },
    { data: revenues },
    { data: contentPillars },
    { data: contentTypes },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('ideas').select('status, pillar_id').eq('user_id', user.id),
    supabase.from('inspirations').select('*').eq('user_id', user.id).eq('is_processed', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('deals').select('*, brands(name)').eq('user_id', user.id).not('status', 'in', '("completed","lost","cancelled")').order('created_at', { ascending: false }).limit(5),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', false).order('due_date', { ascending: true }).limit(5),
    supabase.from('revenues').select('amount, date, source').eq('user_id', user.id).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    supabase.from('content_pillars').select('*').eq('user_id', user.id).eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('content_types').select('id, name, icon, color').eq('user_id', user.id).eq('is_active', true).order('sort_order', { ascending: true }),
  ])

  // Use all idea statuses (no limit) for accurate counts
  const allStatuses = allIdeaStatuses as { status: string; pillar_id: string | null }[] | null
  const revenuesTyped = revenues as { amount: number; date: string; source: string }[] | null
  const contentPillarsTyped = contentPillars as { id: string; name: string; description: string | null; color: string; icon: string }[] | null
  const contentTypesTyped = contentTypes as { id: string; name: string; icon: string; color: string }[] | null

  const countByStatus = (status: string) => {
    if (status === 'idea') {
      return allStatuses?.filter(i => i.status === 'idea' || i.status === 'draft' || i.status === 'planned').length || 0
    }
    return allStatuses?.filter(i => i.status === status).length || 0
  }

  const stats = {
    totalIdeas: allStatuses?.length || 0,
    draftIdeas: countByStatus('draft'),
    toFilmIdeas: countByStatus('to_film'),
    publishedIdeas: countByStatus('published'),
    pendingInspirations: inspirations?.length || 0,
    activeDeals: deals?.length || 0,
    pendingTasks: tasks?.length || 0,
    monthlyRevenue: revenuesTyped?.reduce((sum, r) => sum + Number(r.amount), 0) || 0,
  }

  // Pipeline order — idea bucket absorbs legacy draft/planned
  const STATUS_PIPELINE = [
    { status: 'Idea',      key: 'idea',      color: '#f59e0b' },
    { status: 'Scripted',  key: 'scripted',  color: '#3b82f6' },
    { status: 'To Film',   key: 'to_film',   color: '#8b5cf6' },
    { status: 'Filmed',    key: 'filmed',    color: '#a855f7' },
    { status: 'Editing',   key: 'editing',   color: '#f97316' },
    { status: 'Scheduled', key: 'scheduled', color: '#06b6d4' },
    { status: 'Published', key: 'published', color: '#22c55e' },
  ]

  const ideasByStatus = STATUS_PIPELINE
    .map(s => ({ status: s.status, count: countByStatus(s.key), color: s.color }))
    .filter(s => s.count > 0)

  // Map content pillars with idea counts and parse metadata from icon field
  const pillarsWithData = contentPillarsTyped?.map(pillar => {
    const ideasForPillar = allStatuses?.filter(i => i.pillar_id === pillar.id) || []
    
    // Parse hashtags and contentType from icon field (stored as JSON)
    let hashtags: string[] = []
    let contentType: string | undefined = undefined
    
    try {
      if (pillar.icon && pillar.icon.startsWith('{')) {
        const meta = JSON.parse(pillar.icon)
        hashtags = meta.hashtags || []
        contentType = meta.contentType || undefined
      }
    } catch {
      // If parsing fails, icon is just an emoji, ignore
    }
    
    return {
      ...pillar,
      ideaCount: (ideasForPillar as { status: string; pillar_id: string | null }[]).length,
      hashtags,
      contentType,
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
      contentTypes={contentTypesTyped || []}
    />
  )
}
