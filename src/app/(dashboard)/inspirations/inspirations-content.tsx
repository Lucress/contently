'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { 
  Lightbulb, 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Image,
  Video,
  FileText,
  Filter,
  MoreVertical,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type Inspiration = Tables<'inspirations'>
type InspirationSource = 'manual' | 'email' | 'social' | 'conversation' | 'article' | 'other'
type InspirationStatus = 'pending' | 'reviewing' | 'approved' | 'converted' | 'archived'

interface InspirationsContentProps {
  inspirations: Inspiration[]
  userId: string
}

const statusConfig: Record<InspirationStatus, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
  reviewing: {
    label: 'Reviewing',
    icon: Sparkles,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  converted: {
    label: 'Converted',
    icon: ArrowRight,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  archived: {
    label: 'Archived',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  }
}

const sourceIcons: Record<string, React.ElementType> = {
  manual: FileText,
  email: FileText,
  social: Instagram,
  conversation: FileText,
  article: FileText,
  other: Globe,
}

const sourceColors: Record<string, string> = {
  manual: 'bg-blue-500',
  email: 'bg-purple-500',
  social: 'bg-gradient-to-r from-purple-500 to-pink-500',
  conversation: 'bg-green-500',
  article: 'bg-orange-500',
  other: 'bg-gray-500',
}

// Helper to extract platform from URL
const getPlatformFromUrl = (url: string): { platform: string; icon: React.ElementType; color: string } => {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (hostname.includes('instagram.com')) return { platform: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' }
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return { platform: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return { platform: 'X/Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' }
    if (hostname.includes('tiktok.com')) return { platform: 'TikTok', icon: Video, color: 'from-black to-gray-800' }
    if (hostname.includes('linkedin.com')) return { platform: 'LinkedIn', icon: Globe, color: 'from-blue-600 to-blue-700' }
    return { platform: hostname, icon: Globe, color: 'from-gray-500 to-gray-600' }
  } catch {
    return { platform: 'Link', icon: Globe, color: 'from-gray-500 to-gray-600' }
  }
}

// Helper to get video thumbnail from URL
const getThumbnailUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = ''
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1)
      } else {
        videoId = urlObj.searchParams.get('v') || ''
      }
      if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    }
    return null
  } catch {
    return null
  }
}

