'use client'

import { useState, useMemo } from 'react'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Lightbulb,
  Plus,
  Search,
  Calendar,
  Trash2,
  Pencil,
  Eye,
  Grid3X3,
  LayoutList,
  Clock,
  Play,
  FileEdit,
  Send,
  Archive,
  Video,
  BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn, STATUS_PIPELINE } from '@/lib/utils'

// Types
type Idea = Tables<'ideas'> & {
  content_pillar?: { id: string; name: string; color: string } | null
  category?: { id: string; name: string } | null
  content_type?: { id: string; name: string; icon: string } | null
}

type ContentPillar = Tables<'content_pillars'>
type Category = Tables<'categories'>
type ContentType = Tables<'content_types'>

type IdeaStatus = 'idea' | 'scripted' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'

interface IdeasContentProps {
  ideas: Idea[]
  pillars: ContentPillar[]
  categories: Category[]
  contentTypes: ContentType[]
  userId: string
}

// Status configuration — 7-step linear pipeline + legacy backward compat
const statusConfig: Record<string, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  idea:      { label: 'Idea',      icon: Lightbulb, color: 'text-amber-600',  bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  scripted:  { label: 'Scripted',  icon: Pencil,    color: 'text-blue-600',   bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  to_film:   { label: 'To Film',   icon: Video,     color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  filmed:    { label: 'Filmed',    icon: Video,     color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  editing:   { label: 'Editing',   icon: Play,      color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  scheduled: { label: 'Scheduled', icon: Clock,     color: 'text-cyan-600',   bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  published: { label: 'Published', icon: Send,      color: 'text-green-600',  bgColor: 'bg-green-100 dark:bg-green-900/30' },
  archived:  { label: 'Archived',  icon: Archive,   color: 'text-gray-500',   bgColor: 'bg-gray-100 dark:bg-gray-800' },
  // Legacy: draft/planned both display as Idea
  draft:     { label: 'Idea',      icon: Lightbulb, color: 'text-amber-600',  bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  planned:   { label: 'Idea',      icon: Lightbulb, color: 'text-amber-600',  bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
}

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'High', color: 'bg-red-500' },
  2: { label: 'Medium', color: 'bg-yellow-500' },
  3: { label: 'Low', color: 'bg-gray-400' },
}

const PLATFORM_LABELS: Record<string, string> = {
  youtube_shorts: 'YouTube Shorts',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram_reels: 'Instagram Reels',
  instagram_feed: 'Instagram Feed',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  pinterest: 'Pinterest',
  podcast: 'Podcast',
}

export function IdeasContent({ 
  ideas: initialIdeas, 
  pillars,
  categories,
  userId 
}: IdeasContentProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPillar, setFilterPillar] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')
  const [deleteIdea, setDeleteIdea] = useState<Idea | null>(null)
  const [analyticsIdea, setAnalyticsIdea] = useState<Idea | null>(null)

  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let result = ideas.filter(idea => {
      const matchesSearch = 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const rawStatus = idea.status as string
      const normalizedStatus = (rawStatus === 'draft' || rawStatus === 'planned') ? 'idea' : rawStatus
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'idea' && (rawStatus === 'idea' || rawStatus === 'draft' || rawStatus === 'planned')) ||
        normalizedStatus === filterStatus
      const matchesPillar = filterPillar === 'all' || idea.pillar_id === filterPillar

      return matchesSearch && matchesStatus && matchesPillar
    })

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else if (sortBy === 'priority') {
        return (a.priority || 2) - (b.priority || 2)
      }
      return 0
    })

    return result
  }, [ideas, searchQuery, filterStatus, filterPillar, sortBy])

  // Status stats — normalize legacy draft/planned → idea
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {}
    ideas.forEach(idea => {
      const raw = idea.status as string
      const key = (raw === 'draft' || raw === 'planned') ? 'idea' : raw
      stats[key] = (stats[key] || 0) + 1
    })
    return stats
  }, [ideas])

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deleteIdea) return

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', deleteIdea.id)

      if (error) throw error

      setIdeas(prev => prev.filter(i => i.id !== deleteIdea.id))
      setDeleteIdea(null)
      
      toast({
        title: 'Idea deleted',
        description: 'The idea has been deleted successfully.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete the idea.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Ideas
          </h1>
          <p className="text-muted-foreground mt-1">
            {ideas.length} total ideas
          </p>
        </div>
        <Button asChild>
          <Link href="/ideas/new">
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            filterStatus === 'all' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          All ({ideas.length})
        </button>
        {STATUS_PIPELINE.map(({ key, label }) => {
          const config = statusConfig[key]
          const count = statusStats[key] || 0
          if (count === 0) return null
          const Icon = config.icon
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                filterStatus === key
                  ? "bg-primary text-primary-foreground"
                  : cn(config.bgColor, config.color, "hover:opacity-80")
              )}
            >
              <Icon className="h-3 w-3" />
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterPillar} onValueChange={setFilterPillar}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Pillars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pillars</SelectItem>
            {pillars.map(pillar => (
              <SelectItem key={pillar.id} value={pillar.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: pillar.color }} 
                  />
                  {pillar.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 transition-colors",
              viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 transition-colors",
              viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Ideas Display */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-xl">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No ideas found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all' 
              ? "Try adjusting your filters" 
              : "Create your first idea to get started"}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Button asChild>
              <Link href="/ideas/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Idea
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <IdeaGridCard
              key={idea.id}
              idea={idea}
              onDelete={() => setDeleteIdea(idea)}
              onLogAnalytics={() => setAnalyticsIdea(idea)}
              router={router}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIdeas.map((idea) => (
            <IdeaListRow
              key={idea.id}
              idea={idea}
              onDelete={() => setDeleteIdea(idea)}
              onLogAnalytics={() => setAnalyticsIdea(idea)}
              router={router}
            />
          ))}
        </div>
      )}

      {/* Video Analytics Dialog */}
      <VideoAnalyticsDialog
        idea={analyticsIdea}
        userId={userId}
        open={!!analyticsIdea}
        onClose={() => setAnalyticsIdea(null)}
        supabase={supabaseMutation}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteIdea} onOpenChange={(open) => !open && setDeleteIdea(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteIdea?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Grid Card Component
function IdeaGridCard({ idea, onDelete, onLogAnalytics, router }: {
  idea: Idea
  onDelete: () => void
  onLogAnalytics: () => void
  router: ReturnType<typeof useRouter>
}) {
  const normalizedIdeaStatus = (() => { const s = idea.status as string; return (s === 'draft' || s === 'planned') ? 'idea' : s })()
  const status = statusConfig[normalizedIdeaStatus] || statusConfig.idea
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority as number]
  const platforms = (idea as any).platforms as string[] | null

  return (
    <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="p-4 space-y-3">
        {/* Title */}
        <button onClick={() => router.push(`/ideas/${idea.id}`)} className="block text-left w-full">
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {idea.title}
          </h3>
        </button>

        {/* Hook */}
        {idea.hook && (
          <p className="text-sm text-muted-foreground line-clamp-2">{idea.hook}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {idea.content_pillar && (
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: `${idea.content_pillar.color}20`, color: idea.content_pillar.color }}
            >
              {idea.content_pillar.name}
            </Badge>
          )}
          {idea.category && (
            <Badge variant="outline" className="text-xs">{idea.category.name}</Badge>
          )}
        </div>

        {/* Platform badges */}
        {platforms && platforms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {platforms.map((p) => (
              <span key={p} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {PLATFORM_LABELS[p] || p}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge className={cn('gap-1', status.bgColor, status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
          {priority && (
            <div className="flex items-center gap-1">
              <div className={cn('w-2 h-2 rounded-full', priority.color)} />
              <span className="text-xs text-muted-foreground">{priority.label}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/production?id=${idea.id}`)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
          {idea.status === 'published' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={onLogAnalytics}
            >
              <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
              Log Analytics
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// List Row Component
function IdeaListRow({ idea, onDelete, onLogAnalytics, router }: {
  idea: Idea
  onDelete: () => void
  onLogAnalytics: () => void
  router: ReturnType<typeof useRouter>
}) {
  const normalizedIdeaStatus = (() => { const s = idea.status as string; return (s === 'draft' || s === 'planned') ? 'idea' : s })()
  const status = statusConfig[normalizedIdeaStatus] || statusConfig.idea
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority as number]

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div className={cn("p-2 rounded-lg shrink-0", status.bgColor)}>
          <StatusIcon className={cn("h-4 w-4", status.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button onClick={() => router.push(`/ideas/${idea.id}`)} className="hover:text-primary transition-colors text-left">
            <h3 className="font-medium truncate">{idea.title}</h3>
          </button>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {idea.content_pillar && (
              <span style={{ color: idea.content_pillar.color }}>
                {idea.content_pillar.name}
              </span>
            )}
            <span>
              {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: enUS })}
            </span>
          </div>
        </div>

        {/* Priority */}
        {priority && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", priority.color)} />
            <span className="text-xs text-muted-foreground">{priority.label}</span>
          </div>
        )}

        {/* Status Badge */}
        <Badge className={cn("hidden md:flex gap-1 shrink-0", status.bgColor, status.color)}>
          {status.label}
        </Badge>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {idea.status === 'published' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Log Analytics"
              onClick={onLogAnalytics}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/production?id=${idea.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Video Analytics Dialog
function VideoAnalyticsDialog({ idea, userId, open, onClose, supabase }: {
  idea: Idea | null
  userId: string
  open: boolean
  onClose: () => void
  supabase: ReturnType<typeof createUntypedClient>
}) {
  const emptyForm = {
    platform: '',
    posted_at: new Date().toISOString().split('T')[0],
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    reach: '',
    notes: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const ideaPlatforms = (idea as any)?.platforms as string[] | null
  const platformOptions = ideaPlatforms && ideaPlatforms.length > 0
    ? ideaPlatforms
    : Object.keys(PLATFORM_LABELS)

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleClose = () => { onClose(); setForm(emptyForm) }

  const handleSubmit = async () => {
    if (!idea || !form.platform) {
      toast({ title: 'Error', description: 'Please select a platform.', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    try {
      const { error } = await supabase.from('video_analytics').insert({
        user_id: userId,
        idea_id: idea.id,
        platform: form.platform,
        posted_at: form.posted_at || null,
        views: parseInt(form.views) || 0,
        likes: parseInt(form.likes) || 0,
        comments: parseInt(form.comments) || 0,
        shares: parseInt(form.shares) || 0,
        saves: parseInt(form.saves) || 0,
        reach: parseInt(form.reach) || 0,
        notes: form.notes || null,
      })
      if (error) throw error
      toast({
        title: 'Analytics saved',
        description: `Metrics logged for "${idea.title}" on ${PLATFORM_LABELS[form.platform] || form.platform}.`,
      })
      handleClose()
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Unable to save analytics.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const metrics = [
    { key: 'views', label: 'Views' },
    { key: 'likes', label: 'Likes' },
    { key: 'comments', label: 'Comments' },
    { key: 'shares', label: 'Shares' },
    { key: 'saves', label: 'Saves' },
    { key: 'reach', label: 'Reach' },
  ]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Log Video Analytics
          </DialogTitle>
          <DialogDescription className="truncate">{idea?.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Platform */}
          <div className="space-y-1.5">
            <Label>Platform <span className="text-red-500">*</span></Label>
            <Select value={form.platform} onValueChange={(v) => set('platform', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform..." />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((p) => (
                  <SelectItem key={p} value={p}>{PLATFORM_LABELS[p] || p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Posted date */}
          <div className="space-y-1.5">
            <Label>Date posted</Label>
            <Input
              type="date"
              value={form.posted_at}
              onChange={(e) => set('posted_at', e.target.value)}
            />
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              rows={2}
              placeholder="Any notes about this post's performance..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving…' : 'Save Analytics'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
