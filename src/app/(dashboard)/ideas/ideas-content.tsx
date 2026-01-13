'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { cn } from '@/lib/utils'

// Types
type Idea = Tables<'ideas'> & {
  content_pillar?: { id: string; name: string; color: string } | null
  category?: { id: string; name: string } | null
  content_type?: { id: string; name: string; icon: string } | null
}

type ContentPillar = Tables<'content_pillars'>
type Category = Tables<'categories'>
type ContentType = Tables<'content_types'>

type IdeaStatus = 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'

interface IdeasContentProps {
  ideas: Idea[]
  pillars: ContentPillar[]
  categories: Category[]
  contentTypes: ContentType[]
  userId: string
}

// Status configuration
const statusConfig: Record<IdeaStatus, { 
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  draft: { label: 'Draft', icon: FileEdit, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  scripted: { label: 'Scripted', icon: Pencil, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  planned: { label: 'Planned', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  to_film: { label: 'To Film', icon: Video, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  filmed: { label: 'Filmed', icon: Video, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  editing: { label: 'Editing', icon: Play, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  published: { label: 'Published', icon: Send, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  archived: { label: 'Archived', icon: Archive, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'High', color: 'bg-red-500' },
  2: { label: 'Medium', color: 'bg-yellow-500' },
  3: { label: 'Low', color: 'bg-gray-400' },
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

  const { toast } = useToast()
  const supabase = createClient()

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let result = ideas.filter(idea => {
      const matchesSearch = 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || idea.status === filterStatus
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

  // Status stats
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {}
    Object.keys(statusConfig).forEach(status => {
      stats[status] = ideas.filter(i => i.status === status).length
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
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusStats[status] || 0
          if (count === 0) return null
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                filterStatus === status 
                  ? "bg-primary text-primary-foreground" 
                  : cn(config.bgColor, config.color, "hover:opacity-80")
              )}
            >
              {config.label} ({count})
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
            />
          ))}
        </div>
      )}

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
function IdeaGridCard({ idea, onDelete }: { idea: Idea; onDelete: () => void }) {
  const status = statusConfig[idea.status as IdeaStatus] || statusConfig.draft
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority as number]

  return (
    <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="p-4 space-y-3">
        {/* Title - Clickable */}
        <Link href={`/ideas/${idea.id}`} className="block">
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {idea.title}
          </h3>
        </Link>

        {/* Hook */}
        {idea.hook && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.hook}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {idea.content_pillar && (
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: `${idea.content_pillar.color}20`,
                color: idea.content_pillar.color,
              }}
            >
              {idea.content_pillar.name}
            </Badge>
          )}
          {idea.category && (
            <Badge variant="outline" className="text-xs">
              {idea.category.name}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge className={cn("gap-1", status.bgColor, status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
          {priority && (
            <div className="flex items-center gap-1">
              <div className={cn("w-2 h-2 rounded-full", priority.color)} />
              <span className="text-xs text-muted-foreground">{priority.label}</span>
            </div>
          )}
        </div>

        {/* Action Buttons - Using Button asChild with Link */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/ideas/${idea.id}`}>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/production?id=${idea.id}`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// List Row Component
function IdeaListRow({ idea, onDelete }: { idea: Idea; onDelete: () => void }) {
  const status = statusConfig[idea.status as IdeaStatus] || statusConfig.draft
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
          <Link href={`/ideas/${idea.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-medium truncate">{idea.title}</h3>
          </Link>
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

        {/* Actions - Using Button asChild with Link */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/ideas/${idea.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/production?id=${idea.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
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
