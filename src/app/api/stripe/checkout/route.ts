import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  // Read price IDs inside the handler so they're resolved fresh on every cold start.
  // NEXT_PUBLIC_* vars are inlined at build time by webpack — if they were undefined
  // when the build ran, they'll always be undefined at runtime.
  // Private vars (no NEXT_PUBLIC_ prefix) are read from the real process.env at runtime.
  const PLAN_PRICE_IDS: Record<string, string | undefined> = {
    pro: process.env.STRIPE_PRICE_PRO || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    creator_plus: process.env.STRIPE_PRICE_CREATOR_PLUS || process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_PLUS,
  }
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await req.json()

    const priceId = PLAN_PRICE_IDS[planId as string]

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price ID not configured for plan "${planId}". Add STRIPE_PRICE_PRO and STRIPE_PRICE_CREATOR_PLUS (no NEXT_PUBLIC_ prefix) to your Vercel environment variables — these are read at runtime and don't require a redeploy.` },
        { status: 400 }
      )
    }

    if (priceId.startsWith('prod_')) {
      return NextResponse.json(
        { error: 'You configured a Product ID (prod_…) instead of a Price ID (price_…). Go to Stripe Dashboard → Products → your plan → copy the Price ID.' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentlyapp.com'

    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email!,
      priceId,
      successUrl: `${origin}/settings?tab=billing&success=true`,
      cancelUrl: `${origin}/settings?tab=billing&canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
