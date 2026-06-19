import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/blog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Contently Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://contentlyapp.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://contentlyapp.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const prev = allPosts[currentIndex + 1] || null
  const next = allPosts[currentIndex - 1] || null

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Organization', name: 'Contently' },
            publisher: {
              '@type': 'Organization',
              name: 'Contently',
              url: 'https://contentlyapp.com',
            },
            url: `https://contentlyapp.com/blog/${params.slug}`,
            keywords: post.tags.join(', '),
          }),
        }}
      />

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
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Blog</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/auth/signup"><Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Start Free</Button></Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">

            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>

            {/* Post header */}
            <div className="text-6xl text-center mb-8 py-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
              {post.coverEmoji}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
              <span>By {post.author}</span>
            </div>

            {/* Post content */}
            <div
              className="prose prose-gray dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-li:text-muted-foreground prose-li:leading-relaxed
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-hr:border-border prose-hr:my-8
                prose-blockquote:border-l-purple-500 prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Prev / Next */}
            <div className="mt-16 pt-8 border-t grid grid-cols-2 gap-4">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="group p-4 rounded-xl border hover:border-purple-300 transition-all">
                  <p className="text-xs text-muted-foreground mb-1">← Previous</p>
                  <p className="text-sm font-medium group-hover:text-purple-600 transition-colors line-clamp-2">{prev.title}</p>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={`/blog/${next.slug}`} className="group p-4 rounded-xl border hover:border-purple-300 transition-all text-right">
                  <p className="text-xs text-muted-foreground mb-1">Next →</p>
                  <p className="text-sm font-medium group-hover:text-purple-600 transition-colors line-clamp-2">{next.title}</p>
                </Link>
              ) : <div />}
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border text-center">
              <p className="text-xl font-bold mb-2">Put this into practice with Contently</p>
              <p className="text-sm text-muted-foreground mb-6">
                The all-in-one platform for content creators — ideas, scripts, brand deals, revenue, and more.
              </p>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8">
                  Start Free — No Credit Card
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">Contently</span>
          </Link>
          <div className="flex gap-6 text-sm text-zinc-400">
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
