import { createClient } from '@/lib/supabase/server'
import { CollabContent } from './collab-content'
import { redirect } from 'next/navigation'
import { getUserPlan } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export default async function CollabPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const plan = await getUserPlan(user.id)
  if (!plan.features.brandCRM) {
    redirect('/settings?tab=billing&feature=brand_crm')
  }

  // Fetch brands with their deals count
  const { data: brands } = await supabase
    .from('brands')
    .select(`
      *,
      deals:deals(count)
    `)
    .eq('user_id', user.id)
    .order('name')

  // Fetch deals with brand info
  const { data: deals } = await supabase
    .from('deals')
    .select(`
      *,
      brand:brands(id, name, logo_url)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <CollabContent 
      brands={brands || []}
      deals={deals || []}
      userId={user.id}
    />
  )
}
