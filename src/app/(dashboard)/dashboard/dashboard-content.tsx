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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate, STATUS_LABELS, DEAL_STATUS_LABELS } from '@/lib/utils'
import type { Tables } from '@/types/database'

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
}: DashboardContentProps) {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Créateur'

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
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre activité créative
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/planner">
              <Calendar className="w-4 h-4 mr-2" />
              Planner
            </Link>
          </Button>
          <Button asChild>
            <Link href="/ideas/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle idée
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Idées totales
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalIdeas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.toFilmIdeas} à tourner
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inspirations
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingInspirations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En attente de traitement
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collaborations
            </CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En cours
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus du mois
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ideas Pipeline */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pipeline de contenu</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/ideas">
                  Voir tout
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
                  <h4 className="text-sm font-medium text-muted-foreground">Dernières idées</h4>
                  {ideas.slice(0, 5).map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
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
                  <Lightbulb className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune idée pour le moment</p>
                  <Button variant="outline" className="mt-3" asChild>
                    <Link href="/ideas/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une idée
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
                <CardTitle className="text-base">Tâches à faire</CardTitle>
                <Badge variant="secondary">{stats.pendingTasks}</Badge>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
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
                    Aucune tâche en attente 🎉
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Inspirations */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Inspirations</CardTitle>
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
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
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
                    <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Pas d'inspirations en attente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Deals */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Collaborations actives</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/deals">
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
                        href={`/deals/${deal.id}`}
                        className="block p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{deal.title}</p>
                          {deal.budget && (
                            <span className="text-sm font-semibold text-primary">
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
                    <Handshake className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Aucune collaboration active</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/deals/new">
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
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
