import { createClient } from '@/lib/supabase/server'
import { AnalyticsContent } from './analytics-content'
import { startOfWeek, startOfMonth, subDays, subMonths, format } from 'date-fns'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)
  const sixMonthsAgo = subMonths(now, 6)

  // Fetch all necessary data
  const [
    { data: ideas },
    { data: inspirations },
    { data: revenues },
    { data: pillars },
    { data: contentTypes },
  ] = await Promise.all([
    supabase
      .from('ideas')
      .select('id, title, status, created_at, pillar_id, content_pillar:content_pillars(name, color)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('inspirations')
      .select('id, title, source, status, created_at, pillar_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('revenues')
      .select('id, amount, source, date, description')
      .eq('user_id', user.id)
      .gte('date', format(sixMonthsAgo, 'yyyy-MM-dd'))
      .order('date', { ascending: true }),
    
    supabase
      .from('content_pillars')
      .select('id, name, color')
      .eq('user_id', user.id)
      .order('name'),
    
    supabase
      .from('content_types')
      .select('id, name')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <AnalyticsContent
      ideas={ideas || []}
      inspirations={inspirations || []}
      revenues={revenues || []}
      pillars={pillars || []}
      contentTypes={contentTypes || []}
      userId={user.id}
    />
  )
}
