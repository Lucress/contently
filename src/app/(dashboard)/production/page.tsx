import { createClient } from '@/lib/supabase/server'
import { ProductionContent } from '.'
import { format, addDays } from 'date-fns'

export default async function ProductionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch ideas that are ready for production (scripted, planned, to_film, filmed, editing)
  const { data: productionIdeas } = await supabase
    .from('ideas')
    .select(`
      *,
      content_pillar:content_pillars(id, name, color),
      category:categories(id, name),
      content_type:content_types(id, name, icon),
      filming_setup:filming_setups(id, name, description, checklist)
    `)
    .eq('user_id', user.id)
    .in('status', ['scripted', 'planned', 'to_film', 'filmed', 'editing'])
    .order('updated_at', { ascending: false })

  // Fetch filming setups
  const { data: filmingSetups } = await supabase
    .from('filming_setups')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  // Fetch hashtags for the user
  const { data: hashtags } = await supabase
    .from('hashtags')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <ProductionContent 
      productionIdeas={productionIdeas || []}
      filmingSetups={filmingSetups || []}
      hashtags={hashtags || []}
      userId={user.id}
    />
  )
}
