import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return stripePromise
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Pour débuter',
    price: 0,
    currency: 'eur',
    interval: 'month' as const,
    features: [
      '5 idées maximum',
      '3 piliers de contenu',
      'Calendrier basique',
      'Module Inspirations',
    ],
    limits: {
      ideas: 5,
      pillars: 3,
      brands: 0,
      emailAccounts: 0,
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les créateurs sérieux',
    price: 19,
    currency: 'eur',
    interval: 'month' as const,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      'Idées illimitées',
      'Piliers illimités',
      'CRM Marques complet',
      'Revenus & Analytics',
      'Setups de tournage',
      'Groupes de hashtags',
    ],
    limits: {
      ideas: -1, // unlimited
      pillars: -1,
      brands: 50,
      emailAccounts: 1,
    }
  },
  creator_plus: {
    id: 'creator_plus',
    name: 'Creator+',
    description: 'L\'expérience ultime',
    price: 49,
    currency: 'eur',
    interval: 'month' as const,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_PLUS,
    features: [
      'Tout de Pro',
      'Email Hub intégré',
      'Synchronisation emails',
      'IA Assistant (bientôt)',
      'Support prioritaire',
      'Accès bêta nouvelles fonctionnalités',
    ],
    limits: {
      ideas: -1,
      pillars: -1,
      brands: -1,
      emailAccounts: 5,
    }
  }
} as const

export type PlanId = keyof typeof PLANS
export type Plan = typeof PLANS[PlanId]

export function getPlanById(planId: string): Plan {
  return PLANS[planId as PlanId] || PLANS.free
}

export function canAccessFeature(
  currentPlan: PlanId | null,
  feature: 'crm' | 'email' | 'analytics' | 'ai'
): boolean {
  const plan = currentPlan || 'free'
  
  switch (feature) {
    case 'crm':
      return plan === 'pro' || plan === 'creator_plus'
    case 'analytics':
      return plan === 'pro' || plan === 'creator_plus'
    case 'email':
      return plan === 'creator_plus'
    case 'ai':
      return plan === 'creator_plus'
    default:
      return false
  }
}

export function isWithinLimits(
  currentPlan: PlanId | null,
  resource: 'ideas' | 'pillars' | 'brands' | 'emailAccounts',
  currentCount: number
): boolean {
  const plan = PLANS[currentPlan || 'free']
  const limit = plan.limits[resource]
  
  if (limit === -1) return true // unlimited
  return currentCount < limit
}
