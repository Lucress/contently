'use client'

import { useState } from 'react'
import { Lock, Zap, Crown, Sparkles, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PLAN_LIST, getPlan, type PlanId } from '@/lib/plans'

interface PlanGateProps {
  /** The feature being blocked — shown in the headline */
  featureName: string
  /** One sentence explaining what they'd unlock */
  featureDescription: string
  /** Minimum plan that unlocks this feature */
  requiredPlan: PlanId
  /** The user's current plan */
  currentPlan: PlanId
  /** Emoji or short label for the feature icon */
  featureEmoji?: string
}

export function PlanGate({
  featureName,
  featureDescription,
  requiredPlan,
  currentPlan,
  featureEmoji = '🔒',
}: PlanGateProps) {
  const [loading, setLoading] = useState(false)
  const required = getPlan(requiredPlan)
  const isPurple = required.id === 'creator_plus'

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: required.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  const planIcons: Record<string, React.ElementType> = {
    free: Sparkles,
    pro: Zap,
    creator_plus: Crown,
  }

  const RequiredIcon = planIcons[required.id] || Zap

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Feature icon */}
        <div className="flex justify-center">
          <div className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg',
            isPurple
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
              : 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
          )}>
            {featureEmoji}
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              {required.name} feature
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{featureName}</h1>
          <p className="text-muted-foreground text-lg">{featureDescription}</p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-3">
          {PLAN_LIST.filter(p => p.id !== 'free').map((plan) => {
            const isRequired = plan.id === required.id
            const isHigher = PLAN_LIST.indexOf(plan) > PLAN_LIST.findIndex(p => p.id === required.id)
            const Icon = planIcons[plan.id] || Zap
            const isPlan = plan.highlight === 'purple'

            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all',
                  isRequired
                    ? isPlan
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-md'
                      : 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card opacity-60'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      'h-5 w-5',
                      isPlan ? 'text-purple-500' : 'text-yellow-500'
                    )} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name}</span>
                        {plan.badge && (
                          <Badge className="bg-yellow-500 text-white text-xs">{plan.badge}</Badge>
                        )}
                        {isRequired && (
                          <Badge variant="outline" className={cn(
                            'text-xs',
                            isPlan ? 'border-purple-500 text-purple-600' : 'border-primary text-primary'
                          )}>
                            Unlocks {featureName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {plan.id === 'pro'
                          ? '200 ideas · 5 pillars · Analytics · Revenue · Brand CRM'
                          : 'Unlimited everything · Email Hub · Priority support'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                    {plan.id === 'creator_plus' && (
                      <p className="text-xs text-purple-600 font-medium mt-0.5">
                        +{(plan.price - PLAN_LIST.find(p => p.id === 'pro')!.price).toFixed(2)}€ vs Pro
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            size="lg"
            className={cn(
              'w-full gap-2 text-base h-12',
              isPurple && 'bg-purple-600 hover:bg-purple-700'
            )}
            onClick={handleUpgrade}
            disabled={loading}
          >
            <RequiredIcon className="h-5 w-5" />
            {loading ? 'Redirecting…' : `Upgrade to ${required.name} — ${required.price}€/month`}
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Cancel anytime · Secure payment via Stripe
          </p>
        </div>

        {/* What's included at a glance */}
        <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-2 text-left">
          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-3">
            {required.name} includes
          </p>
          {Object.entries(required.features).map(([key, value]) => {
            if (value === false) return null
            const labels: Record<string, string> = {
              ideas: typeof value === 'number' && isFinite(value) ? `${value} ideas` : 'Unlimited ideas',
              pillars: typeof value === 'number' && isFinite(value) ? `${value} content pillars` : 'Unlimited pillars',
              brandCRM: 'Brand CRM & Deals',
              revenue: 'Revenue tracking',
              analytics: 'Video analytics',
              emailHub: 'Email Hub (IMAP / Gmail)',
              planner: 'Planner calendar',
              hashtagGroups: 'Hashtag library',
            }
            const label = labels[key]
            if (!label) return null
            return (
              <div key={key} className="flex items-center gap-2">
                <Check className={cn('h-4 w-4 shrink-0', isPurple ? 'text-purple-500' : 'text-green-500')} />
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
