import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Mail, 
  Calendar, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight,
  Check,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl">Contently</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                Get Started Free
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          AI-Powered Content Creation
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-violet-800 to-indigo-900 dark:from-white dark:via-violet-200 dark:to-indigo-200 bg-clip-text text-transparent">
          Your Complete Content
          <br />
          Operating System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Create, schedule, and manage all your content in one place. 
          Powered by AI to help you create better content, faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8 py-6">
              Start Creating for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              See How It Works
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required • Free plan available
        </p>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by content creators worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2">
              <Twitter className="h-6 w-6" />
              <span className="font-semibold">Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-6 w-6" />
              <span className="font-semibold">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-6 w-6" />
              <span className="font-semibold">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              <span className="font-semibold">Newsletter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Create Amazing Content
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From blog posts to social media, manage your entire content workflow in one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Blog Articles</h3>
            <p className="text-muted-foreground">
              Write and publish SEO-optimized blog posts with AI assistance. Generate outlines, improve readability, and more.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Twitter className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Media Posts</h3>
            <p className="text-muted-foreground">
              Create engaging posts for Twitter, LinkedIn, and Instagram. Schedule them for optimal engagement times.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Newsletters</h3>
            <p className="text-muted-foreground">
              Design beautiful newsletters with our visual editor. Personalize content and track engagement.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
            <p className="text-muted-foreground">
              Plan and visualize your content schedule. Drag and drop to reschedule, never miss a publishing date.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Writing Assistant</h3>
            <p className="text-muted-foreground">
              Beat writer's block with AI suggestions. Generate ideas, improve tone, and optimize for your audience.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-muted-foreground">
              Streamline your workflow with keyboard shortcuts and quick actions. Create content in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect to get started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>5 content pieces/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Basic AI assistance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 social account</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-violet-600 bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">For serious creators</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited content</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>5 social accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Creator Plus Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-xl font-semibold mb-2">Creator Plus</h3>
              <p className="text-muted-foreground mb-4">For teams & agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited social accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who use Contently to produce amazing content every day.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-semibold">Contently</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#features" className="hover:text-foreground">Features</Link>
              <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
              <Link href="/auth/login" className="hover:text-foreground">Log In</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Contently. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
