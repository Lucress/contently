import Link from 'next/link'
import { Check } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-zinc-900 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-brand-700 font-bold text-xl">C</span>
            </div>
            <span className="font-semibold text-xl text-white">Contently</span>
          </Link>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white leading-tight">
            The content platform<br />
            for modern creators
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-brand-100">
              <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-brand-300" />
              </div>
              <span>Organize all your content in one place</span>
            </div>
            <div className="flex items-center gap-3 text-brand-100">
              <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-brand-300" />
              </div>
              <span>Plan and schedule with precision</span>
            </div>
            <div className="flex items-center gap-3 text-brand-100">
              <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-brand-300" />
              </div>
              <span>Track performance and grow your audience</span>
            </div>
          </div>
        </div>

        <p className="text-brand-400 text-sm">
          © 2026 Contently. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-semibold text-xl">Contently</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
