import { createClient } from '@/lib/supabase/server'
import { IdeasContent } from './ideas-content'

export default async function IdeasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch ideas with related data
  const [ideasResult, pillarsResult, categoriesResult, contentTypesResult] = await Promise.all([
    supabase
      .from('ideas')
      .select(`
        *,
        content_pillar:content_pillars(id, name, color),
        category:categories(id, name),
        content_type:content_types(id, name, icon)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('content_types')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <IdeasContent 
      ideas={ideasResult.data || []} 
      pillars={pillarsResult.data || []}
      categories={categoriesResult.data || []}
      contentTypes={contentTypesResult.data || []}
      userId={user.id}
    />
  )
}
