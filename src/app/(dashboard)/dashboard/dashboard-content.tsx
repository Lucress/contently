'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Sparkles,
  Video,
  Handshake,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Plus,
  Clock,
  TrendingUp,
  Calendar,
  Copy,
  Hash,
  Layers,
  FileVideo,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate, STATUS_LABELS, DEAL_STATUS_LABELS } from '@/lib/utils'
import type { Tables } from '@/types/database'
import { useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'

interface ContentPillar {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  ideaCount: number
}

interface Hashtag {
  id: string
  tag: string
  usage_count: number
  hashtag_groups: { id: string; name: string; color: string } | null
}

interface ContentType {
  id: string
  name: string
  description: string | null
  icon: string
  color: string
}

interface DashboardContentProps {
  profile: Tables<'profiles'> | null
  stats: {
    totalIdeas: number
    draftIdeas: number
    toFilmIdeas: number
    publishedIdeas: number
    pendingInspirations: number
    activeDeals: number
    pendingTasks: number
    monthlyRevenue: number
  }
  ideas: Tables<'ideas'>[]
  inspirations: Tables<'inspirations'>[]
  deals: (Tables<'deals'> & { brands: { name: string } | null })[]
  tasks: Tables<'tasks'>[]
  ideasByStatus: { status: string; count: number; color: string }[]
  contentPillars?: ContentPillar[]
  hashtags?: Hashtag[]
  contentTypes?: ContentType[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function DashboardContent({
  profile,
  stats,
  ideas,
  inspirations,
  deals,
  tasks,
  ideasByStatus,
  contentPillars = [],
  hashtags = [],
  contentTypes = [],
}: DashboardContentProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t.dashboard.greeting.morning
    if (hour < 18) return t.dashboard.greeting.afternoon
    return t.dashboard.greeting.evening
  }

  const firstName = profile?.full_name?.split(' ')[0] || (language === 'fr' ? 'Créateur' : 'Creator')

  const copyHashtags = (tags: string[]) => {
    const text = tags.map(t => `#${t}`).join(' ')
    navigator.clipboard.writeText(text)
    toast({
      title: language === 'fr' ? 'Hashtags copiés!' : 'Hashtags copied!',
      description: language === 'fr' ? 'Les hashtags ont été copiés dans le presse-papiers.' : 'Hashtags have been copied to clipboard.',
    })
  }

  const copyAllHashtags = () => {
    const text = hashtags.map(h => `#${h.tag}`).join(' ')
    navigator.clipboard.writeText(text)
    toast({
      title: language === 'fr' ? 'Hashtags copiés!' : 'Hashtags copied!',
      description: language === 'fr' ? `${hashtags.length} hashtags copiés.` : `${hashtags.length} hashtags copied.`,
    })
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/planner">
              <Calendar className="w-4 h-4 mr-2" />
              {t.nav.planner}
            </Link>
          </Button>
          <Button asChild className="bg-brand-600 hover:bg-brand-700">
            <Link href="/ideas/new">
              <Plus className="w-4 h-4 mr-2" />
              {t.ideas.newIdea}
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Content Pillars Section */}
      <motion.div variants={item}>
        <Card className="border-brand-200 dark:border-brand-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Layers className="h-4 w-4 text-brand-600" />
                </div>
                {language === 'fr' ? 'Piliers de Contenu' : 'Content Pillars'}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Gérer' : 'Manage'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contentPillars.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contentPillars.map((pillar) => (
                  <Link
                    key={pillar.id}
                    href={`/ideas?pillar=${pillar.id}`}
                    className="block p-4 rounded-xl border bg-card hover:shadow-soft hover:border-brand-300 dark:hover:border-brand-700 transition-all"
                    style={{ borderLeftColor: pillar.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{pillar.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {pillar.ideaCount} {language === 'fr' ? 'idées' : 'ideas'}
                      </Badge>
                    </div>
                    {pillar.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {pillar.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Layers className="h-10 w-10 text-brand-300 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  {language === 'fr' 
                    ? 'Créez des piliers pour organiser vos idées de contenu'
                    : 'Create pillars to organize your content ideas'}
                </p>
                <Button variant="outline" size="sm" asChild className="border-brand-200 hover:bg-brand-50">
                  <Link href="/settings">
                    <Plus className="w-4 h-4 mr-1" />
                    {language === 'fr' ? 'Créer un pilier' : 'Create pillar'}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Hashtags & Content Types Row */}
      <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
        {/* Favorite Hashtags */}
        <Card className="border-brand-200 dark:border-brand-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="h-4 w-4 text-brand-500" />
                {language === 'fr' ? 'Hashtags Favoris' : 'Favorite Hashtags'}
              </CardTitle>
              {hashtags.length > 0 && (
                <Button variant="ghost" size="sm" onClick={copyAllHashtags}>
                  <Copy className="w-3 h-3 mr-1" />
                  {language === 'fr' ? 'Copier tout' : 'Copy all'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hashtags.slice(0, 15).map((hashtag) => (
                  <Badge
                    key={hashtag.id}
                    variant="secondary"
                    className="text-xs font-normal cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-900/30"
                    style={hashtag.hashtag_groups ? { borderColor: hashtag.hashtag_groups.color, borderWidth: '1px' } : undefined}
                    onClick={() => copyHashtags([hashtag.tag])}
                  >
                    #{hashtag.tag}
                    <span className="ml-1 text-muted-foreground">({hashtag.usage_count})</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Hash className="h-8 w-8 text-brand-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'fr' ? 'Ajoutez vos hashtags favoris' : 'Add your favorite hashtags'}
                </p>
                <Button variant="outline" size="sm" asChild className="border-brand-200 hover:bg-brand-50">
                  <Link href="/settings">
                    <Plus className="w-4 h-4 mr-1" />
                    {language === 'fr' ? 'Ajouter' : 'Add'}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Types */}
        <Card className="border-brand-200 dark:border-brand-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileVideo className="h-4 w-4 text-brand-500" />
                {language === 'fr' ? 'Types de Contenu' : 'Content Types'}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="w-3 h-3 mr-1" />
                  {language === 'fr' ? 'Gérer' : 'Manage'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contentTypes.length > 0 ? (
              <div className="grid gap-2">
                {contentTypes.slice(0, 5).map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.icon || '📹'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{type.name}</p>
                      {type.description && (
                        <p className="text-xs text-muted-foreground truncate">{type.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FileVideo className="h-8 w-8 text-brand-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'fr' ? 'Définissez vos formats de contenu' : 'Define your content formats'}
                </p>
                <Button variant="outline" size="sm" asChild className="border-brand-200 hover:bg-brand-50">
                  <Link href="/settings">
                    <Plus className="w-4 h-4 mr-1" />
                    {language === 'fr' ? 'Ajouter' : 'Add'}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/ideas">
          <Card className="card-hover border-l-4 border-l-brand-500 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.stats.totalIdeas}
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalIdeas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.toFilmIdeas} {t.dashboard.stats.toFilmIdeas.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inspirations">
          <Card className="card-hover border-l-4 border-l-brand-400 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.stats.pendingInspirations}
              </CardTitle>
              <Sparkles className="h-4 w-4 text-brand-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingInspirations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'fr' ? 'En attente de traitement' : 'Awaiting processing'}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/collab">
          <Card className="card-hover border-l-4 border-l-brand-600 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.nav.collab}
              </CardTitle>
              <Handshake className="h-4 w-4 text-brand-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeDeals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'fr' ? 'En cours' : 'In progress'}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/revenue">
          <Card className="card-hover border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.stats.monthlyRevenue}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {t.time.thisMonth}
              </p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ideas Pipeline */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === 'fr' ? 'Pipeline de contenu' : 'Content Pipeline'}</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/ideas">
                  {t.dashboard.viewAll}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {/* Progress bars for each status */}
              <div className="space-y-4">
                {ideasByStatus.map((statusItem) => (
                  <div key={statusItem.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{statusItem.status}</span>
                      <span className="text-sm text-muted-foreground">{statusItem.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${stats.totalIdeas > 0 ? (statusItem.count / stats.totalIdeas) * 100 : 0}%`,
                          backgroundColor: statusItem.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent ideas list */}
              {ideas.length > 0 ? (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">{t.dashboard.recentIdeas}</h4>
                  {ideas.slice(0, 5).map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ideasByStatus.find(
                              (s) => s.status === STATUS_LABELS[idea.status]
                            )?.color || '#9ca3af',
                          }}
                        />
                        <span className="font-medium truncate max-w-[200px]">{idea.title}</span>
                      </div>
                      <Badge variant="secondary">
                        {STATUS_LABELS[idea.status]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center py-8">
                  <Lightbulb className="w-12 h-12 text-brand-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t.dashboard.noIdeas}</p>
                  <Button variant="outline" className="mt-3 border-brand-200 hover:bg-brand-50" asChild>
                    <Link href="/ideas/new">
                      <Plus className="w-4 h-4 mr-2" />
                      {t.dashboard.createIdea}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">{t.dashboard.pendingTasks}</CardTitle>
                <Badge variant="secondary" className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{stats.pendingTasks}</Badge>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(task.due_date)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {language === 'fr' ? 'Aucune tâche en attente' : 'No pending tasks'}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Inspirations */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">{t.nav.inspirations}</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/inspirations">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {inspirations.length > 0 ? (
                  <div className="space-y-3">
                    {inspirations.map((inspiration) => (
                      <Link
                        key={inspiration.id}
                        href={`/inspirations/${inspiration.id}`}
                        className="block p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                      >
                        <p className="text-sm font-medium truncate">{inspiration.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(inspiration.created_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Sparkles className="w-8 h-8 text-brand-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Pas d\'inspirations en attente' : 'No pending inspirations'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Deals */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">{language === 'fr' ? 'Collaborations actives' : 'Active Collaborations'}</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/collab">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {deals.length > 0 ? (
                  <div className="space-y-3">
                    {deals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/collab/${deal.id}`}
                        className="block p-3 rounded-lg border border-brand-200 dark:border-brand-800 hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{deal.title}</p>
                          {deal.budget && (
                            <span className="text-sm font-semibold text-brand-600">
                              {formatCurrency(deal.budget)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {deal.brands?.name}
                          </span>
                          <Badge variant="outline" className="text-2xs">
                            {DEAL_STATUS_LABELS[deal.status]}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Handshake className="w-8 h-8 text-brand-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Aucune collaboration active' : 'No active collaborations'}</p>
                    <Button variant="outline" size="sm" className="mt-2 border-brand-200 hover:bg-brand-50" asChild>
                      <Link href="/collab">
                        <Plus className="w-4 h-4 mr-1" />
                        {t.common.add}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
