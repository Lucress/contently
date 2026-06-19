import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Contently',
  description: 'Terms of Service for Contently — the rules and conditions governing your use of our platform.',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: January 1, 2026</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Contently (&ldquo;the Service&rdquo;) at contentlyapp.com, you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Contently is a software-as-a-service (SaaS) platform designed to help content creators and small
              business owners manage their content workflow, brand partnerships, revenue, and communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>All activity that occurs under your account.</li>
              <li>Ensuring that information you provide is accurate and up-to-date.</li>
              <li>Using the Service only for lawful purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Subscriptions & Billing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Paid plans are billed monthly or annually. By subscribing, you authorize us to charge your payment
              method on a recurring basis. Subscription fees are non-refundable except where required by law.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may cancel your subscription at any time from your account settings. Cancellation takes effect
              at the end of the current billing period. We reserve the right to change pricing with 30 days&apos; notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of all content you create and store in Contently. By using the Service,
              you grant us a limited license to host and process your content solely to provide the Service to you.
              The Contently platform, its design, and source code are the intellectual property of Contently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Prohibited Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You may not use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Violate any applicable law or regulation.</li>
              <li>Distribute malware or engage in phishing.</li>
              <li>Reverse-engineer, decompile, or otherwise attempt to extract source code.</li>
              <li>Resell or sublicense access to the Service without our written permission.</li>
              <li>Use the Service in a way that disrupts or damages it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Contently shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of your use of the Service. Our total liability shall
              not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms. You may
              delete your account at any time from your account settings. Upon deletion, your data will be
              permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of France. Any disputes shall be resolved in the courts of France.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Contact us at{' '}
              <strong className="text-foreground">legal@contentlyapp.com</strong>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Contently. <Link href="/privacy" className="hover:text-foreground underline">Privacy Policy</Link> · <Link href="/" className="hover:text-foreground underline">Back to Home</Link></p>
        </div>
      </footer>
    </div>
  )
}
