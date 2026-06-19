import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Contently',
  description: 'Privacy Policy for Contently — learn how we collect, use, and protect your personal data.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-semibold">Contently</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: January 1, 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Contently (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to protecting your personal data
              and respecting your privacy. This Privacy Policy explains how we collect, use, store,
              and protect information about you when you use our platform at contentlyapp.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect the following categories of data:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Account data:</strong> Email address, name, and profile picture (from Google OAuth or email/password sign-up).</li>
              <li><strong className="text-foreground">Content data:</strong> Ideas, scripts, inspirations, planner items, and other content you create within the platform.</li>
              <li><strong className="text-foreground">Business data:</strong> Brand contact information, deal details, and revenue entries you add.</li>
              <li><strong className="text-foreground">Usage data:</strong> Basic usage analytics to improve the product (page views, feature usage).</li>
              <li><strong className="text-foreground">Payment data:</strong> Subscription and billing information processed by Stripe. We do not store card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and maintain the Contently platform and its features.</li>
              <li>Process payments and manage your subscription via Stripe.</li>
              <li>Send transactional emails (account confirmations, password resets).</li>
              <li>Improve and develop new features based on anonymised usage patterns.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do <strong className="text-foreground">not</strong> sell your personal data to third parties. We do not use your content for AI training.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored on Supabase (PostgreSQL) with row-level security enforced — only you can access your data.
              All data is encrypted at rest and in transit using TLS. We apply industry-standard security practices
              to protect against unauthorized access, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Supabase:</strong> Database and authentication hosting.</li>
              <li><strong className="text-foreground">Stripe:</strong> Payment processing and subscription management.</li>
              <li><strong className="text-foreground">Vercel:</strong> Application hosting and deployment.</li>
              <li><strong className="text-foreground">Google:</strong> OAuth sign-in (optional). If you connect Gmail, your emails are processed according to Google&rsquo;s terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Right to access the personal data we hold about you.</li>
              <li>Right to correct inaccurate data.</li>
              <li>Right to request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
              <li>Right to data portability.</li>
              <li>Right to withdraw consent at any time.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, contact us at <strong className="text-foreground">privacy@contentlyapp.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies to maintain your authenticated session. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              via email or an in-app notification. Your continued use of Contently after changes take effect
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <strong className="text-foreground">privacy@contentlyapp.com</strong>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Contently. <Link href="/terms" className="hover:text-foreground underline">Terms of Service</Link> · <Link href="/" className="hover:text-foreground underline">Back to Home</Link></p>
        </div>
      </footer>
    </div>
  )
}
