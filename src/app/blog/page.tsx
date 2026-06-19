import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Clock, Tag } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Blog — Creator Tips & Guides | Contently',
  description: 'Practical guides for content creators: how to manage brand deals, build a content system, track revenue, and grow your creator business.',
  alternates: { canonical: 'https://contentlyapp.com/blog' },
  openGraph: {
    title: 'Contently Blog — Creator Tips & Guides',
    description: 'Practical guides for content creators: brand deals, content systems, revenue tracking, and growth strategies.',
    url: 'https://contentlyapp.com/blog',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-semibold">Contently</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm text-foreground font-medium">Blog</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/auth/signup"><Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Start Free</Button></Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-purple-50/60 to-background dark:from-purple-950/10 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Creator Tips & Guides</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Practical advice for content creators who want to run their business smarter — not just create more.
            </p>
          </div>
        </section>

        {/* Post grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-20">No posts yet — check back soon.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {posts.map((post) => (
                  <article key={post.slug} className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                    {/* Emoji cover */}
                    <div className="h-36 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 flex items-center justify-center text-6xl">
                      {post.coverEmoji}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min
                          </span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="text-xs font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
                          Read <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-2xl font-bold mb-3">Ready to put this into practice?</h2>
            <p className="text-muted-foreground mb-6">
              Contently gives you all the tools to run your content business in one place.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8">
                Start Free — No Credit Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">Contently</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="text-sm text-zinc-500">© 2026 Contently</p>
        </div>
      </footer>
    </div>
  )
}
