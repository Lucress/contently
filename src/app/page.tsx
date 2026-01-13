'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  Mail, 
  Calendar, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  Check,
  Sparkles,
  Users,
  TrendingUp,
  MessageSquare,
  Play,
  Instagram,
  Youtube,
  Music2,
  Store
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-xl">Contently</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm">
                  Start Free
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Super Clear Value Prop */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-purple-50/80 to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Target audience badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                <Instagram className="h-4 w-4" /> Content Creators
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm">
                <Store className="h-4 w-4" /> Small Business Owners
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm">
                <Users className="h-4 w-4" /> Personal Brands
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Your Content Business
              <span className="block bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                All in One Place
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Plan videos, manage brand deals, track revenue, and handle customer emails — 
              <span className="text-foreground font-medium"> stop juggling 10 different apps.</span>
            </p>

            {/* Visual what-you-get preview */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>Idea Bank</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <Video className="h-4 w-4 text-red-500" />
                <span>Script Writing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Content Calendar</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Brand Deals</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Revenue Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
                <MessageSquare className="h-4 w-4 text-orange-500" />
                <span>Customer Inbox</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8 h-14 shadow-lg shadow-purple-500/25">
                  Start Free — No Credit Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Free plan available - Set up in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Platform Icons - Who it's for */}
      <section className="border-y py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Perfect for creators on
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Youtube className="h-6 w-6 text-red-500" />
              <span className="font-medium">YouTube</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Instagram className="h-6 w-6 text-pink-500" />
              <span className="font-medium">Instagram</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Music2 className="h-6 w-6 text-foreground" />
              <span className="font-medium">TikTok</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Store className="h-6 w-6 text-blue-500" />
              <span className="font-medium">Shopify Stores</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Super Simple */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Contently Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From idea to published content to getting paid — all tracked in one dashboard
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-600 mb-2">Step 1</div>
                <h3 className="font-semibold mb-2">Save Ideas</h3>
                <p className="text-sm text-muted-foreground">
                  Capture inspiration from anywhere. Never lose a content idea again.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-600 mb-2">Step 2</div>
                <h3 className="font-semibold mb-2">Plan & Script</h3>
                <p className="text-sm text-muted-foreground">
                  Write scripts, plan your filming schedule, track production status.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-600 mb-2">Step 3</div>
                <h3 className="font-semibold mb-2">Publish & Track</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule posts, track views, and see what content performs best.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-600 mb-2">Step 4</div>
                <h3 className="font-semibold mb-2">Get Paid</h3>
                <p className="text-sm text-muted-foreground">
                  Manage brand deals, track invoices, see your revenue grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Content Business
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're a YouTuber, Instagram creator, or small business owner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 - Ideas */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Idea Bank</h3>
              <p className="text-muted-foreground text-sm">
                Save inspiration from TikTok, Instagram, YouTube. Turn ideas into content with one click.
              </p>
            </div>

            {/* Feature 2 - Scripts */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Script Writing</h3>
              <p className="text-muted-foreground text-sm">
                Write video scripts with hooks, main points, and CTAs. Track filming status from draft to published.
              </p>
            </div>

            {/* Feature 3 - Calendar */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Content Calendar</h3>
              <p className="text-muted-foreground text-sm">
                Plan your content weeks ahead. Drag and drop to reschedule. Never miss a posting day.
              </p>
            </div>

            {/* Feature 4 - Brand Deals */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Brand Partnerships</h3>
              <p className="text-muted-foreground text-sm">
                Manage sponsorships and collaborations. Track deals from pitch to payment. See all your partners.
              </p>
            </div>

            {/* Feature 5 - Revenue */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Revenue Tracking</h3>
              <p className="text-muted-foreground text-sm">
                See all your income in one place. Track sponsorships, AdSense, affiliate earnings. Export for taxes.
              </p>
            </div>

            {/* Feature 6 - Customer Inbox */}
            <div className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Inbox</h3>
              <p className="text-muted-foreground text-sm">
                Handle collab requests and customer emails. Use templates for quick replies. Stay organized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-8">
              "Finally, one app that does everything. I used to have Notion for ideas, spreadsheets for revenue, and email for collabs. 
              <span className="text-foreground font-medium"> Now it's all in Contently.</span>"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-medium">
                S
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Sarah M.</p>
                <p className="text-xs text-muted-foreground">Lifestyle Creator • 150K followers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing. Cancel Anytime.
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-6">Try everything, no limits</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Unlimited ideas & inspirations</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Content calendar</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Up to 10 active ideas</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Basic revenue tracking</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full">Start Free</Button>
              </Link>
            </div>

            {/* Creator Plan */}
            <div className="p-8 rounded-2xl border-2 border-purple-500 bg-card relative shadow-lg shadow-purple-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Creator</h3>
              <p className="text-sm text-muted-foreground mb-6">For growing creators</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Unlimited ideas & scripts</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Brand deal management</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Email templates</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Revenue analytics</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Business Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-lg font-semibold mb-1">Business</h3>
              <p className="text-sm text-muted-foreground mb-6">For brands & agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Everything in Creator</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Customer inbox & CRM</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Multiple email accounts</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Organize Your Content Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join creators and business owners who've simplified their workflow with Contently.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8 h-14 shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free plan forever
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-zinc-900 dark:bg-zinc-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-semibold">Contently</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-zinc-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 Contently. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
