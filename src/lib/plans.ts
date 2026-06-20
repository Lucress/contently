// ============================================================
// CONTENTLY — Plan Definitions (single source of truth)
// ============================================================
//
// Pricing strategy: small gap between Pro and Creator+ (only €2)
// so users feel Creator+ is the obvious choice.
//   Free  → €0     — taste of the product
//   Pro   → €7.99  — serious creators, most features
//   Creator+ → €9.99 — "only €2 more, get everything"
// ============================================================

export type PlanId = 'free' | 'pro' | 'creator_plus'

export interface PlanFeatures {
  ideas: number           // max ideas (Infinity = unlimited)
  pillars: number         // max content pillars
  brandCRM: boolean       // brands + deals (Collaborations page)
  revenue: boolean        // revenue tracking page
  analytics: boolean      // analytics + video metrics
  emailHub: boolean       // Email Hub (IMAP/Gmail) — Creator+ exclusive
  planner: boolean        // planner calendar
  hashtagGroups: boolean  // hashtag library
}

export interface PlanConfig {
  id: PlanId
  name: string
  price: number           // EUR/month (0 = free)
  features: PlanFeatures
  badge?: string
  highlight?: 'primary' | 'purple'
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      ideas: 20,
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
    price: 7.99,
    badge: 'Popular',
    highlight: 'primary',
    features: {
      ideas: 200,
      pillars: 5,
      brandCRM: true,
      revenue: true,
      analytics: true,
      emailHub: false,
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
      emailHub: true,
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

// Check if a plan has access to a boolean feature
export function canAccess(planId: string | null | undefined, feature: keyof PlanFeatures): boolean {
  const plan = getPlan(planId)
  const value = plan.features[feature]
  return typeof value === 'boolean' ? value : true
}

// Check count limit — true if user is within the limit
export function withinLimit(planId: string | null | undefined, feature: 'ideas' | 'pillars', currentCount: number): boolean {
  const plan = getPlan(planId)
  const limit = plan.features[feature]
  return currentCount < limit
}

// Which plan is the minimum required for a feature?
export function requiredPlanFor(feature: keyof PlanFeatures): PlanConfig {
  for (const plan of PLAN_LIST) {
    const value = plan.features[feature]
    if (value === true || (typeof value === 'number' && value === Infinity)) return plan
  }
  return PLANS.creator_plus
}
