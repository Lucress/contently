import { createClient } from '@/lib/supabase/server'
import { CollabContent } from './collab-content'
import { getUserPlan } from '@/lib/subscription'
import { PlanGate } from '@/components/plan-gate'

export const dynamic = 'force-dynamic'

export default async function CollabPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const plan = await getUserPlan(user.id)
  if (!plan.features.brandCRM) {
    return (
      <PlanGate
        featureName="Brand CRM & Deals"
        featureDescription="Track every brand relationship, manage collab deals, and never miss a follow-up."
        requiredPlan="pro"
        currentPlan={plan.id}
        featureEmoji="🤝"
      />
    )
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
