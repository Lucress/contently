'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  X,
  Edit3,
  Trash2,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate, STATUS_LABELS, DEAL_STATUS_LABELS } from '@/lib/utils'
import type { Tables } from '@/types/database'
import { useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'
import { createPillar, updatePillar, deletePillar } from './actions'

interface ContentPillar {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  ideaCount: number
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
  contentPillars: initialPillars = [],
}: DashboardContentProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  
  // Pillar state management
  const [pillars, setPillars] = useState<ContentPillar[]>(initialPillars)
  const [isAddingPillar, setIsAddingPillar] = useState(false)
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null)
  const [newPillar, setNewPillar] = useState({ name: '', description: '', color: '#8b5cf6' })
  const [editPillar, setEditPillar] = useState({ name: '', description: '', color: '' })
  const [isLoading, setIsLoading] = useState(false)

  const pillarColors = [
    '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
  ]

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t.dashboard.greeting.morning
    if (hour < 18) return t.dashboard.greeting.afternoon
    return t.dashboard.greeting.evening
  }

  const firstName = profile?.full_name?.split(' ')[0] || (language === 'fr' ? 'Créateur' : 'Creator')

  // Pillar CRUD operations using server actions
  const handleAddPillar = async () => {
    if (!newPillar.name.trim()) return
    setIsLoading(true)
    
    try {
      const result = await createPillar({
        name: newPillar.name,
        description: newPillar.description || null,
        color: newPillar.color,
      })

      if (result.error) throw new Error(result.error)

      if (result.data) {
        setPillars([...pillars, { ...result.data, ideaCount: 0 }])
      }
      setNewPillar({ name: '', description: '', color: '#8b5cf6' })
      setIsAddingPillar(false)
      toast({
        title: language === 'fr' ? 'Pilier créé!' : 'Pillar created!',
        description: language === 'fr' ? 'Votre nouveau pilier a été ajouté.' : 'Your new pillar has been added.',
      })
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Impossible de créer le pilier.' : 'Could not create pillar.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPillar = async (id: string) => {
    if (!editPillar.name.trim()) return
    setIsLoading(true)

    try {
      const result = await updatePillar(id, {
        name: editPillar.name,
        description: editPillar.description || null,
        color: editPillar.color,
      })

      if (result.error) throw new Error(result.error)

      setPillars(pillars.map(p => p.id === id ? { ...p, ...editPillar } : p))
      setEditingPillarId(null)
      toast({
        title: language === 'fr' ? 'Pilier mis à jour!' : 'Pillar updated!',
      })
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Impossible de modifier le pilier.' : 'Could not update pillar.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePillar = async (id: string) => {
    setIsLoading(true)

    try {
      const result = await deletePillar(id)
      if (result.error) throw new Error(result.error)

      setPillars(pillars.filter(p => p.id !== id))
      toast({
        title: language === 'fr' ? 'Pilier supprimé!' : 'Pillar deleted!',
      })
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (pillar: ContentPillar) => {
    setEditingPillarId(pillar.id)
    setEditPillar({ name: pillar.name, description: pillar.description || '', color: pillar.color })
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

      {/* Content Pillars Section - Clean & Self-contained */}
      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-brand-50 to-white dark:from-brand-950/30 dark:to-background">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {language === 'fr' ? 'Mes Piliers de Contenu' : 'My Content Pillars'}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'fr' 
                    ? 'Organisez vos idées par thématique' 
                    : 'Organize your ideas by theme'}
                </p>
              </div>
              {!isAddingPillar && (
                <Button 
                  onClick={() => setIsAddingPillar(true)}
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Ajouter' : 'Add'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <AnimatePresence mode="popLayout">
              {/* Add new pillar form */}
              {isAddingPillar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 dark:bg-brand-950/20"
                >
                  <div className="space-y-3">
                    <Input
                      placeholder={language === 'fr' ? 'Nom du pilier...' : 'Pillar name...'}
                      value={newPillar.name}
                      onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })}
                      className="border-brand-200 focus:border-brand-400"
                    />
                    <Textarea
                      placeholder={language === 'fr' ? 'Description (optionnel)' : 'Description (optional)'}
                      value={newPillar.description}
                      onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })}
                      rows={2}
                      className="border-brand-200 focus:border-brand-400 resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {language === 'fr' ? 'Couleur:' : 'Color:'}
                      </span>
                      <div className="flex gap-1">
                        {pillarColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewPillar({ ...newPillar, color })}
                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                              newPillar.color === color ? 'ring-2 ring-offset-2 ring-brand-500' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleAddPillar}
                        disabled={isLoading || !newPillar.name.trim()}
                        size="sm"
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {language === 'fr' ? 'Créer' : 'Create'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingPillar(false)
                          setNewPillar({ name: '', description: '', color: '#8b5cf6' })
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        {language === 'fr' ? 'Annuler' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pillars grid */}
              {pillars.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pillars.map((pillar, index) => (
                    <motion.div
                      key={pillar.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {editingPillarId === pillar.id ? (
                        /* Edit mode */
                        <div className="p-4 rounded-xl border-2 border-brand-400 bg-white dark:bg-background">
                          <div className="space-y-3">
                            <Input
                              value={editPillar.name}
                              onChange={(e) => setEditPillar({ ...editPillar, name: e.target.value })}
                              className="border-brand-200"
                            />
                            <Textarea
                              value={editPillar.description}
                              onChange={(e) => setEditPillar({ ...editPillar, description: e.target.value })}
                              rows={2}
                              className="border-brand-200 resize-none"
                            />
                            <div className="flex gap-1">
                              {pillarColors.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setEditPillar({ ...editPillar, color })}
                                  className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                                    editPillar.color === color ? 'ring-2 ring-offset-1 ring-brand-500' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditPillar(pillar.id)}
                                disabled={isLoading}
                                size="sm"
                                className="bg-brand-600 hover:bg-brand-700"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                {language === 'fr' ? 'Sauver' : 'Save'}
                              </Button>
                              <Button
                                onClick={() => setEditingPillarId(null)}
                                variant="ghost"
                                size="sm"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Display mode */
                        <div
                          className="group relative p-4 rounded-xl border bg-white dark:bg-background hover:shadow-lg transition-all duration-300 cursor-pointer"
                          style={{ borderLeftWidth: '4px', borderLeftColor: pillar.color }}
                        >
                          <Link href={`/ideas?pillar=${pillar.id}`} className="block">
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                style={{ backgroundColor: pillar.color }}
                              >
                                {pillar.name.charAt(0).toUpperCase()}
                              </div>
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                              >
                                {pillar.ideaCount} {language === 'fr' ? 'idées' : 'ideas'}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{pillar.name}</h3>
                            {pillar.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {pillar.description}
                              </p>
                            )}
                          </Link>
                          
                          {/* Action buttons - shown on hover */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                startEditing(pillar)
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-background shadow-sm border hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                            >
                              <Edit3 className="w-3 h-3 text-muted-foreground" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeletePillar(pillar.id)
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-background shadow-sm border hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : !isAddingPillar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="font-medium mb-2">
                    {language === 'fr' ? 'Créez votre premier pilier' : 'Create your first pillar'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                    {language === 'fr' 
                      ? 'Les piliers vous aident à organiser vos idées de contenu par thème (ex: Tutoriels, Vlogs, Reviews...)' 
                      : 'Pillars help you organize your content ideas by theme (e.g., Tutorials, Vlogs, Reviews...)'}
                  </p>
                  <Button 
                    onClick={() => setIsAddingPillar(true)}
                    className="bg-brand-600 hover:bg-brand-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Créer un pilier' : 'Create a pillar'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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
