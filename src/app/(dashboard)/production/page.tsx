import { createClient } from '@/lib/supabase/server'
import { ProductionContent } from '.'
import { format, addDays } from 'date-fns'

export default async function ProductionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekEndStr = format(addDays(today, 7), 'yyyy-MM-dd')

  // Fetch ideas scheduled for filming today or planned status
  const { data: filmingIdeas } = await supabase
    .from('ideas')
    .select(`
      *,
      content_pillar:content_pillars(id, name, color),
      category:categories(id, name),
      content_type:content_types(id, name, icon),
      filming_setup:filming_setups(id, name, description, checklist)
    `)
    .eq('user_id', user.id)
    .in('status', ['planned', 'filmed'])
    .gte('scheduled_date', todayStr)
    .lte('scheduled_date', weekEndStr)
    .order('scheduled_date')

  // Fetch all planner items for filming this week
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
        content_pillar:content_pillars(id, name, color),
        filming_setup:filming_setups(id, name, description, checklist)
      )
    `)
    .eq('user_id', user.id)
    .eq('item_type', 'filming')
    .gte('date', todayStr)
    .lte('date', weekEndStr)
    .order('date')
    .order('start_time')

  // Fetch filming setups
  const { data: filmingSetups } = await supabase
    .from('filming_setups')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <ProductionContent 
      plannerItems={plannerItems || []}
      filmingSetups={filmingSetups || []}
      userId={user.id}
    />
  )
}
