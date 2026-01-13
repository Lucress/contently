'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Settings,
  User,
  Palette,
  FolderTree,
  Video,
  Hash,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Save,
  Camera,
  LogOut,
  Check,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { cn } from '@/lib/utils'

type Profile = Tables<'profiles'>
type Pillar = Tables<'content_pillars'>
type Category = Tables<'categories'> & {
  pillar?: { id: string; name: string; color: string } | null
}
type ContentType = Tables<'content_types'>
type FilmingSetup = Tables<'filming_setups'>
type HashtagGroup = Tables<'hashtag_groups'>
type Subscription = Tables<'subscriptions'>

interface SettingsContentProps {
  profile: Profile | null
  pillars: Pillar[]
  categories: Category[]
  contentTypes: ContentType[]
  filmingSetups: FilmingSetup[]
  hashtags: HashtagGroup[]
  subscription: Subscription | null
  userId: string
  userEmail: string
}

const presetColors = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', 
  '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6',
  '#D946EF', '#EC4899', '#6B7280', '#1F2937'
]

export function SettingsContent({ 
  profile: initialProfile,
  pillars: initialPillars,
  categories: initialCategories,
  contentTypes: initialContentTypes,
  filmingSetups: initialSetups,
  hashtags: initialHashtags,
  subscription,
  userId,
  userEmail 
}: SettingsContentProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [pillars, setPillars] = useState(initialPillars)
  const [categories, setCategories] = useState(initialCategories)
  const [contentTypes, setContentTypes] = useState(initialContentTypes)
  const [filmingSetups, setFilmingSetups] = useState(initialSetups)
  const [hashtags, setHashtags] = useState(initialHashtags)
  
  const [activeTab, setActiveTab] = useState('profile')
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    timezone: profile?.timezone || 'Europe/Paris',
  })
  
  // Dialog states
  const [isPillarDialogOpen, setIsPillarDialogOpen] = useState(false)
  const [editingPillar, setEditingPillar] = useState<Pillar | null>(null)
  const [pillarForm, setPillarForm] = useState({ name: '', color: '#3B82F6', description: '' })
  
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', pillar_id: '', description: '' })
  
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ContentType | null>(null)
  const [typeForm, setTypeForm] = useState({ name: '', icon: '', estimated_filming_minutes: '' })
  
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false)
  const [editingSetup, setEditingSetup] = useState<FilmingSetup | null>(null)
  const [setupForm, setSetupForm] = useState({ name: '', description: '', location: '' })
  
  const [isHashtagDialogOpen, setIsHashtagDialogOpen] = useState(false)
  const [editingHashtag, setEditingHashtag] = useState<HashtagGroup | null>(null)
  const [hashtagForm, setHashtagForm] = useState({ name: '', description: '' })
  
  const [deleteDialog, setDeleteDialog] = useState<{ type: string; item: any } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Profile handlers
  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabaseMutation
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          timezone: profileForm.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error
      
      setProfile(prev => prev ? { ...prev, ...profileForm } : null)
      toast({ title: 'Profile updated' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', description: 'Unable to save profile.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Pillar handlers
  const openPillarDialog = (pillar?: Pillar) => {
    if (pillar) {
      setEditingPillar(pillar)
      setPillarForm({ name: pillar.name, color: pillar.color, description: pillar.description || '' })
    } else {
      setEditingPillar(null)
      setPillarForm({ name: '', color: '#3B82F6', description: '' })
    }
    setIsPillarDialogOpen(true)
  }

  const handleSavePillar = async () => {
    if (!pillarForm.name) return
    setIsLoading(true)
    try {
      if (editingPillar) {
        const { data, error } = await supabaseMutation
          .from('content_pillars')
          .update(pillarForm)
          .eq('id', editingPillar.id)
          .select()
          .single()
        if (error) throw error
        setPillars(prev => prev.map(p => p.id === editingPillar.id ? data : p))
      } else {
        const { data, error } = await supabaseMutation
          .from('content_pillars')
          .insert({ ...pillarForm, user_id: userId })
          .select()
          .single()
        if (error) throw error
        setPillars(prev => [...prev, data])
      }
      setIsPillarDialogOpen(false)
      toast({ title: editingPillar ? 'Pillar updated' : 'Pillar created' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Category handlers
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({ 
        name: category.name, 
        pillar_id: category.pillar_id || '', 
        description: category.description || '' 
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({ name: '', pillar_id: '', description: '' })
    }
    setIsCategoryDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name) return
    setIsLoading(true)
    try {
      const data = {
        name: categoryForm.name,
        pillar_id: categoryForm.pillar_id || null,
        description: categoryForm.description || null,
      }
      if (editingCategory) {
        const { data: updated, error } = await supabaseMutation
          .from('categories')
          .update(data)
          .eq('id', editingCategory.id)
          .select('*, pillar:content_pillars(id, name, color)')
          .single()
        if (error) throw error
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c))
      } else {
        const { data: created, error } = await supabaseMutation
          .from('categories')
          .insert({ ...data, user_id: userId })
          .select('*, pillar:content_pillars(id, name, color)')
          .single()
        if (error) throw error
        setCategories(prev => [...prev, created])
      }
      setIsCategoryDialogOpen(false)
      toast({ title: editingCategory ? 'Category updated' : 'Category created' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Content Type handlers
  const openTypeDialog = (type?: ContentType) => {
    if (type) {
      setEditingType(type)
      setTypeForm({ 
        name: type.name, 
        icon: type.icon || '', 
        estimated_filming_minutes: type.estimated_filming_minutes?.toString() || '' 
      })
    } else {
      setEditingType(null)
      setTypeForm({ name: '', icon: '', estimated_filming_minutes: '' })
    }
    setIsTypeDialogOpen(true)
  }

  const handleSaveType = async () => {
    if (!typeForm.name) return
    setIsLoading(true)
    try {
      const data = {
        name: typeForm.name,
        icon: typeForm.icon || '',
        estimated_filming_minutes: typeForm.estimated_filming_minutes ? parseInt(typeForm.estimated_filming_minutes) : 30,
      }
      if (editingType) {
        const { data: updated, error } = await supabaseMutation
          .from('content_types')
          .update(data)
          .eq('id', editingType.id)
          .select()
          .single()
        if (error) throw error
        setContentTypes(prev => prev.map(t => t.id === editingType.id ? updated : t))
      } else {
        const { data: created, error } = await supabaseMutation
          .from('content_types')
          .insert({ ...data, user_id: userId })
          .select()
          .single()
        if (error) throw error
        setContentTypes(prev => [...prev, created])
      }
      setIsTypeDialogOpen(false)
      toast({ title: editingType ? 'Type updated' : 'Type created' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Filming Setup handlers
  const openSetupDialog = (setup?: FilmingSetup) => {
    if (setup) {
      setEditingSetup(setup)
      setSetupForm({ 
        name: setup.name, 
        description: setup.description || '', 
        location: setup.location || '' 
      })
    } else {
      setEditingSetup(null)
      setSetupForm({ name: '', description: '', location: '' })
    }
    setIsSetupDialogOpen(true)
  }

  const handleSaveSetup = async () => {
    if (!setupForm.name) return
    setIsLoading(true)
    try {
      const data = {
        name: setupForm.name,
        description: setupForm.description || null,
        location: setupForm.location || null,
      }
      if (editingSetup) {
        const { data: updated, error } = await supabaseMutation
          .from('filming_setups')
          .update(data)
          .eq('id', editingSetup.id)
          .select()
          .single()
        if (error) throw error
        setFilmingSetups(prev => prev.map(s => s.id === editingSetup.id ? updated : s))
      } else {
        const { data: created, error } = await supabaseMutation
          .from('filming_setups')
          .insert({ ...data, user_id: userId })
          .select()
          .single()
        if (error) throw error
        setFilmingSetups(prev => [...prev, created])
      }
      setIsSetupDialogOpen(false)
      toast({ title: editingSetup ? 'Setup updated' : 'Setup created' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Hashtag handlers
  const openHashtagDialog = (hashtag?: HashtagGroup) => {
    if (hashtag) {
      setEditingHashtag(hashtag)
      setHashtagForm({ 
        name: hashtag.name, 
        description: hashtag.description || '' 
      })
    } else {
      setEditingHashtag(null)
      setHashtagForm({ name: '', description: '' })
    }
    setIsHashtagDialogOpen(true)
  }

  const handleSaveHashtag = async () => {
    if (!hashtagForm.name) return
    setIsLoading(true)
    try {
      const data = {
        name: hashtagForm.name,
        description: hashtagForm.description || null,
      }
      if (editingHashtag) {
        const { data: updated, error } = await supabaseMutation
          .from('hashtag_groups')
          .update(data)
          .eq('id', editingHashtag.id)
          .select()
          .single()
        if (error) throw error
        setHashtags(prev => prev.map(h => h.id === editingHashtag.id ? updated : h))
      } else {
        const { data: created, error } = await supabaseMutation
          .from('hashtag_groups')
          .insert({ ...data, user_id: userId })
          .select()
          .single()
        if (error) throw error
        setHashtags(prev => [...prev, created])
      }
      setIsHashtagDialogOpen(false)
      toast({ title: editingHashtag ? 'Group updated' : 'Group created' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete handler
  const handleDelete = async () => {
    if (!deleteDialog) return
    setIsLoading(true)
    try {
      const { type, item } = deleteDialog
      let table = ''
      let setter: any = null
      
      switch (type) {
        case 'pillar':
          table = 'content_pillars'
          setter = setPillars
          break
        case 'category':
          table = 'categories'
          setter = setCategories
          break
        case 'type':
          table = 'content_types'
          setter = setContentTypes
          break
        case 'setup':
          table = 'filming_setups'
          setter = setFilmingSetups
          break
        case 'hashtag':
          table = 'hashtag_groups'
          setter = setHashtags
          break
      }
      
      const { error } = await supabaseMutation.from(table).delete().eq('id', item.id)
      if (error) throw error
      
      setter((prev: any[]) => prev.filter((i: any) => i.id !== item.id))
      toast({ title: 'Deleted' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
      setDeleteDialog(null)
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre profil et personnalisez votre espace
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full max-w-2xl">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="pillars" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Piliers</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">Catégories</span>
          </TabsTrigger>
          <TabsTrigger value="setups" className="gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Setups</span>
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="gap-2">
            <Hash className="h-4 w-4" />
            <span className="hidden sm:inline">Hashtags</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Abo</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl p-6 space-y-6"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-1 -right-1 rounded-full h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{profile?.full_name || 'Créateur'}</h3>
                <p className="text-muted-foreground">{userEmail}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={profileForm.timezone}
                  onValueChange={(v) => setProfileForm(prev => ({ ...prev, timezone: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Pillars Tab */}
        <TabsContent value="pillars" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">Piliers de contenu</h3>
                <p className="text-sm text-muted-foreground">
                  Les thématiques principales de votre contenu
                </p>
              </div>
              <Button onClick={() => openPillarDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="divide-y">
              {pillars.map(pillar => (
                <div key={pillar.id} className="p-4 flex items-center gap-4 hover:bg-muted/50">
                  <div 
                    className="w-4 h-4 rounded-full shrink-0" 
                    style={{ backgroundColor: pillar.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{pillar.name}</p>
                    {pillar.description && (
                      <p className="text-sm text-muted-foreground truncate">{pillar.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openPillarDialog(pillar)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setDeleteDialog({ type: 'pillar', item: pillar })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pillars.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Aucun pilier créé. Commencez par en ajouter un !
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">Catégories</h3>
                <p className="text-sm text-muted-foreground">
                  Sous-divisions de vos piliers
                </p>
              </div>
              <Button onClick={() => openCategoryDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="divide-y">
              {categories.map(category => (
                <div key={category.id} className="p-4 flex items-center gap-4 hover:bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{category.name}</p>
                    {category.pillar && (
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${category.pillar.color}20`,
                          color: category.pillar.color 
                        }}
                      >
                        {category.pillar.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openCategoryDialog(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setDeleteDialog({ type: 'category', item: category })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune catégorie créée.
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">Types de contenu</h3>
                <p className="text-sm text-muted-foreground">
                  Formats de vos créations (Short, Vlog, etc.)
                </p>
              </div>
              <Button onClick={() => openTypeDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="divide-y">
              {contentTypes.map(type => (
                <div key={type.id} className="p-4 flex items-center gap-4 hover:bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{type.name}</p>
                    {type.estimated_filming_minutes && (
                      <p className="text-sm text-muted-foreground">
                        ~{type.estimated_filming_minutes} min
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openTypeDialog(type)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setDeleteDialog({ type: 'type', item: type })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {contentTypes.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No types created.
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Setups Tab */}
        <TabsContent value="setups" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">Setups de tournage</h3>
                <p className="text-sm text-muted-foreground">
                  Configurations d'équipement prédéfinies
                </p>
              </div>
              <Button onClick={() => openSetupDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="divide-y">
              {filmingSetups.map(setup => (
                <div key={setup.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setup.name}</p>
                      {setup.description && (
                        <p className="text-sm text-muted-foreground">{setup.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openSetupDialog(setup)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-600"
                        onClick={() => setDeleteDialog({ type: 'setup', item: setup })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {setup.location && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary">{setup.location}</Badge>
                    </div>
                  )}
                </div>
              ))}
              {filmingSetups.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No setups created.
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Hashtags Tab */}
        <TabsContent value="hashtags" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">Hashtag Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Reusable hashtag collections
                </p>
              </div>
              <Button onClick={() => openHashtagDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="divide-y">
              {hashtags.map(group => (
                <div key={group.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{group.name}</p>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openHashtagDialog(group)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-600"
                        onClick={() => setDeleteDialog({ type: 'hashtag', item: group })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {group.description && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{group.description}</Badge>
                    </div>
                  )}
                </div>
              ))}
              {hashtags.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No groups created.
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Current Plan</h3>
                <p className="text-muted-foreground">
                  {subscription ? `Plan ${subscription.plan}` : 'Free Plan'}
                </p>
              </div>
              <Badge variant={subscription ? "default" : "secondary"} className="text-lg px-4 py-1">
                {subscription?.plan === 'creator_plus' ? 'Creator+' : subscription?.plan === 'pro' ? 'Pro' : 'Free'}
              </Badge>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "bg-card border rounded-xl p-6",
                !subscription && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Free</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">€0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  5 idées max
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  3 piliers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Calendrier basique
                </li>
              </ul>
              {!subscription && (
                <Badge variant="outline" className="w-full justify-center py-2">
                  Plan actuel
                </Badge>
              )}
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={cn(
                "bg-card border rounded-xl p-6",
                subscription?.plan === 'pro' && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Pro</h3>
                <Badge className="bg-yellow-500">Populaire</Badge>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">19€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Idées illimitées
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Piliers illimités
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  CRM Marques
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Revenus & Analytics
                </li>
              </ul>
              {subscription?.plan === 'pro' ? (
                <Badge variant="outline" className="w-full justify-center py-2">
                  Plan actuel
                </Badge>
              ) : (
                <Button className="w-full">Passer à Pro</Button>
              )}
            </motion.div>

            {/* Creator+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6",
                subscription?.plan === 'creator_plus' && "ring-2 ring-purple-500"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Creator+</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">49€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Tout de Pro
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Email Hub intégré
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  IA Assistant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Support prioritaire
                </li>
              </ul>
              {subscription?.plan === 'creator_plus' ? (
                <Badge variant="outline" className="w-full justify-center py-2 border-purple-500 text-purple-500">
                  Plan actuel
                </Badge>
              ) : (
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Passer à Creator+
                </Button>
              )}
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pillar Dialog */}
      <Dialog open={isPillarDialogOpen} onOpenChange={setIsPillarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPillar ? 'Modifier le pilier' : 'Nouveau pilier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={pillarForm.name}
                onChange={(e) => setPillarForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Tech & Gadgets"
              />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      pillarForm.color === color && "ring-2 ring-offset-2 ring-primary scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setPillarForm(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={pillarForm.description}
                onChange={(e) => setPillarForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du pilier..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPillarDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSavePillar} disabled={isLoading}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Smartphones"
              />
            </div>
            <div className="space-y-2">
              <Label>Pilier parent</Label>
              <Select 
                value={categoryForm.pillar_id} 
                onValueChange={(v) => setCategoryForm(prev => ({ ...prev, pillar_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {pillars.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingType ? 'Edit Content Type' : 'New Content Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={typeForm.name}
                onChange={(e) => setTypeForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: YouTube Short"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated filming time (minutes)</Label>
              <Input
                type="number"
                value={typeForm.estimated_filming_minutes}
                onChange={(e) => setTypeForm(prev => ({ ...prev, estimated_filming_minutes: e.target.value }))}
                placeholder="Ex: 10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTypeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveType} disabled={isLoading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setup Dialog */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSetup ? 'Edit Filming Setup' : 'New Filming Setup'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={setupForm.name}
                onChange={(e) => setSetupForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Main Studio"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={setupForm.description}
                onChange={(e) => setSetupForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Setup description..."
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={setupForm.location}
                onChange={(e) => setSetupForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Main studio, Home office"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSetup} disabled={isLoading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hashtag Dialog */}
      <Dialog open={isHashtagDialogOpen} onOpenChange={setIsHashtagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHashtag ? 'Edit Hashtag Group' : 'New Hashtag Group'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Group Name *</Label>
              <Input
                value={hashtagForm.name}
                onChange={(e) => setHashtagForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Tech General"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={hashtagForm.description}
                onChange={(e) => setHashtagForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of this hashtag group..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHashtagDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveHashtag} disabled={isLoading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The item will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
