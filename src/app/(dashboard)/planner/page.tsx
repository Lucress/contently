import { createClient } from '@/lib/supabase/server'
import { PlannerContent } from '.'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns'

export default async function PlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get a wider date range to cover both week and month views
  const today = new Date()
  const rangeStart = subDays(startOfMonth(today), 7)
  const rangeEnd = addDays(endOfMonth(today), 7)

  // Fetch planner items for the date range
  const { data: plannerItems } = await supabase
    .from('planner_items')
    .select(`
      *,
      idea:ideas(
        id,
        title,
        hook,
        status,
        priority,
        content_pillar:content_pillars(id, name, color)
      )
    `)
    .eq('user_id', user.id)
    .gte('date', rangeStart.toISOString().split('T')[0])
    .lte('date', rangeEnd.toISOString().split('T')[0])
    .order('date')

  // Fetch unscheduled ideas (draft or scripted)
  const { data: unscheduledIdeas } = await supabase
    .from('ideas')
    .select(`
      id,
      title,
      hook,
      status,
      priority,
      content_pillar:content_pillars(id, name, color)
    `)
    .eq('user_id', user.id)
    .in('status', ['draft', 'scripted'])
    .is('scheduled_date', null)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <PlannerContent 
      plannerItems={plannerItems || []}
      unscheduledIdeas={unscheduledIdeas || []}
      userId={user.id}
    />
  )
}
