'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Mail, 
  Calendar, 
  BarChart3, 
  Layers, 
  ArrowRight,
  Check,
  Globe,
  Briefcase,
  PenTool
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n'

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-xl">Contently</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.landing?.features || 'Features'}
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.landing?.pricing || 'Pricing'}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm">{t.auth?.signIn || 'Sign In'}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white text-sm">
                  {t.landing?.getStarted || 'Get Started'}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-brand-50/50 to-background dark:from-brand-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              {t.landing?.badge || 'Now available for creators'}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {t.landing?.heroTitle || 'The Content Platform'}
              <span className="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                {t.landing?.heroSubtitle || 'Built for Modern Creators'}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t.landing?.heroDescription || 'Plan, create, and publish your content across every channel. One workspace for all your creative work.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white text-base px-8 h-12">
                  {t.landing?.startFree || 'Start for Free'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-900/30">
                  {t.landing?.learnMore || 'Learn More'}
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              {t.landing?.noCreditCard || 'No credit card required'}
            </p>
          </div>
        </div>
      </section>

      {/* Logos/Trust */}
      <section className="border-y py-12 bg-brand-50/30 dark:bg-brand-950/10">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t.landing?.trustedBy || 'Trusted by professional creators and teams'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-5 w-5 text-brand-500" />
              <span className="font-medium">{t.landing?.globalReach || 'Global Reach'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-5 w-5 text-brand-500" />
              <span className="font-medium">{t.landing?.enterpriseReady || 'Enterprise Ready'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <PenTool className="h-5 w-5 text-brand-500" />
              <span className="font-medium">{t.landing?.creatorFirst || 'Creator First'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.landing?.featuresTitle || 'Everything you need to create great content'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.landing?.featuresSubtitle || 'A complete suite of tools designed for modern content workflows'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature1Title || 'Long-form Content'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature1Desc || 'Write and publish blog posts, articles, and documentation with a powerful rich text editor.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature2Title || 'Social Media'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature2Desc || 'Create and schedule posts across all major platforms from a single dashboard.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature3Title || 'Email Newsletters'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature3Desc || 'Design beautiful newsletters with our visual editor. Connect with your audience directly.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature4Title || 'Content Calendar'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature4Desc || 'Visualize your content schedule. Plan weeks ahead and never miss a publishing date.'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature5Title || 'Analytics'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature5Desc || 'Track performance across all channels. Understand what works and optimize your strategy.'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-glow transition-all">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.landing?.feature6Title || 'Brand Collaborations'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing?.feature6Desc || 'Manage brand partnerships and collaborations. Track deals and grow your business.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-brand-50/30 dark:bg-brand-950/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.landing?.pricingTitle || 'Simple, transparent pricing'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.landing?.pricingSubtitle || 'Choose the plan that fits your needs'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-lg font-semibold mb-1">{t.landing?.starterPlan || 'Starter'}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t.landing?.starterDesc || 'For individuals getting started'}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/{t.landing?.month || 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.starter1 || '5 content pieces per month'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.starter2 || '1 connected account'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.starter3 || 'Basic analytics'}</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full border-brand-200 hover:bg-brand-50 dark:border-brand-800">{t.landing?.getStarted || 'Get Started'}</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-brand-500 bg-card relative shadow-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-medium rounded-full">
                {t.landing?.popular || 'Popular'}
              </div>
              <h3 className="text-lg font-semibold mb-1">{t.landing?.proPlan || 'Professional'}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t.landing?.proDesc || 'For serious content creators'}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/{t.landing?.month || 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.pro1 || 'Unlimited content'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.pro2 || '5 connected accounts'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.pro3 || 'Advanced analytics'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.pro4 || 'Priority support'}</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                  {t.landing?.startTrial || 'Start Free Trial'}
                </Button>
              </Link>
            </div>

            {/* Creator Plus Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-lg font-semibold mb-1">{t.landing?.teamPlan || 'Team'}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t.landing?.teamDesc || 'For teams and agencies'}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/{t.landing?.month || 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.team1 || 'Everything in Professional'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.team2 || 'Unlimited accounts'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.team3 || 'Team collaboration'}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span>{t.landing?.team4 || 'Custom branding'}</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full border-brand-200 hover:bg-brand-50 dark:border-brand-800">{t.landing?.contactSales || 'Contact Sales'}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background to-brand-50/30 dark:to-brand-950/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.landing?.ctaTitle || 'Ready to elevate your content?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.landing?.ctaSubtitle || 'Join thousands of creators who trust Contently for their content workflow.'}
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white text-base px-8 h-12">
                {t.landing?.ctaButton || 'Get Started Free'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-zinc-900 dark:bg-zinc-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-semibold">Contently</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-zinc-400">
              <Link href="#features" className="hover:text-white transition-colors">{t.landing?.features || 'Features'}</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">{t.landing?.pricing || 'Pricing'}</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">{t.auth?.signIn || 'Sign In'}</Link>
              <div className="border-l border-zinc-700 pl-6">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 Contently. {t.landing?.allRights || 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
