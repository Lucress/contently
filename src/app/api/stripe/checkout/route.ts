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
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { planId } = await req.json()
    
    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan || !('priceId' in plan) || !plan.priceId) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    
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
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
