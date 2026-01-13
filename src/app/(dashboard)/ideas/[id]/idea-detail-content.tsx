'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  ArrowLeft,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Flag,
  Tag,
  Folder,
  Video,
  Camera,
  ExternalLink,
  Hash,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  CheckCircle2,
  Circle,
  Sparkles,
  Play,
  Send,
  Archive,
  FileEdit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { formatDistanceToNow, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type Idea = Tables<'ideas'> & {
  content_pillar?: { id: string; name: string; color: string } | null
  category?: { id: string; name: string } | null
  content_type?: { id: string; name: string; icon: string } | null
  filming_setup?: { id: string; name: string; description: string | null } | null
  inspiration?: { id: string; source_url: string | null; source_platform: string; notes: string | null } | null
}

type ScriptBlock = Tables<'script_blocks'>
type BrollItem = Tables<'broll_items'>
type Hashtag = Tables<'hashtags'>

type IdeaStatus = 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'

interface IdeaDetailContentProps {
  idea: Idea
  scriptBlocks: ScriptBlock[]
  brollItems: BrollItem[]
  ideaHashtags: { id: string; name: string }[]
  allHashtags: Hashtag[]
  userId: string
}

const statusConfig: Record<IdeaStatus, { 
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  next?: IdeaStatus
}> = {
  draft: { label: 'Draft', icon: FileEdit, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800', next: 'scripted' },
  scripted: { label: 'Scripted', icon: Edit, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', next: 'planned' },
  planned: { label: 'Planned', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', next: 'to_film' },
  to_film: { label: 'To Film', icon: Video, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', next: 'filmed' },
  filmed: { label: 'Filmed', icon: Video, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', next: 'editing' },
  editing: { label: 'Editing', icon: Play, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30', next: 'scheduled' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', next: 'published' },
  published: { label: 'Published', icon: Send, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  archived: { label: 'Archived', icon: Archive, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'High', color: 'bg-red-500' },
  2: { label: 'Medium', color: 'bg-yellow-500' },
  3: { label: 'Low', color: 'bg-gray-500' },
}

export function IdeaDetailContent({ 
  idea: initialIdea,
  scriptBlocks: initialScriptBlocks,
  brollItems: initialBrollItems,
  ideaHashtags,
  allHashtags,
  userId 
}: IdeaDetailContentProps) {
  const [idea, setIdea] = useState(initialIdea)
  const [scriptBlocks, setScriptBlocks] = useState(initialScriptBlocks)
  const [brollItems, setBrollItems] = useState(initialBrollItems)
  const [isScriptExpanded, setIsScriptExpanded] = useState(true)
  const [isBrollExpanded, setIsBrollExpanded] = useState(true)
  const [isAddScriptDialogOpen, setIsAddScriptDialogOpen] = useState(false)
  const [isAddBrollDialogOpen, setIsAddBrollDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scriptMode, setScriptMode] = useState<'simple' | 'blocks'>(
    (idea as any).script_text ? 'simple' : 'blocks'
  )
  const [scriptText, setScriptText] = useState((idea as any).script_text || '')
  const [isSavingScript, setIsSavingScript] = useState(false)
  
  // New block form
  const [newScriptBlock, setNewScriptBlock] = useState({ type: 'hook', content: '', notes: '' })
  const [newBrollItem, setNewBrollItem] = useState({ description: '', source_file: '' })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  const status = statusConfig[idea.status as IdeaStatus]
  const StatusIcon = status.icon
  const priority = priorityConfig[idea.priority as number] || priorityConfig[2]

  const handleStatusChange = async (newStatus: IdeaStatus) => {
    try {
      const updates: any = { status: newStatus }
      
      // Auto-set dates based on status
      if (newStatus === 'filmed' && !idea.filmed_at) {
        updates.filmed_at = new Date().toISOString()
      }
      if (newStatus === 'published' && !idea.published_at) {
        updates.published_at = new Date().toISOString()
      }

      const { error } = await supabaseMutation
        .from('ideas')
        .update(updates)
        .eq('id', idea.id)

      if (error) throw error

      setIdea(prev => ({ ...prev, ...updates }))
      
      toast({
        title: 'Status updated',
        description: `The idea is now "${statusConfig[newStatus].label}".`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to update the status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabaseMutation
        .from('ideas')
        .delete()
        .eq('id', idea.id)

      if (error) throw error

      toast({
        title: 'Idea deleted',
        description: 'The idea has been successfully deleted.',
      })
      
      router.push('/ideas')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete the idea.',
        variant: 'destructive',
      })
    }
  }

  const handleAddScriptBlock = async () => {
    if (!newScriptBlock.content.trim()) {
      toast({
        title: 'Error',
        description: 'Block content is required.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { data, error } = await supabaseMutation
        .from('script_blocks')
        .insert({
          idea_id: idea.id,
          block_type: newScriptBlock.type,
          content: newScriptBlock.content,
          notes: newScriptBlock.notes || null,
          order_index: scriptBlocks.length,
        })
        .select()
        .single()

      if (error) throw error

      setScriptBlocks(prev => [...prev, data as ScriptBlock])
      setNewScriptBlock({ type: 'hook', content: '', notes: '' })
      setIsAddScriptDialogOpen(false)
      
      toast({
        title: 'Block added',
        description: 'The script block has been added.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to add the block.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveScriptText = async () => {
    setIsSavingScript(true)
    try {
      const { error } = await supabaseMutation
        .from('ideas')
        .update({ script_text: scriptText || null })
        .eq('id', idea.id)

      if (error) throw error

      setIdea(prev => ({ ...prev, script_text: scriptText } as any))
      
      toast({
        title: 'Script saved',
        description: 'Your script has been saved.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to save the script.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingScript(false)
    }
  }

  const handleDeleteScriptBlock = async (blockId: string) => {
    try {
      const { error } = await supabaseMutation
        .from('script_blocks')
        .delete()
        .eq('id', blockId)

      if (error) throw error

      setScriptBlocks(prev => prev.filter(b => b.id !== blockId))
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete the block.',
        variant: 'destructive',
      })
    }
  }

  const handleAddBrollItem = async () => {
    if (!newBrollItem.description.trim()) {
      toast({
        title: 'Error',
        description: 'Description is required.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { data, error } = await supabaseMutation
        .from('broll_items')
        .insert({
          idea_id: idea.id,
          description: newBrollItem.description,
          source_file: newBrollItem.source_file || null,
          sort_order: brollItems.length,
        })
        .select()
        .single()

      if (error) throw error

      setBrollItems(prev => [...prev, data as BrollItem])
      setNewBrollItem({ description: '', source_file: '' })
      setIsAddBrollDialogOpen(false)
      
      toast({
        title: 'B-roll added',
        description: 'The B-roll item has been added.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to add B-roll.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleBrollStatus = async (item: BrollItem) => {
    try {
      const newStatus = item.status === 'filmed' ? 'needed' : 'filmed'
      const { error } = await supabaseMutation
        .from('broll_items')
        .update({ status: newStatus })
        .eq('id', item.id)

      if (error) throw error

      setBrollItems(prev => 
        prev.map(b => b.id === item.id ? { ...b, status: newStatus } as BrollItem : b)
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteBrollItem = async (itemId: string) => {
    try {
      const { error } = await supabaseMutation
        .from('broll_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setBrollItems(prev => prev.filter(b => b.id !== itemId))
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete B-roll.',
        variant: 'destructive',
      })
    }
  }

  const blockTypeLabels: Record<string, string> = {
    hook: 'Hook',
    intro: 'Introduction',
    main: 'Main Content',
    point: 'Key Point',
    transition: 'Transition',
    cta: 'Call to Action',
    outro: 'Outro',
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/ideas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={cn("gap-1.5", status.bgColor, status.color)}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </Badge>
              {priority && (
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", priority.color)} />
                  <span className="text-sm text-muted-foreground">{priority.label}</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{idea.title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Created {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: enUS })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {status.next && (
            <Button onClick={() => handleStatusChange(status.next!)}>
              Move to "{statusConfig[status.next].label}"
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/planner">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {Object.entries(statusConfig).map(([key, config]) => {
                if (key === idea.status) return null
                const Icon = config.icon
                return (
                  <DropdownMenuItem 
                    key={key}
                    onClick={() => handleStatusChange(key as IdeaStatus)}
                  >
                    <Icon className={cn("h-4 w-4 mr-2", config.color)} />
                    {config.label}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hook & Concept */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl p-6"
          >
            {idea.hook && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Hook</h3>
                <p className="text-lg font-medium">{idea.hook}</p>
              </div>
            )}
            {idea.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="whitespace-pre-wrap">{idea.description}</p>
              </div>
            )}
            {!idea.hook && !idea.description && (
              <p className="text-muted-foreground text-center py-4">
                No hook or description defined.
              </p>
            )}
          </motion.div>

          {/* Script Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setIsScriptExpanded(!isScriptExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-medium">Script</h2>
                {scriptMode === 'blocks' ? (
                  <Badge variant="secondary">{scriptBlocks.length} blocks</Badge>
                ) : (
                  <Badge variant="secondary">{scriptText.length > 0 ? 'Written' : 'Empty'}</Badge>
                )}
              </div>
              {isScriptExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            <AnimatePresence>
              {isScriptExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-4">
                    {/* Script Mode Tabs */}
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                      <button
                        onClick={() => setScriptMode('simple')}
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          scriptMode === 'simple' 
                            ? "bg-background shadow-sm text-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Simple Script
                      </button>
                      <button
                        onClick={() => setScriptMode('blocks')}
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          scriptMode === 'blocks' 
                            ? "bg-background shadow-sm text-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Script Blocks
                      </button>
                    </div>

                    {scriptMode === 'simple' ? (
                      /* Simple Script Mode */
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your full script here... Include your hook, main points, call to action, etc."
                          rows={12}
                          value={scriptText}
                          onChange={(e) => setScriptText(e.target.value)}
                          className="resize-none font-mono text-sm"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {scriptText.length} characters
                          </span>
                          <Button 
                            onClick={handleSaveScriptText}
                            disabled={isSavingScript}
                            className="gap-2"
                          >
                            {isSavingScript ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Save Script
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Script Blocks Mode */
                      <div className="space-y-3">
                        {scriptBlocks.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">
                            No script blocks yet. Start writing your script.
                          </p>
                        ) : (
                          scriptBlocks.map((block, index) => (
                            <div 
                              key={block.id}
                              className="flex gap-3 group"
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                  {index + 1}
                                </div>
                                {index < scriptBlocks.length - 1 && (
                                  <div className="w-px h-full bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 bg-muted/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {blockTypeLabels[block.block_type] || block.block_type}
                                  </Badge>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteScriptBlock(block.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <p className="whitespace-pre-wrap">{block.content}</p>
                                {block.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    Note: {block.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => setIsAddScriptDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Add Script Block
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* B-Roll Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setIsBrollExpanded(!isBrollExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-primary" />
                <h2 className="font-medium">B-Roll</h2>
                <Badge variant="secondary">{brollItems.length} items</Badge>
              </div>
              {isBrollExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            <AnimatePresence>
              {isBrollExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-2">
                    {brollItems.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No B-roll items yet. List the additional shots needed.
                      </p>
                    ) : (
                      brollItems.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group"
                        >
                          <button
                            onClick={() => handleToggleBrollStatus(item)}
                            className="shrink-0"
                          >
                            {item.status === 'filmed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <span className={cn(
                            "flex-1",
                            item.status === 'filmed' && "line-through text-muted-foreground"
                          )}>
                            {item.description}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteBrollItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => setIsAddBrollDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add B-Roll
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl p-6 space-y-4"
          >
            <h3 className="font-medium">Details</h3>
            
            {idea.content_pillar && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Pillar
                </span>
                <Badge 
                  style={{ 
                    backgroundColor: `${idea.content_pillar.color}20`,
                    color: idea.content_pillar.color,
                  }}
                >
                  {idea.content_pillar.name}
                </Badge>
              </div>
            )}

            {idea.category && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Category
                </span>
                <span className="text-sm font-medium">{idea.category.name}</span>
              </div>
            )}

            {idea.content_type && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Type
                </span>
                <span className="text-sm font-medium">{idea.content_type.name}</span>
              </div>
            )}

            {idea.filming_setup && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Setup
                </span>
                <span className="text-sm font-medium">{idea.filming_setup.name}</span>
              </div>
            )}

            <Separator />

            {/* Hashtags */}
            {ideaHashtags.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4" />
                  Hashtags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ideaHashtags.map(h => (
                    <Badge key={h.id} variant="outline" className="text-xs">
                      #{h.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* More Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-xl p-6 space-y-4"
          >
            {idea.filming_notes && (
              <div>
                <span className="text-sm text-muted-foreground">Filming Notes</span>
                <p className="mt-1 text-sm">{idea.filming_notes}</p>
              </div>
            )}

            {idea.cta && (
              <div>
                <span className="text-sm text-muted-foreground">Call to Action</span>
                <p className="mt-1 text-sm">{idea.cta}</p>
              </div>
            )}
          </motion.div>

          {/* Inspiration Source */}
          {idea.inspiration && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Inspiration source</h3>
              </div>
              {idea.inspiration.notes && (
                <p className="text-sm text-muted-foreground mb-2">
                  {idea.inspiration.notes}
                </p>
              )}
              {idea.inspiration.source_url && (
                <a
                  href={idea.inspiration.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voir la source
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Script Block Dialog */}
      <Dialog open={isAddScriptDialogOpen} onOpenChange={setIsAddScriptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Script Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Block Type</Label>
              <Select 
                value={newScriptBlock.type} 
                onValueChange={(v) => setNewScriptBlock(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hook">Hook</SelectItem>
                  <SelectItem value="intro">Introduction</SelectItem>
                  <SelectItem value="main">Main Content</SelectItem>
                  <SelectItem value="point">Key Point</SelectItem>
                  <SelectItem value="transition">Transition</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write the content for this block..."
                rows={4}
                value={newScriptBlock.content}
                onChange={(e) => setNewScriptBlock(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Notes for filming..."
                value={newScriptBlock.notes}
                onChange={(e) => setNewScriptBlock(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddScriptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddScriptBlock}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add B-Roll Dialog */}
      <Dialog open={isAddBrollDialogOpen} onOpenChange={setIsAddBrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add B-Roll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the B-roll shot needed..."
                rows={3}
                value={newBrollItem.description}
                onChange={(e) => setNewBrollItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Source file (optional)</Label>
              <Input
                placeholder="File path or URL..."
                value={newBrollItem.source_file}
                onChange={(e) => setNewBrollItem(prev => ({ ...prev, source_file: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrollItem}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Idea</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this idea? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