export function InspirationsContent({ inspirations: initialInspirations, userId }: InspirationsContentProps) {
  const [inspirations, setInspirations] = useState<Inspiration[]>(initialInspirations)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTransformDialogOpen, setIsTransformDialogOpen] = useState(false)
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    source_url: '',
    source: 'other' as InspirationSource,
    status: 'pending' as InspirationStatus,
    notes: '',
  })

  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  const filteredInspirations = inspirations.filter(insp => {
    const matchesSearch = 
      insp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.source_url?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSource = filterSource === 'all' || insp.source === filterSource
    const matchesStatus = filterStatus === 'all' || (insp as any).status === filterStatus

    return matchesSearch && matchesSource && matchesStatus
  })

  const stats = {
    total: inspirations.length,
    unprocessed: inspirations.filter(i => !i.is_processed).length,
    processed: inspirations.filter(i => i.is_processed).length,
  }

  const resetForm = () => {
    setFormData({
      title: '',
      source_url: '',
      source: 'other',
      status: 'pending',
      notes: '',
    })
  }

  const detectSource = (url: string): InspirationSource => {
    if (url.includes('instagram.com') || url.includes('tiktok.com') || 
        url.includes('twitter.com') || url.includes('x.com') ||
        url.includes('youtube.com') || url.includes('youtu.be')) return 'social'
    if (url.includes('medium.com') || url.includes('substack.com')) return 'article'
    return 'other'
  }

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      source_url: url,
      source: detectSource(url),
    }))
  }

  const handleCreate = async () => {
    if (!formData.title && !formData.source_url && !formData.notes) {
      toast({
        title: 'Error',
        description: 'Please add a title, link, or notes.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const inspirationData = {
        user_id: userId,
        title: formData.title || 'Untitled Inspiration',
        source_url: formData.source_url || null,
        source: formData.source,
        status: formData.status,
        notes: formData.notes || null,
        is_processed: formData.status === 'converted',
      }
      
      console.log('[Inspirations] Saving with data:', inspirationData)
      
      const { data, error } = await supabaseMutation
        .from('inspirations')
        .insert(inspirationData)
        .select()
        .single()

      if (error) {
        console.error('[Inspirations] Save error:', error)
        throw error
      }

      console.log('[Inspirations] Save successful:', data)
      setInspirations(prev => [data as Inspiration, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      
      toast({
        title: 'Inspiration saved',
        description: 'Your inspiration has been added successfully.',
      })
    } catch (error) {
      console.error('[Inspirations] Catch block error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unable to save the inspiration.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkProcessed = async (inspiration: Inspiration, processed: boolean) => {
    try {
      const { error } = await supabaseMutation
        .from('inspirations')
        .update({ is_processed: processed })
        .eq('id', inspiration.id)

      if (error) throw error

      setInspirations(prev => 
        prev.map(i => i.id === inspiration.id ? { ...i, is_processed: processed } : i)
      )

      toast({
        title: 'Status updated',
        description: processed ? 'Inspiration marked as processed.' : 'Inspiration marked as unprocessed.',
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

  const handleDelete = async (inspiration: Inspiration) => {
    try {
      const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', inspiration.id)

      if (error) throw error

      setInspirations(prev => prev.filter(i => i.id !== inspiration.id))
      
      toast({
        title: 'Inspiration deleted',
        description: 'The inspiration has been deleted successfully.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete the inspiration.',
        variant: 'destructive',
      })
    }
  }

  const handleTransformToIdea = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration)
    setIsTransformDialogOpen(true)
  }

  const confirmTransform = () => {
    if (selectedInspiration) {
      const params = new URLSearchParams({
        from_inspiration: selectedInspiration.id,
        notes: selectedInspiration.notes || '',
        source_url: selectedInspiration.source_url || '',
        title: selectedInspiration.title || '',
      })
      router.push(`/ideas/new?${params.toString()}`)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inspirations</h1>
          <p className="text-muted-foreground mt-1">
            Capture and organize your sources of inspiration
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Inspiration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-primary/10 text-primary' },
          { label: 'Unprocessed', value: stats.unprocessed, color: 'bg-yellow-500/10 text-yellow-600' },
          { label: 'Processed', value: stats.processed, color: 'bg-green-500/10 text-green-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${stat.color.split(' ')[1]}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your inspirations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="conversation">Conversation</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              return (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", config.color)} />
                    {config.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Inspirations Gallery */}
      {filteredInspirations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchQuery || filterSource !== 'all' || filterStatus !== 'all'
              ? 'No inspirations found'
              : 'No inspirations yet'}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery || filterSource !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters.'
              : 'Start collecting inspirations by clicking the button above.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredInspirations.map((inspiration, index) => {
              const SourceIcon = sourceIcons[inspiration.source] || Globe
              const sourceColor = sourceColors[inspiration.source] || 'bg-gray-500'
              
              // Get platform info if there's a URL
              const platformInfo = inspiration.source_url ? getPlatformFromUrl(inspiration.source_url) : null
              const PlatformIcon = platformInfo?.icon || SourceIcon
              const thumbnailUrl = inspiration.source_url ? getThumbnailUrl(inspiration.source_url) : null

              return (
                <motion.div
                  key={inspiration.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all"
                >
                  {/* Link Preview / Thumbnail */}
                  <div className="aspect-video relative overflow-hidden">
                    {thumbnailUrl ? (
                      <>
                        <img 
                          src={thumbnailUrl} 
                          alt={inspiration.title || 'Inspiration thumbnail'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </>
                    ) : inspiration.source_url ? (
                      <div className={cn(
                        "w-full h-full bg-gradient-to-br flex items-center justify-center",
                        platformInfo?.color ? platformInfo.color : "from-muted to-muted/50"
                      )}>
                        <PlatformIcon className="h-16 w-16 text-white/80" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <SourceIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    {/* Platform Badge */}
                    {platformInfo && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                        <PlatformIcon className="h-3.5 w-3.5" />
                        {platformInfo.platform}
                      </div>
                    )}
                    
                    {/* Source Badge (if no URL) */}
                    {!platformInfo && (
                      <div className={`absolute top-3 left-3 p-1.5 rounded-lg ${sourceColor} text-white`}>
                        <SourceIcon className="h-4 w-4" />
                      </div>
                    )}
                    
                    {/* Open Link Button */}
                    {inspiration.source_url && (
                      <a
                        href={inspiration.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Status & Date */}
                    <div className="flex items-center justify-between">
                      {(() => {
                        const inspirationStatus = (inspiration as any).status || 'pending'
                        const config = statusConfig[inspirationStatus as InspirationStatus]
                        const StatusIcon = config.icon
                        return (
                          <Badge variant="secondary" className={config.bgColor}>
                            <StatusIcon className={cn("h-3 w-3 mr-1", config.color)} />
                            <span className={config.color}>{config.label}</span>
                          </Badge>
                        )
                      })()}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(inspiration.created_at), {
                          addSuffix: true,
                          locale: enUS,
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium line-clamp-1">{inspiration.title}</h3>

                    {/* Notes */}
                    {inspiration.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {inspiration.notes}
                      </p>
                    )}

                    {/* Source URL (only show if no thumbnail) */}
                    {inspiration.source_url && !getThumbnailUrl(inspiration.source_url) && (
                      <a
                        href={inspiration.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors truncate"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {(() => {
                            try {
                              return new URL(inspiration.source_url).hostname
                            } catch {
                              return inspiration.source_url
                            }
                          })()}
                        </span>
                      </a>
                    )}

                    {/* Move to Idea Button - Prominent */}
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
                      onClick={() => handleTransformToIdea(inspiration)}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Move to Idea
                    </Button>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!inspiration.is_processed ? (
                            <DropdownMenuItem 
                              onClick={() => handleMarkProcessed(inspiration, true)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Processed
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleMarkProcessed(inspiration, false)}
                            >
                              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                              Mark as Unprocessed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(inspiration)}
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
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Inspiration</DialogTitle>
            <DialogDescription>
              Save a link or notes so you don&apos;t forget.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What inspired you?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_url">Source Link</Label>
              <Input
                id="source_url"
                placeholder="https://..."
                value={formData.source_url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              {formData.source_url && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Source type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {formData.source}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Why does this inspire you?"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as InspirationStatus }))}
              >
                <SelectTrigger>
                  {(() => {
                    const StatusIcon = statusConfig[formData.status].icon
                    return <StatusIcon className="h-4 w-4 mr-2" />
                  })()}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const Icon = config.icon
                    return (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", config.color)} />
                          {config.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transform to Idea Dialog */}
      <Dialog open={isTransformDialogOpen} onOpenChange={setIsTransformDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Transform to Idea
            </DialogTitle>
            <DialogDescription>
              This inspiration will be used as the basis for a new content idea.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInspiration && (
            <div className="py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="font-medium">{selectedInspiration.title}</p>
                {selectedInspiration.notes && (
                  <p className="text-sm text-muted-foreground">{selectedInspiration.notes}</p>
                )}
                {selectedInspiration.source_url && (
                  <a
                    href={selectedInspiration.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View source
                  </a>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransformDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmTransform} className="gap-2">
              Create Idea
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
