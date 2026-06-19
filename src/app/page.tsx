import type { Metadata } from 'next'
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
  Instagram,
  Youtube,
  Music2,
  Store,
  Star,
  ChevronDown,
  Zap,
  Shield,
  Clock,
  BarChart3,
  FileText,
  Handshake,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contently — All-in-One Platform for Content Creators & Small Businesses',
  description: 'Plan videos, write scripts, manage brand deals, track revenue, and handle customer emails — all in one place. Stop juggling 10 apps. Built for YouTubers, Instagram creators, TikTokers, and small business owners.',
  alternates: {
    canonical: 'https://contentlyapp.com',
  },
}

const faqs = [
  {
    q: 'Is Contently free to use?',
    a: 'Yes! Contently has a free plan that lets you manage up to 10 active ideas, use the content calendar, and track basic revenue. No credit card required to start.',
  },
  {
    q: 'What kind of creators is Contently built for?',
    a: 'Contently is designed for solo content creators and small business owners — YouTubers, Instagram creators, TikTokers, podcasters, and any business that creates social media content to grow their brand.',
  },
  {
    q: 'Can I manage brand deals and sponsorships in Contently?',
    a: 'Yes. The Pro and Creator+ plans include a full CRM for brand partnerships. You can track deals from first contact through to payment, store contact info, and manage all your sponsorship deliverables in one place.',
  },
  {
    q: 'How does the content calendar work?',
    a: 'The content calendar lets you plan your filming, editing, and publishing schedule. You can view by day, week, or month, drag tasks to reschedule, and set recurring posting schedules so you never miss a deadline.',
  },
  {
    q: 'Can I connect my email to Contently?',
    a: 'Creator+ subscribers can connect Gmail or IMAP email accounts to bring collab requests and brand emails directly into Contently. You can reply using pre-built templates and link emails to specific deals.',
  },
  {
    q: 'Does Contently help with revenue tracking?',
    a: 'Yes. You can log income from sponsorships, AdSense, affiliate programs, UGC deals, digital products, and services. Contently gives you a monthly and annual revenue overview — perfect for tax time.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Absolutely. There are no long-term commitments. You can cancel anytime from your account settings and you will keep access until the end of your billing period.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Contently is built on Supabase with row-level security, meaning your data is completely isolated from other users. All data is encrypted at rest and in transit.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Contently',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: 'https://contentlyapp.com',
            description: 'All-in-one platform for content creators and small businesses. Plan videos, write scripts, manage brand deals, track revenue, and handle customer emails.',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Free plan with up to 10 active ideas and basic features.',
              },
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '19',
                priceCurrency: 'EUR',
                billingIncrement: 'monthly',
                description: 'Unlimited ideas, brand deal management, and revenue analytics.',
              },
              {
                '@type': 'Offer',
                name: 'Creator+',
                price: '49',
                priceCurrency: 'EUR',
                billingIncrement: 'monthly',
                description: 'Everything in Pro plus email hub, multiple accounts, and beta features.',
              },
            ],
            featureList: [
              'Idea bank and inspiration capture',
              'Script writing with structured blocks',
              'Content calendar and scheduling',
              'Brand deal and sponsorship CRM',
              'Revenue tracking and analytics',
              'Customer email inbox',
              'Production day checklist',
              'Hashtag library management',
            ],
            screenshot: 'https://contentlyapp.com/og-image.png',
          }),
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center" aria-hidden="true">
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
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
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

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-purple-50/80 to-background dark:from-purple-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">

              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4" />
                Built for creators who mean business
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

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
                {[
                  { icon: <Lightbulb className="h-4 w-4 text-yellow-500" />, label: 'Idea Bank' },
                  { icon: <Video className="h-4 w-4 text-red-500" />, label: 'Script Writing' },
                  { icon: <Calendar className="h-4 w-4 text-blue-500" />, label: 'Content Calendar' },
                  { icon: <Handshake className="h-4 w-4 text-purple-500" />, label: 'Brand Deals' },
                  { icon: <DollarSign className="h-4 w-4 text-green-500" />, label: 'Revenue Tracking' },
                  { icon: <MessageSquare className="h-4 w-4 text-orange-500" />, label: 'Customer Inbox' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full shadow-sm">
                    {icon}
                    <span>{label}</span>
                  </div>
                ))}
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
                Free plan available · Set up in 2 minutes · No credit card required
              </p>
            </div>
          </div>
        </section>

        {/* Platform strip */}
        <section className="border-y py-10 bg-muted/30" aria-label="Supported platforms">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Built for creators on every platform
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[
                { icon: <Youtube className="h-6 w-6 text-red-500" />, label: 'YouTube' },
                { icon: <Instagram className="h-6 w-6 text-pink-500" />, label: 'Instagram' },
                { icon: <Music2 className="h-6 w-6 text-foreground" />, label: 'TikTok' },
                { icon: <Store className="h-6 w-6 text-blue-500" />, label: 'Shopify & eCommerce' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  {icon}
                  <span className="font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Sound familiar?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Most creators cobble together 5–10 different tools. It wastes hours every week and things still fall through the cracks.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Before */}
                <div className="p-8 rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10">
                  <h3 className="font-semibold text-lg mb-6 text-red-700 dark:text-red-400 flex items-center gap-2">
                    <span className="text-2xl">😩</span> Before Contently
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Notion or Google Docs for ideas — scattered across 20 tabs',
                      'Google Sheets to track brand deals and invoices',
                      'A separate calendar app for scheduling posts',
                      'Gmail inbox buried in collab requests',
                      'Another spreadsheet for revenue and taxes',
                      'No idea which content actually performs well',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After */}
                <div className="p-8 rounded-2xl border-2 border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-950/10">
                  <h3 className="font-semibold text-lg mb-6 text-green-700 dark:text-green-400 flex items-center gap-2">
                    <span className="text-2xl">✨</span> With Contently
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'One place to capture, develop, and track every idea',
                      'Brand deal CRM — from first contact to getting paid',
                      'Content calendar with filming & editing reminders',
                      'Collab inbox linked to your deal pipeline',
                      'Revenue dashboard across all income sources',
                      'Analytics to double down on what works',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-muted/30">
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
                {[
                  {
                    step: '1',
                    gradient: 'from-yellow-400 to-orange-500',
                    Icon: Lightbulb,
                    title: 'Save Ideas',
                    desc: 'Capture inspiration from anywhere. Never lose a great content idea again.',
                  },
                  {
                    step: '2',
                    gradient: 'from-purple-500 to-indigo-600',
                    Icon: FileText,
                    title: 'Plan & Script',
                    desc: 'Write scripts with structured blocks, plan filming, track production status.',
                  },
                  {
                    step: '3',
                    gradient: 'from-green-500 to-emerald-600',
                    Icon: TrendingUp,
                    title: 'Publish & Track',
                    desc: 'Schedule posts, track views, and see what content performs best.',
                  },
                  {
                    step: '4',
                    gradient: 'from-blue-500 to-cyan-600',
                    Icon: DollarSign,
                    title: 'Get Paid',
                    desc: 'Manage brand deals, track invoices, watch your revenue grow.',
                  },
                ].map(({ step, gradient, Icon, title, desc }) => (
                  <div key={step} className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-purple-600 mb-2">Step {step}</div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Run Your Content Business
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you&apos;re a YouTuber, Instagram creator, or small business owner
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                  Icon: Lightbulb,
                  iconColor: 'text-yellow-600',
                  title: 'Idea Bank',
                  desc: 'Save inspiration from TikTok, Instagram, YouTube. Turn ideas into scripts with one click. Organize by content pillar.',
                },
                {
                  bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                  Icon: FileText,
                  iconColor: 'text-purple-600',
                  title: 'Script Writing',
                  desc: 'Write structured video scripts with hooks, main points, B-roll notes, and CTAs. Track each video from draft to published.',
                },
                {
                  bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                  Icon: Calendar,
                  iconColor: 'text-blue-600',
                  title: 'Content Calendar',
                  desc: 'Plan filming, editing, and publishing weeks ahead. Day, week, and month views. Set recurring schedules.',
                },
                {
                  bgColor: 'bg-pink-100 dark:bg-pink-900/30',
                  Icon: Handshake,
                  iconColor: 'text-pink-600',
                  title: 'Brand Partnerships CRM',
                  desc: 'Track sponsorships from pitch to payment. Store brand contacts, deal terms, and deliverables. Never let a deal slip.',
                },
                {
                  bgColor: 'bg-green-100 dark:bg-green-900/30',
                  Icon: BarChart3,
                  iconColor: 'text-green-600',
                  title: 'Revenue Tracking',
                  desc: 'See all income in one dashboard — sponsorships, AdSense, affiliate, UGC, and more. Built for tax time.',
                },
                {
                  bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                  Icon: Mail,
                  iconColor: 'text-orange-600',
                  title: 'Customer Inbox',
                  desc: 'Handle collab requests and customer emails. Use pre-written templates for quick replies. Link emails to open deals.',
                },
              ].map(({ bgColor, Icon, iconColor, title, desc }) => (
                <article key={title} className="p-6 rounded-2xl border bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
                  <div className={`h-12 w-12 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why creators choose Contently */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why creators choose Contently
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  Icon: Zap,
                  color: 'text-yellow-500',
                  bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                  title: 'Set up in minutes',
                  desc: 'No complex onboarding. Sign up, add your first idea, and you\'re already more organized than before.',
                },
                {
                  Icon: Shield,
                  color: 'text-blue-500',
                  bg: 'bg-blue-100 dark:bg-blue-900/30',
                  title: 'Your data stays private',
                  desc: 'Row-level security means only you see your content. We never sell or share your data.',
                },
                {
                  Icon: Clock,
                  color: 'text-green-500',
                  bg: 'bg-green-100 dark:bg-green-900/30',
                  title: 'Save 5+ hours a week',
                  desc: 'Stop context-switching between apps. Everything you need for your content business lives in one tab.',
                },
              ].map(({ Icon, color, bg, title, desc }) => (
                <div key={title} className="p-6 rounded-2xl border bg-card text-center">
                  <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 border-y" aria-label="Customer testimonials">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-sm font-medium text-muted-foreground mb-12 uppercase tracking-wider">
                What creators are saying
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    quote: 'Finally, one app that does everything. I used to have Notion for ideas, spreadsheets for revenue, and email for collabs. Now it\'s all in Contently.',
                    name: 'Sarah M.',
                    role: 'Lifestyle Creator · 150K followers',
                    initials: 'S',
                    gradient: 'from-purple-400 to-pink-500',
                  },
                  {
                    quote: 'The brand deal tracker alone is worth the subscription. I used to lose track of pending invoices all the time. Not anymore.',
                    name: 'Marcus T.',
                    role: 'Tech YouTuber · 85K subscribers',
                    initials: 'M',
                    gradient: 'from-blue-400 to-cyan-500',
                  },
                  {
                    quote: 'I run a Shopify store and create content for it. Contently keeps my content strategy and brand outreach in sync. Game changer.',
                    name: 'Priya K.',
                    role: 'eCommerce founder · 40K Instagram',
                    initials: 'P',
                    gradient: 'from-orange-400 to-red-500',
                  },
                ].map(({ quote, name, role, initials, gradient }) => (
                  <figure key={name} className="p-6 rounded-2xl border bg-card">
                    <div className="flex gap-1 mb-4" aria-label="5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-muted-foreground mb-6">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-medium text-sm shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">{role}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple Pricing. Cancel Anytime.
              </h2>
              <p className="text-lg text-muted-foreground">
                Start free, upgrade when your content business is ready to scale
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border bg-card flex flex-col">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Free</h3>
                  <p className="text-sm text-muted-foreground mb-6">Get started, no card needed</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">€0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Up to 10 active ideas',
                      'Inspiration capture',
                      'Content calendar',
                      'Basic revenue tracking',
                      '3 content pillars',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/auth/signup" className="block mt-auto">
                  <Button variant="outline" className="w-full">Start Free</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 rounded-2xl border-2 border-purple-500 bg-card relative shadow-lg shadow-purple-500/10 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                  Most Popular
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">Pro</h3>
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">🔥 Launch offer</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">For growing creators</p>
                  <div className="mb-1">
                    <span className="text-4xl font-bold">€4.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-through mb-5">Regular price €19/mo</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited ideas & scripts',
                      'Full content calendar',
                      'Brand deal CRM (50 brands)',
                      'Revenue analytics',
                      '1 email account',
                      'Hashtag library',
                      'Filming setups',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/auth/signup" className="block mt-auto">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              {/* Creator+ Plan */}
              <div className="p-8 rounded-2xl border bg-card flex flex-col">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">Creator+</h3>
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">🔥 Launch offer</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">For serious creators & agencies</p>
                  <div className="mb-1">
                    <span className="text-4xl font-bold">€9.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-through mb-5">Regular price €49/mo</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Everything in Pro',
                      'Unlimited brand contacts',
                      'Full email hub (5 accounts)',
                      'Advanced analytics',
                      'Early access to beta features',
                      'Priority support',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/auth/signup" className="block mt-auto">
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know about Contently
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group p-6 rounded-2xl border bg-card cursor-pointer">
                    <summary className="flex items-center justify-between gap-4 font-medium list-none">
                      <span>{q}</span>
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Organize Your Content Business?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join creators and business owners who&apos;ve simplified their workflow with Contently.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8 h-14 shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required · Free plan forever · Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-zinc-900 dark:bg-zinc-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="font-semibold">Contently</span>
              </div>
              <p className="text-sm text-zinc-400 max-w-xs">
                The all-in-one platform for content creators and small businesses. Plan, create, and monetize — all in one place.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium text-sm mb-4 text-zinc-300">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up Free</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium text-sm mb-4 text-zinc-300">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 Contently. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600">
              Built for creators who mean business.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
