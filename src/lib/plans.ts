// ============================================================
// CONTENTLY — Plan Definitions (single source of truth)
// ============================================================

export type PlanId = 'free' | 'pro' | 'creator_plus'

export interface PlanFeatures {
  ideas: number           // max ideas (Infinity = unlimited)
  pillars: number         // max content pillars
  brandCRM: boolean       // brands + deals (Collaborations)
  revenue: boolean        // revenue tracking page
  analytics: boolean      // analytics + video metrics
  emailHub: boolean       // Email Hub (IMAP/Gmail)
  planner: boolean        // planner calendar
  hashtagGroups: boolean  // hashtag library
}

export interface PlanConfig {
  id: PlanId
  name: string
  price: number           // EUR/month
  features: PlanFeatures
  badge?: string          // e.g. "Popular"
  highlight?: 'primary' | 'purple'
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      ideas: 5,
      pillars: 3,
      brandCRM: false,
      revenue: false,
      analytics: false,
      emailHub: false,
      planner: true,
      hashtagGroups: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    badge: 'Popular',
    highlight: 'primary',
    features: {
      ideas: Infinity,
      pillars: Infinity,
      brandCRM: true,
      revenue: true,
      analytics: true,
      emailHub: false,      // Creator+ only
      planner: true,
      hashtagGroups: true,
    },
  },
  creator_plus: {
    id: 'creator_plus',
    name: 'Creator+',
    price: 9.99,
    highlight: 'purple',
    features: {
      ideas: Infinity,
      pillars: Infinity,
      brandCRM: true,
      revenue: true,
      analytics: true,
      emailHub: true,       // exclusive
      planner: true,
      hashtagGroups: true,
    },
  },
}

// Ordered list for display
export const PLAN_LIST: PlanConfig[] = [PLANS.free, PLANS.pro, PLANS.creator_plus]

// Resolve a plan from the DB string (handles null/undefined → free)
export function getPlan(planId: string | null | undefined): PlanConfig {
  if (planId === 'pro') return PLANS.pro
  if (planId === 'creator_plus') return PLANS.creator_plus
  return PLANS.free
}

// Check if a plan has access to a feature
export function canAccess(planId: string | null | undefined, feature: keyof PlanFeatures): boolean {
  const plan = getPlan(planId)
  const value = plan.features[feature]
  return typeof value === 'boolean' ? value : true // number features always "accessible"
}

// Check count limit — returns true if the user is within the limit
export function withinLimit(planId: string | null | undefined, feature: 'ideas' | 'pillars', currentCount: number): boolean {
  const plan = getPlan(planId)
  const limit = plan.features[feature]
  return currentCount < limit
}
