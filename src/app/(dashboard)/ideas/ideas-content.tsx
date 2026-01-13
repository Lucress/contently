'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Trash2,
  Edit,
  Eye,
  ArrowUpRight,
  Grid3X3,
  List,
  SlidersHorizontal,
  Tag,
  Folder,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  FileEdit,
  Send,
  Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { formatDistanceToNow, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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

const statusConfig: Record<IdeaStatus, { 
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  draft: { 
    label: 'Draft', 
    icon: FileEdit, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
  scripted: { 
    label: 'Scripted', 
    icon: Edit, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  planned: { 
    label: 'Planned', 
    icon: Calendar, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  to_film: { 
    label: 'To Film', 
    icon: Video, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  filmed: { 
    label: 'Filmed', 
    icon: Video, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  },
  editing: { 
    label: 'Editing', 
    icon: Play, 
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30'
  },
  scheduled: { 
    label: 'Scheduled', 
    icon: Clock, 
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
  },
  published: { 
    label: 'Published', 
    icon: Send, 
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  archived: { 
    label: 'Archived', 
    icon: Archive, 
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
}

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'High', color: 'bg-red-500' },
  2: { label: 'Medium', color: 'bg-yellow-500' },
  3: { label: 'Low', color: 'bg-gray-500' },
}

export function IdeasContent({ 
  ideas: initialIdeas, 
  pillars,
  categories,
  contentTypes,
  userId 
}: IdeasContentProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPillar, setFilterPillar] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')

  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Check if we're coming from an inspiration
  const fromInspiration = searchParams.get('from_inspiration')

  const filteredIdeas = useMemo(() => {
    let result = ideas.filter(idea => {
      const matchesSearch = 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || idea.status === filterStatus
      const matchesPillar = filterPillar === 'all' || idea.pillar_id === filterPillar
      const matchesCategory = filterCategory === 'all' || idea.category_id === filterCategory

      return matchesSearch && matchesStatus && matchesPillar && matchesCategory
    })

    // Sort
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
  }, [ideas, searchQuery, filterStatus, filterPillar, filterCategory, sortBy])

  // Stats par statut
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {}
    Object.keys(statusConfig).forEach(status => {
      stats[status] = ideas.filter(i => i.status === status).length
    })
    return stats
  }, [ideas])

  const handleDelete = async (idea: Idea) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id)

      if (error) throw error

      setIdeas(prev => prev.filter(i => i.id !== idea.id))
      
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

  const handleStatusChange = async (idea: Idea, newStatus: IdeaStatus) => {
    try {
      const { error } = await supabaseMutation
        .from('ideas')
        .update({ status: newStatus })
        .eq('id', idea.id)

      if (error) throw error

      setIdeas(prev => 
        prev.map(i => i.id === idea.id ? { ...i, status: newStatus } : i) as Idea[]
      )

      toast({
        title: 'Status Updated',
        description: `The idea is now "${statusConfig[newStatus].label}".`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to update status.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your content ideas
          </p>
        </div>
        <Button onClick={() => router.push('/ideas/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Idea
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(statusConfig).map(([status, config]) => {
          const StatusIcon = config.icon
          const count = statusStats[status] || 0
          const isActive = filterStatus === status
          
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(isActive ? 'all' : status)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shrink-0",
                isActive 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:bg-muted"
              )}
            >
              <StatusIcon className={cn("h-4 w-4", config.color)} />
              <span className="text-sm font-medium">{config.label}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
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
            className="pl-10"
          />
        </div>
        
        <Select value={filterPillar} onValueChange={setFilterPillar}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Tag className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Pillar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pillars</SelectItem>
            {pillars.map(pillar => (
              <SelectItem key={pillar.id} value={pillar.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pillar.color }}
                  />
                  {pillar.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Folder className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Ideas Grid/List */}
      {filteredIdeas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchQuery || filterStatus !== 'all' || filterPillar !== 'all' || filterCategory !== 'all'
              ? 'No ideas found'
              : 'No ideas yet'}
          </h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            {searchQuery || filterStatus !== 'all' || filterPillar !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters.'
              : 'Create your first content idea.'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Button onClick={() => router.push('/ideas/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Idea
            </Button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredIdeas.map((idea, index) => (
              <IdeaCard 
                key={idea.id} 
                idea={idea} 
                index={index}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredIdeas.map((idea, index) => (
              <IdeaListItem 
                key={idea.id} 
                idea={idea} 
                index={index}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

interface IdeaCardProps {
  idea: Idea
  index: number
  onDelete: (idea: Idea) => void
  onStatusChange: (idea: Idea, status: IdeaStatus) => void
}

function IdeaCard({ idea, index, onDelete, onStatusChange }: IdeaCardProps) {
  const status = statusConfig[idea.status as IdeaStatus]
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority]

  const handleViewClick = () => {
    window.location.href = `/ideas/${idea.id}`
  }

  const handleDeleteClick = () => {
    onDelete(idea)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/ideas/${idea.id}`} className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
              {idea.title}
            </h3>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => { window.location.href = `/ideas/${idea.id}` }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => { window.location.href = `/production?id=${idea.id}` }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onSelect={() => onDelete(idea)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
          {idea.content_type && (
            <Badge variant="outline" className="text-xs">
              {idea.content_type.name}
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
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", priority.color)} />
              <span className="text-xs text-muted-foreground">{priority.label}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function IdeaListItem({ idea, index, onDelete, onStatusChange }: IdeaCardProps) {
  const status = statusConfig[idea.status as IdeaStatus]
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority]

  const handleDeleteClick = () => {
    onDelete(idea)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.02 }}
      className="group bg-card border rounded-lg p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div className={cn("p-2 rounded-lg shrink-0", status.bgColor)}>
          <StatusIcon className={cn("h-4 w-4", status.color)} />
        </div>

        {/* Content */}
        <Link href={`/ideas/${idea.id}`} className="flex-1 min-w-0">
          <h3 className="font-medium truncate hover:underline cursor-pointer">{idea.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            {idea.content_pillar && (
              <span 
                className="text-xs font-medium"
                style={{ color: idea.content_pillar.color }}
              >
                {idea.content_pillar.name}
              </span>
            )}
            {idea.category && (
              <span className="text-xs text-muted-foreground">
                {idea.category.name}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: enUS })}
            </span>
          </div>
        </Link>

        {/* Priority */}
        {priority && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", priority.color)} />
            <span className="text-xs text-muted-foreground">{priority.label}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            size="sm" 
            variant="ghost" 
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href={`/ideas/${idea.id}`}>
              View
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => { window.location.href = `/ideas/${idea.id}` }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => { window.location.href = `/production?id=${idea.id}` }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onSelect={() => onDelete(idea)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}
