import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/server'
import { PLANS } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { planId } = await req.json()
    
    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan || !('priceId' in plan) || !plan.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured. Add NEXT_PUBLIC_STRIPE_PRICE_PRO and NEXT_PUBLIC_STRIPE_PRICE_CREATOR_PLUS to your environment variables.' },
        { status: 400 }
      )
    }

    if ((plan.priceId as string).startsWith('prod_')) {
      return NextResponse.json(
        { error: 'Invalid Stripe price ID — you set a Product ID (prod_…) instead of a Price ID (price_…). Go to Stripe Dashboard → Products → your plan → copy the Price ID.' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentlyapp.com'
    
    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email!,
      priceId: plan.priceId,
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
