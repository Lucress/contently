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
    default: 'Contently - Content Operating System for Creators',
    template: '%s | Contently'
  },
  description: 'The complete platform for content creators. Manage your ideas, plan your content, track your filming, and grow your revenue - all in one place.',
  keywords: ['content creator', 'content management', 'content planning', 'video production', 'creator tools', 'content calendar', 'social media management', 'YouTube creator', 'content workflow'],
  authors: [{ name: 'Contently', url: 'https://contentlyapp.com' }],
  creator: 'Contently',
  publisher: 'Contently',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contentlyapp.com',
    siteName: 'Contently',
    title: 'Contently - Content Operating System for Creators',
    description: 'The complete platform for content creators. Manage your ideas, plan your content, track your filming, and grow your revenue.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contently - Content Operating System',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contently - Content Operating System for Creators',
    description: 'The complete platform for content creators.',
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
