'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createUntypedClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Save, 
  Lightbulb,
  Sparkles,
  Tag,
  Folder,
  Video,
  Hash,
  Camera,
  Clock,
  Flag,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  Plus,
  X,
  FileEdit,
  Edit,
  Calendar,
  Play,
  Send,
  Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ContentPillar = Tables<'content_pillars'>
type Category = Tables<'categories'>
type ContentType = Tables<'content_types'>
type Hashtag = Tables<'hashtags'>
type FilmingSetup = Tables<'filming_setups'>

type IdeaStatus = 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'

const statusConfig: Record<IdeaStatus, { 
  label: string
  icon: React.ElementType
  color: string
}> = {
  draft: { label: 'Draft', icon: FileEdit, color: 'text-gray-600' },
  scripted: { label: 'Scripted', icon: Edit, color: 'text-blue-600' },
  planned: { label: 'Planned', icon: Calendar, color: 'text-purple-600' },
  to_film: { label: 'To Film', icon: Video, color: 'text-yellow-600' },
  filmed: { label: 'Filmed', icon: Video, color: 'text-orange-600' },
  editing: { label: 'Editing', icon: Play, color: 'text-pink-600' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'text-indigo-600' },
  published: { label: 'Published', icon: Send, color: 'text-green-600' },
  archived: { label: 'Archived', icon: Archive, color: 'text-gray-500' },
}

interface NewIdeaFormProps {
  pillars: ContentPillar[]
  categories: Category[]
  contentTypes: ContentType[]
  hashtags: Hashtag[]
  filmingSetups: FilmingSetup[]
  userId: string
}

export function NewIdeaForm({ 
  pillars, 
  categories, 
  contentTypes,
  hashtags,
  filmingSetups,
  userId 
}: NewIdeaFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createUntypedClient()

  // Get data from inspiration if coming from one
  const fromInspiration = searchParams.get('from_inspiration')
  const initialNotes = searchParams.get('notes') || ''
  const initialSourceUrl = searchParams.get('source_url') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  // Form state - Aligned with actual database schema
  const [formData, setFormData] = useState({
    title: '',
    hook: '',
    description: initialNotes,
    cta: '',
    pillar_id: '',
    category_id: '',
    content_type_id: '',
    filming_setup_id: '',
    filming_notes: '',
    priority: 2, // 1=high, 2=medium, 3=low
    status: 'draft' as IdeaStatus,
    selected_hashtags: [] as string[],
    platforms: [] as string[],
  })

  const [newLink, setNewLink] = useState('')

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleHashtag = (hashtagId: string) => {
    if (formData.selected_hashtags.includes(hashtagId)) {
      updateField('selected_hashtags', formData.selected_hashtags.filter(h => h !== hashtagId))
    } else {
      updateField('selected_hashtags', [...formData.selected_hashtags, hashtagId])
    }
  }

  const togglePlatform = (platform: string) => {
    if (formData.platforms.includes(platform)) {
      updateField('platforms', formData.platforms.filter(p => p !== platform))
    } else {
      updateField('platforms', [...formData.platforms, platform])
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const ideaData = {
        user_id: userId,
        title: formData.title,
        hook: formData.hook || null,
        description: formData.description || null,
        cta: formData.cta || null,
        pillar_id: formData.pillar_id || null,
        category_id: formData.category_id || null,
        content_type_id: formData.content_type_id || null,
        filming_setup_id: formData.filming_setup_id || null,
        filming_notes: formData.filming_notes || null,
        priority: formData.priority,
        platforms: formData.platforms.length > 0 ? formData.platforms : null,
        status: formData.status,
        inspiration_id: fromInspiration || null,
      }
      
      const { data: idea, error } = await supabase
        .from('ideas')
        .insert(ideaData)
        .select()
        .single()

      if (error) throw error

      // If inspiration was used, mark it as processed
      if (fromInspiration) {
        await supabase
          .from('inspirations')
          .update({ is_processed: true })
          .eq('id', fromInspiration)
      }

      // Link hashtags
      if (formData.selected_hashtags.length > 0 && idea) {
        const hashtagLinks = formData.selected_hashtags.map(hashtagId => ({
          idea_id: idea.id,
          hashtag_id: hashtagId,
        }))
        await supabase
          .from('idea_hashtags')
          .insert(hashtagLinks)
      }

      toast({
        title: 'Idea Created',
        description: 'Your idea has been created successfully.',
      })

      router.push(`/ideas/${idea.id}`)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to create the idea.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/ideas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New Idea</h1>
            {fromInspiration && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Sparkles className="h-3.5 w-3.5" />
                Créée depuis une inspiration
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Creating...' : 'Create Idea'}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="bg-transparent h-14 gap-4">
                <TabsTrigger 
                  value="basic" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Essentials
                </TabsTrigger>
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="organization"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Organization
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Basic Tab */}
              <TabsContent value="basic" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="E.g., How I generated 10K in 30 days"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hook">Hook</Label>
                  <Textarea
                    id="hook"
                    placeholder="The hook that captures attention in the first 3 seconds..."
                    rows={2}
                    value={formData.hook}
                    onChange={(e) => updateField('hook', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your content idea..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta">Call to Action (CTA)</Label>
                  <Input
                    id="cta"
                    placeholder="E.g., Link in bio, Subscribe, Comment..."
                    value={formData.cta}
                    onChange={(e) => updateField('cta', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(v) => updateField('status', v as IdeaStatus)}
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

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority.toString()} 
                      onValueChange={(v) => updateField('priority', parseInt(v))}
                    >
                      <SelectTrigger>
                        <Flag className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            High
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                            Low
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {['tiktok', 'instagram_reels', 'youtube_shorts', 'youtube', 'linkedin', 'twitter'].map((platform) => (
                      <Badge
                        key={platform}
                        variant={formData.platforms.includes(platform) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => togglePlatform(platform)}
                      >
                        {platform.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filming_notes">Filming Notes</Label>
                  <Textarea
                    id="filming_notes"
                    placeholder="Notes for filming day..."
                    rows={4}
                    value={formData.filming_notes}
                    onChange={(e) => updateField('filming_notes', e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Organization Tab */}
              <TabsContent value="organization" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Pillar</Label>
                    <Select 
                      value={formData.pillar_id} 
                      onValueChange={(v) => updateField('pillar_id', v)}
                    >
                      <SelectTrigger>
                        <Tag className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
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
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(v) => updateField('category_id', v)}
                    >
                      <SelectTrigger>
                        <Folder className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select 
                      value={formData.content_type_id} 
                      onValueChange={(v) => updateField('content_type_id', v)}
                    >
                      <SelectTrigger>
                        <Video className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {contentTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filming Setup</Label>
                    <Select 
                      value={formData.filming_setup_id} 
                      onValueChange={(v) => updateField('filming_setup_id', v)}
                    >
                      <SelectTrigger>
                        <Camera className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {filmingSetups.map(setup => (
                          <SelectItem key={setup.id} value={setup.id}>{setup.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-3">
                  <Label>Hashtags</Label>
                  {hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map(hashtag => {
                        const isSelected = formData.selected_hashtags.includes(hashtag.id)
                        return (
                          <Badge
                            key={hashtag.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              "cursor-pointer transition-colors",
                              isSelected && "bg-primary"
                            )}
                            onClick={() => toggleHashtag(hashtag.id)}
                          >
                            <Hash className="h-3 w-3 mr-1" />
                            {hashtag.tag}
                          </Badge>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hashtags configured. 
                      <Link href="/settings/hashtags" className="text-primary hover:underline ml-1">
                        Add hashtags
                      </Link>
                    </p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
