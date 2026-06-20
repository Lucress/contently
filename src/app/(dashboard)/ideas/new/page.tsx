import { createClient } from '@/lib/supabase/server'
import { NewIdeaForm } from './new-idea-form'
import { getUserPlan } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export default async function NewIdeaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch options + plan + current idea count in parallel
  const [pillarsResult, categoriesResult, contentTypesResult, hashtagsResult, filmingSetupsResult, plan, { count: ideaCount }] = await Promise.all([
    supabase.from('content_pillars').select('*').eq('user_id', user.id).order('name'),
    supabase.from('categories').select('*').eq('user_id', user.id).order('name'),
    supabase.from('content_types').select('*').eq('user_id', user.id).order('name'),
    supabase.from('hashtags').select('*').eq('user_id', user.id).order('name'),
    supabase.from('filming_setups').select('*').eq('user_id', user.id).order('name'),
    getUserPlan(user.id),
    supabase.from('ideas').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <NewIdeaForm
      pillars={pillarsResult.data || []}
      categories={categoriesResult.data || []}
      contentTypes={contentTypesResult.data || []}
      hashtags={hashtagsResult.data || []}
      filmingSetups={filmingSetupsResult.data || []}
      userId={user.id}
      planId={plan.id}
      ideaLimit={plan.features.ideas}
      ideaCount={ideaCount ?? 0}
    />
  )
}
