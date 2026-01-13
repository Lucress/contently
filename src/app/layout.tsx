import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LanguageProvider } from '@/lib/i18n'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://contentlyapp.com'),
  title: {
    default: 'Contently - All-in-One Platform for Content Creators & Small Businesses',
    template: '%s | Contently'
  },
  description: 'Plan content, write scripts, manage brand deals, track revenue, and handle customer emails — all in one place. Perfect for YouTubers, Instagram creators, TikTokers, and small business owners.',
  keywords: ['content creator tools', 'video script writer', 'brand deal management', 'content calendar', 'creator revenue tracking', 'small business content', 'social media planner', 'YouTube creator', 'TikTok creator', 'Instagram creator', 'content planning app', 'influencer tools', 'creator CRM', 'sponsorship management'],
  authors: [{ name: 'Contently', url: 'https://contentlyapp.com' }],
  creator: 'Contently',
  publisher: 'Contently',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contentlyapp.com',
    siteName: 'Contently',
    title: 'Contently - Your Content Business, All in One Place',
    description: 'Plan content, write scripts, manage brand deals, track revenue, and handle customer emails. Built for content creators and small business owners.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contently - All-in-One Platform for Content Creators',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contently - Your Content Business, All in One Place',
    description: 'Plan content, write scripts, manage brand deals, track revenue. Built for creators.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://contentlyapp.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
