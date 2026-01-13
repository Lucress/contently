import { createClient } from '@/lib/supabase/server'
import { NewIdeaForm } from './new-idea-form'

export default async function NewIdeaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch options for the form
  const [pillarsResult, categoriesResult, contentTypesResult, hashtagsResult, filmingSetupsResult] = await Promise.all([
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
    supabase
      .from('hashtags')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('filming_setups')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <NewIdeaForm 
      pillars={pillarsResult.data || []}
      categories={categoriesResult.data || []}
      contentTypes={contentTypesResult.data || []}
      hashtags={hashtagsResult.data || []}
      filmingSetups={filmingSetupsResult.data || []}
      userId={user.id}
    />
  )
}
