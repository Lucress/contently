'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Video,
  Camera,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  FileText,
  Settings,
  ArrowRight,
  Check,
  Edit,
  Hash,
  Save,
  X,
  Film,
  Send,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { format, isToday, isTomorrow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type Idea = Tables<'ideas'> & {
  content_pillar?: { id: string; name: string; color: string } | null
  category?: { id: string; name: string } | null
  content_type?: { id: string; name: string; icon: string } | null
  filming_setup?: { 
    id: string
    name: string
    description: string | null
    checklist: Record<string, unknown> | null
  } | null
}

type FilmingSetup = Tables<'filming_setups'>
type Hashtag = Tables<'hashtags'>

interface ProductionContentProps {
  productionIdeas: Idea[]
  filmingSetups: FilmingSetup[]
  hashtags: Hashtag[]
  userId: string
}

type IdeaStatus = 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'

const statusConfig: Record<IdeaStatus, { 
  label: string
  color: string
  bgColor: string
}> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  scripted: { label: 'Scripted', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  planned: { label: 'Planned', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  to_film: { label: 'To Film', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  filmed: { label: 'Filmed', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  editing: { label: 'Editing', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  scheduled: { label: 'Scheduled', color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  published: { label: 'Published', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  archived: { label: 'Archived', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

export function ProductionContent({ 
  productionIdeas: initialIdeas, 
  filmingSetups,
  hashtags,
  userId 
}: ProductionContentProps) {
  const [ideas, setIdeas] = useState(initialIdeas)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isScheduleFilmingOpen, setIsScheduleFilmingOpen] = useState(false)
  const [isSchedulePostOpen, setIsSchedulePostOpen] = useState(false)
  const [filmingDate, setFilmingDate] = useState('')
  const [filmingTime, setFilmingTime] = useState('09:00')
  const [postDate, setPostDate] = useState('')
  const [postTime, setPostTime] = useState('12:00')
  const [isLoading, setIsLoading] = useState(false)
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    hook: '',
    description: '',
    script_text: '',
    cta: '',
    filming_notes: '',
    selected_hashtags: [] as string[],
  })

  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Auto-select idea from URL param
  useEffect(() => {
    const ideaId = searchParams.get('id')
    if (ideaId && ideas.length > 0) {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea) {
        selectIdea(idea)
      }
    }
  }, [searchParams, ideas])

  // Group ideas by status
  const ideasByStatus = useMemo(() => {
    return {
      scripted: ideas.filter(i => i.status === 'scripted'),
      planned: ideas.filter(i => i.status === 'planned' || i.status === 'to_film'),
      filmed: ideas.filter(i => i.status === 'filmed'),
      editing: ideas.filter(i => i.status === 'editing'),
    }
  }, [ideas])

  const filteredIdeas = useMemo(() => {
    if (filterStatus === 'all') return ideas
    if (filterStatus === 'scripted') return ideasByStatus.scripted
    if (filterStatus === 'planned') return ideasByStatus.planned
    if (filterStatus === 'filmed') return ideasByStatus.filmed
    if (filterStatus === 'editing') return ideasByStatus.editing
    return ideas
  }, [ideas, filterStatus, ideasByStatus])

  const selectIdea = (idea: Idea) => {
    setSelectedIdea(idea)
    setEditForm({
      hook: idea.hook || '',
      description: idea.description || '',
      script_text: (idea as any).script_text || '',
      cta: idea.cta || '',
      filming_notes: idea.filming_notes || '',
      selected_hashtags: [],
    })
  }

  const handleSaveIdea = async () => {
    if (!selectedIdea) return

    setIsLoading(true)
    try {
      const { error } = await supabaseMutation
        .from('ideas')
        .update({
          hook: editForm.hook || null,
          description: editForm.description || null,
          script_text: editForm.script_text || null,
          cta: editForm.cta || null,
          filming_notes: editForm.filming_notes || null,
        })
        .eq('id', selectedIdea.id)

      if (error) throw error

      setIdeas(prev => prev.map(i => 
        i.id === selectedIdea.id 
          ? { ...i, ...editForm } 
          : i
      ))
      setSelectedIdea(prev => prev ? { ...prev, ...editForm } : null)

      toast({
        title: 'Saved',
        description: 'Your changes have been saved.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to save changes.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (idea: Idea, newStatus: IdeaStatus) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus }
      
      if (newStatus === 'filmed') {
        updateData.filmed_at = new Date().toISOString()
      }

      const { error } = await supabaseMutation
        .from('ideas')
        .update(updateData)
        .eq('id', idea.id)

      if (error) throw error

      setIdeas(prev => prev.map(i => 
        i.id === idea.id ? { ...i, status: newStatus } : i
      ))
      
      if (selectedIdea?.id === idea.id) {
        setSelectedIdea(prev => prev ? { ...prev, status: newStatus } : null)
      }

      toast({
        title: 'Status Updated',
        description: `Idea moved to "${statusConfig[newStatus].label}".`,
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

  const handleScheduleFilming = async () => {
    if (!selectedIdea || !filmingDate) {
      toast({
        title: 'Error',
        description: 'Please select a filming date.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Update idea with filming date and change status
      const { error: ideaError } = await supabaseMutation
        .from('ideas')
        .update({
          status: 'to_film',
          scheduled_date: filmingDate,
        })
        .eq('id', selectedIdea.id)

      if (ideaError) throw ideaError

      // Create planner item for filming
      const { error: plannerError } = await supabaseMutation
        .from('planner_items')
        .insert({
          user_id: userId,
          idea_id: selectedIdea.id,
          title: `Film: ${selectedIdea.title}`,
          date: filmingDate,
          start_time: filmingTime,
          item_type: 'filming',
        })

      if (plannerError) throw plannerError

      setIdeas(prev => prev.map(i => 
        i.id === selectedIdea.id 
          ? { ...i, status: 'to_film', scheduled_date: filmingDate } 
          : i
      ))
      setSelectedIdea(prev => prev ? { ...prev, status: 'to_film', scheduled_date: filmingDate } : null)

      setIsScheduleFilmingOpen(false)
      setFilmingDate('')
      setFilmingTime('09:00')

      toast({
        title: 'Filming Scheduled',
        description: `Filming scheduled for ${format(new Date(filmingDate), 'MMMM d, yyyy')} at ${filmingTime}. Added to your calendar.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to schedule filming.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchedulePost = async () => {
    if (!selectedIdea || !postDate) {
      toast({
        title: 'Error',
        description: 'Please select a post date.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Update idea status to scheduled
      const { error: ideaError } = await supabaseMutation
        .from('ideas')
        .update({
          status: 'scheduled',
          publish_date: postDate,
        })
        .eq('id', selectedIdea.id)

      if (ideaError) throw ideaError

      // Create planner item for publishing
      const { error: plannerError } = await supabaseMutation
        .from('planner_items')
        .insert({
          user_id: userId,
          idea_id: selectedIdea.id,
          title: `Post: ${selectedIdea.title}`,
          date: postDate,
          start_time: postTime,
          item_type: 'publishing',
        })

      if (plannerError) throw plannerError

      // Remove from production list (now scheduled)
      setIdeas(prev => prev.filter(i => i.id !== selectedIdea.id))
      setSelectedIdea(null)

      setIsSchedulePostOpen(false)
      setPostDate('')
      setPostTime('12:00')

      toast({
        title: 'Post Scheduled',
        description: `Post scheduled for ${format(new Date(postDate), 'MMMM d, yyyy')} at ${postTime}. Added to your planner.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to schedule post.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsFilmed = async (idea: Idea) => {
    await handleStatusChange(idea, 'filmed')
  }

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              Production
            </h1>
            <p className="text-muted-foreground mt-1">
              Edit scripts, schedule filming, and prepare content for publishing
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-sm font-medium text-blue-600">{ideasByStatus.scripted.length} Scripted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <span className="text-sm font-medium text-yellow-600">{ideasByStatus.planned.length} To Film</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <span className="text-sm font-medium text-orange-600">{ideasByStatus.filmed.length} Filmed</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'scripted', 'planned', 'filmed', 'editing'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : statusConfig[status as IdeaStatus]?.label || status}
            </Button>
          ))}
        </div>

        {filteredIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center flex-1"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Film className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No ideas in production</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              Ideas with "Scripted" status will appear here. Write a script for an idea to start production.
            </p>
            <Button asChild>
              <Link href="/ideas">
                <FileText className="h-4 w-4 mr-2" />
                Go to Ideas
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Ideas List */}
            <div className="w-80 shrink-0 overflow-y-auto border rounded-xl bg-card">
              <div className="p-4 border-b bg-muted/30 sticky top-0">
                <h3 className="font-medium">Ideas in Production</h3>
              </div>
              <div className="divide-y">
                {filteredIdeas.map((idea) => {
                  const status = statusConfig[idea.status as IdeaStatus]
                  const isSelected = selectedIdea?.id === idea.id

                  return (
                    <motion.button
                      key={idea.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => selectIdea(idea)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                        isSelected && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{idea.title}</h4>
                          {idea.hook && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {idea.hook}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={cn("text-xs", status.bgColor, status.color)}>
                              {status.label}
                            </Badge>
                            {idea.content_pillar && (
                              <span 
                                className="text-xs font-medium"
                                style={{ color: idea.content_pillar.color }}
                              >
                                {idea.content_pillar.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          isSelected && "rotate-90"
                        )} />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Editor Panel */}
            {selectedIdea ? (
              <div className="flex-1 overflow-y-auto border rounded-xl bg-card">
                <div className="p-4 border-b bg-muted/30 sticky top-0 z-10 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{selectedIdea.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={cn(statusConfig[selectedIdea.status as IdeaStatus].bgColor, statusConfig[selectedIdea.status as IdeaStatus].color)}>
                        {statusConfig[selectedIdea.status as IdeaStatus].label}
                      </Badge>
                      {selectedIdea.content_pillar && (
                        <Badge 
                          variant="secondary"
                          style={{
                            backgroundColor: `${selectedIdea.content_pillar.color}20`,
                            color: selectedIdea.content_pillar.color,
                          }}
                        >
                          {selectedIdea.content_pillar.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" onClick={handleSaveIdea} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Quick Actions based on status */}
                  <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
                    {selectedIdea.status === 'scripted' && (
                      <Button onClick={() => setIsScheduleFilmingOpen(true)} className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Filming
                      </Button>
                    )}
                    {(selectedIdea.status === 'planned' || selectedIdea.status === 'to_film') && (
                      <>
                        <Button onClick={() => handleMarkAsFilmed(selectedIdea)} className="gap-2 bg-orange-600 hover:bg-orange-700">
                          <Video className="h-4 w-4" />
                          Mark as Filmed
                        </Button>
                        {selectedIdea.scheduled_date && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Filming: {format(new Date(selectedIdea.scheduled_date), 'MMM d, yyyy')}
                          </Badge>
                        )}
                      </>
                    )}
                    {selectedIdea.status === 'filmed' && (
                      <>
                        <Button onClick={() => handleStatusChange(selectedIdea, 'editing')} variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Move to Editing
                        </Button>
                        <Button onClick={() => setIsSchedulePostOpen(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                          <Send className="h-4 w-4" />
                          Schedule Post
                        </Button>
                      </>
                    )}
                    {selectedIdea.status === 'editing' && (
                      <Button onClick={() => setIsSchedulePostOpen(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4" />
                        Schedule Post
                      </Button>
                    )}
                  </div>

                  {/* Edit Form */}
                  <Tabs defaultValue="script" className="w-full">
                    <TabsList>
                      <TabsTrigger value="script">Script</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="filming">Filming</TabsTrigger>
                    </TabsList>

                    <TabsContent value="script" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Hook</Label>
                        <Textarea
                          placeholder="The attention-grabbing opening..."
                          rows={2}
                          value={editForm.hook}
                          onChange={(e) => setEditForm(prev => ({ ...prev, hook: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Script</Label>
                        <Textarea
                          placeholder="Write your full script here..."
                          rows={12}
                          value={editForm.script_text}
                          onChange={(e) => setEditForm(prev => ({ ...prev, script_text: e.target.value }))}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Call to Action</Label>
                        <Input
                          placeholder="E.g., Subscribe, Link in bio, Comment..."
                          value={editForm.cta}
                          onChange={(e) => setEditForm(prev => ({ ...prev, cta: e.target.value }))}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Description / Notes</Label>
                        <Textarea
                          placeholder="Additional details about this content..."
                          rows={4}
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      {/* Hashtags */}
                      <div className="space-y-2">
                        <Label>Hashtags</Label>
                        <div className="flex flex-wrap gap-2">
                          {hashtags.map(tag => (
                            <Badge
                              key={tag.id}
                              variant={editForm.selected_hashtags.includes(tag.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                if (editForm.selected_hashtags.includes(tag.id)) {
                                  setEditForm(prev => ({
                                    ...prev,
                                    selected_hashtags: prev.selected_hashtags.filter(h => h !== tag.id)
                                  }))
                                } else {
                                  setEditForm(prev => ({
                                    ...prev,
                                    selected_hashtags: [...prev.selected_hashtags, tag.id]
                                  }))
                                }
                              }}
                            >
                              <Hash className="h-3 w-3 mr-1" />
                              {tag.tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="filming" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Filming Notes</Label>
                        <Textarea
                          placeholder="Camera angles, lighting notes, special requirements..."
                          rows={4}
                          value={editForm.filming_notes}
                          onChange={(e) => setEditForm(prev => ({ ...prev, filming_notes: e.target.value }))}
                        />
                      </div>
                      
                      {selectedIdea.filming_setup && (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Camera className="h-4 w-4" />
                            <span className="font-medium">Setup: {selectedIdea.filming_setup.name}</span>
                          </div>
                          {selectedIdea.filming_setup.description && (
                            <p className="text-sm text-muted-foreground">
                              {selectedIdea.filming_setup.description}
                            </p>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border rounded-xl bg-card">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an idea to start editing</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Filming Dialog */}
        <Dialog open={isScheduleFilmingOpen} onOpenChange={setIsScheduleFilmingOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Filming</DialogTitle>
              <DialogDescription>
                Choose when to film "{selectedIdea?.title}". This will be added to your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Filming Date</Label>
                <Input
                  type="date"
                  value={filmingDate}
                  onChange={(e) => setFilmingDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <Label>Filming Time</Label>
                <Input
                  type="time"
                  value={filmingTime}
                  onChange={(e) => setFilmingTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleFilmingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleFilming} disabled={isLoading}>
                {isLoading ? 'Scheduling...' : 'Schedule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Post Dialog */}
        <Dialog open={isSchedulePostOpen} onOpenChange={setIsSchedulePostOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Post</DialogTitle>
              <DialogDescription>
                Choose when to publish "{selectedIdea?.title}". This will be added to your planner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Post Date</Label>
                <Input
                  type="date"
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <Label>Post Time</Label>
                <Input
                  type="time"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSchedulePostOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedulePost} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? 'Scheduling...' : 'Schedule Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
