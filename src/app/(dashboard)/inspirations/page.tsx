import { createClient } from '@/lib/supabase/server'
import { InspirationsContent } from './inspirations-content'

export default async function InspirationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: inspirations } = await supabase
    .from('inspirations')
    .select('*, content_pillar:content_pillars(id, name, color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: pillars } = await supabase
    .from('content_pillars')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return <InspirationsContent inspirations={inspirations || []} userId={user.id} pillars={pillars || []} />
}
