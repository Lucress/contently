'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { 
  Building2,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  DollarSign,
  Calendar,
  ArrowRight,
  Filter,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  FileText,
  Handshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type Brand = Tables<'brands'> & {
  deals?: { count: number }[]
}

type Deal = Tables<'deals'> & {
  brand?: { id: string; name: string; logo_url: string | null } | null
}

type DealStatus = 'lead' | 'contacted' | 'negotiating' | 'proposal_sent' | 'accepted' | 'in_progress' | 'delivered' | 'invoiced' | 'paid' | 'completed' | 'lost' | 'cancelled'

interface CRMContentProps {
  brands: Brand[]
  deals: Deal[]
  userId: string
}

const dealStatusConfig: Record<string, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  lead: { label: 'Lead', icon: Users, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  contacted: { label: 'Contacted', icon: Send, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  negotiating: { label: 'Negotiating', icon: Handshake, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  proposal_sent: { label: 'Proposal Sent', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  accepted: { label: 'Accepted', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  lost: { label: 'Lost', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

const pipelineStages: DealStatus[] = ['lead', 'contacted', 'negotiating', 'proposal_sent', 'accepted', 'completed']

export function CRMContent({ 
  brands: initialBrands, 
  deals: initialDeals,
  userId 
}: CRMContentProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [deals, setDeals] = useState(initialDeals)
  const [activeTab, setActiveTab] = useState('pipeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Brand Dialog
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [brandForm, setBrandForm] = useState({
    name: '',
    website: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
  })

  // Deal Dialog
  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [dealForm, setDealForm] = useState({
    brand_id: '',
    title: '',
    amount: '',
    currency: 'EUR',
    status: 'lead' as DealStatus,
    deliverables: '',
    deadline: '',
    notes: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Stats
  const stats = useMemo(() => {
    const activeDeals = deals.filter(d => !['completed', 'lost', 'cancelled'].includes(d.status))
    const wonDeals = deals.filter(d => d.status === 'completed' || d.status === 'paid')
    const totalPipeline = activeDeals.reduce((sum, d) => sum + ((d as any).value || 0), 0)
    const totalWon = wonDeals.reduce((sum, d) => sum + ((d as any).value || 0), 0)
    
    return {
      totalBrands: brands.length,
      activeDeals: activeDeals.length,
      totalPipeline,
      totalWon,
    }
  }, [brands, deals])

  // Group deals by status for pipeline view
  const dealsByStatus = useMemo(() => {
    const grouped: Record<string, Deal[]> = {}
    pipelineStages.forEach(status => {
      grouped[status] = deals.filter(d => d.status === status)
    })
    return grouped
  }, [deals])

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || deal.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const resetBrandForm = () => {
    setBrandForm({
      name: '',
      website: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      notes: '',
    })
    setEditingBrand(null)
  }

  const resetDealForm = () => {
    setDealForm({
      brand_id: '',
      title: '',
      amount: '',
      currency: 'EUR',
      status: 'lead',
      deliverables: '',
      deadline: '',
      notes: '',
    })
    setEditingDeal(null)
  }

  const openBrandDialog = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand)
      setBrandForm({
        name: brand.name,
        website: brand.website || '',
        contact_name: brand.contact_name || '',
        contact_email: brand.contact_email || '',
        contact_phone: brand.contact_phone || '',
        notes: brand.notes || '',
      })
    } else {
      resetBrandForm()
    }
    setIsBrandDialogOpen(true)
  }

  const openDealDialog = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal)
      setDealForm({
        brand_id: deal.brand_id || '',
        title: deal.title,
        amount: (deal as any).value?.toString() || '',
        currency: deal.currency,
        status: deal.status as DealStatus,
        deliverables: typeof deal.deliverables === 'string' ? deal.deliverables : '',
        deadline: deal.deadline || '',
        notes: deal.notes || '',
      })
    } else {
      resetDealForm()
    }
    setIsDealDialogOpen(true)
  }

  const handleSaveBrand = async () => {
    if (!brandForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Brand name is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      if (editingBrand) {
        const { data, error } = await supabaseMutation
          .from('brands')
          .update({
            name: brandForm.name,
            website: brandForm.website || null,
            contact_name: brandForm.contact_name || null,
            contact_email: brandForm.contact_email || null,
            contact_phone: brandForm.contact_phone || null,
            notes: brandForm.notes || null,
          })
          .eq('id', editingBrand.id)
          .select()
          .single()

        if (error) throw error

        setBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...b, ...(data as Brand) } : b))
        toast({ title: 'Brand updated' })
      } else {
        const { data, error } = await supabaseMutation
          .from('brands')
          .insert({
            user_id: userId,
            name: brandForm.name,
            website: brandForm.website || null,
            contact_name: brandForm.contact_name || null,
            contact_email: brandForm.contact_email || null,
            contact_phone: brandForm.contact_phone || null,
            notes: brandForm.notes || null,
          })
          .select()
          .single()

        if (error) throw error

        setBrands(prev => [...prev, data as Brand])
        toast({ title: 'Brand added' })
      }

      setIsBrandDialogOpen(false)
      resetBrandForm()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to save the brand.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDeal = async () => {
    if (!dealForm.title.trim()) {
      toast({
        title: 'Error',
        description: 'Deal title is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const dealData = {
        title: dealForm.title,
        brand_id: dealForm.brand_id || null,
        value: dealForm.amount ? parseFloat(dealForm.amount) : null,
        currency: dealForm.currency,
        status: dealForm.status,
        deliverables: dealForm.deliverables || null,
        deadline: dealForm.deadline || null,
        notes: dealForm.notes || null,
      }

      if (editingDeal) {
        const { data, error } = await supabaseMutation
          .from('deals')
          .update(dealData)
          .eq('id', editingDeal.id)
          .select(`*, brand:brands(id, name, logo_url)`)
          .single()

        if (error) throw error

        setDeals(prev => prev.map(d => d.id === editingDeal.id ? (data as Deal) : d))
        toast({ title: 'Deal updated' })
      } else {
        const { data, error } = await supabaseMutation
          .from('deals')
          .insert({ ...dealData, user_id: userId })
          .select(`*, brand:brands(id, name, logo_url)`)
          .single()

        if (error) throw error

        setDeals(prev => [(data as Deal), ...prev])
        toast({ title: 'Deal created' })
      }

      setIsDealDialogOpen(false)
      resetDealForm()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to save the deal.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBrand = async (brand: Brand) => {
    try {
      const { error } = await supabaseMutation
        .from('brands')
        .delete()
        .eq('id', brand.id)

      if (error) throw error

      setBrands(prev => prev.filter(b => b.id !== brand.id))
      toast({ title: 'Brand deleted' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la marque.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteDeal = async (deal: Deal) => {
    try {
      const { error } = await supabaseMutation
        .from('deals')
        .delete()
        .eq('id', deal.id)

      if (error) throw error

      setDeals(prev => prev.filter(d => d.id !== deal.id))
      toast({ title: 'Deal deleted' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete deal.',
        variant: 'destructive',
      })
    }
  }

  const handleDealStatusChange = async (deal: Deal, newStatus: DealStatus) => {
    try {
      const { error } = await supabaseMutation
        .from('deals')
        .update({ status: newStatus })
        .eq('id', deal.id)

      if (error) throw error

      setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, status: newStatus } : d))
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to update status.',
        variant: 'destructive',
      })
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos partenariats et opportunités
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openBrandDialog()}>
            <Building2 className="h-4 w-4 mr-2" />
            Nouvelle marque
          </Button>
          <Button onClick={() => openDealDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau deal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">Marques</span>
          </div>
          <p className="text-2xl font-semibold">{stats.totalBrands}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm">Deals actifs</span>
          </div>
          <p className="text-2xl font-semibold">{stats.activeDeals}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Pipeline</span>
          </div>
          <p className="text-2xl font-semibold text-blue-600">
            {formatCurrency(stats.totalPipeline, 'EUR')}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Gagné</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {formatCurrency(stats.totalWon, 'EUR')}
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Tous les deals</TabsTrigger>
          <TabsTrigger value="brands">Marques</TabsTrigger>
        </TabsList>

        {/* Pipeline View */}
        <TabsContent value="pipeline" className="mt-6">
          <div className="grid grid-cols-5 gap-4 overflow-x-auto">
            {pipelineStages.map((status) => {
              const config = dealStatusConfig[status]
              const StatusIcon = config.icon
              const stageDeals = dealsByStatus[status] || []
              const stageTotal = stageDeals.reduce((sum, d) => sum + ((d as any).value || 0), 0)

              return (
                <div key={status} className="min-w-[250px]">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={cn("h-4 w-4", config.color)} />
                      <span className="font-medium">{config.label}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {stageDeals.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(stageTotal, 'EUR')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {stageDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openDealDialog(deal)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                openDealDialog(deal)
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {pipelineStages.filter(s => s !== deal.status).map(s => (
                                <DropdownMenuItem 
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDealStatusChange(deal, s)
                                  }}
                                >
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  {dealStatusConfig[s].label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteDeal(deal)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {deal.brand && (
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={deal.brand.logo_url || ''} />
                              <AvatarFallback className="text-xs">
                                {deal.brand.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate">
                              {deal.brand.name}
                            </span>
                          </div>
                        )}
                        
                        {(deal as any).value && (
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency((deal as any).value, deal.currency)}
                          </p>
                        )}
                        
                        {deal.deadline && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(deal.deadline), 'd MMM', { locale: fr })}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* All Deals View */}
        <TabsContent value="deals" className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un deal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(dealStatusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filteredDeals.map((deal) => {
              const config = dealStatusConfig[deal.status as DealStatus]
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border rounded-lg p-4 flex items-center gap-4"
                >
                  <Badge className={cn("gap-1 shrink-0", config.bgColor, config.color)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {config.label}
                  </Badge>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{deal.title}</h4>
                    {deal.brand && (
                      <p className="text-sm text-muted-foreground">{deal.brand.name}</p>
                    )}
                  </div>

                  {(deal as any).value && (
                    <p className="font-semibold text-primary shrink-0">
                      {formatCurrency((deal as any).value, deal.currency)}
                    </p>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDealDialog(deal)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteDeal(deal)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Brands View */}
        <TabsContent value="brands" className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une marque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((brand) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={brand.logo_url || ''} />
                    <AvatarFallback className="text-lg">
                      {brand.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium truncate">{brand.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openBrandDialog(brand)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setDealForm(prev => ({ ...prev, brand_id: brand.id }))
                            setIsDealDialogOpen(true)
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteBrand(brand)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {brand.contact_name && (
                      <p className="text-sm text-muted-foreground">{brand.contact_name}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  {brand.contact_email && (
                    <a 
                      href={`mailto:${brand.contact_email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {brand.contact_email}
                    </a>
                  )}
                  {brand.website && (
                    <a 
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {new URL(brand.website).hostname}
                    </a>
                  )}
                </div>

                {brand.deals && brand.deals[0]?.count > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Badge variant="secondary">
                      {brand.deals[0].count} deal{brand.deals[0].count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Brand Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? 'Modifier la marque' : 'Nouvelle marque'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                placeholder="Nom de la marque"
                value={brandForm.name}
                onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Site web</Label>
              <Input
                placeholder="https://..."
                value={brandForm.website}
                onChange={(e) => setBrandForm(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du contact</Label>
                <Input
                  placeholder="Jean Dupont"
                  value={brandForm.contact_name}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, contact_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="contact@marque.com"
                  value={brandForm.contact_email}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Notes sur la marque..."
                value={brandForm.notes}
                onChange={(e) => setBrandForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBrandDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveBrand} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deal Dialog */}
      <Dialog open={isDealDialogOpen} onOpenChange={setIsDealDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDeal ? 'Modifier le deal' : 'Nouveau deal'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Titre du deal"
                value={dealForm.title}
                onChange={(e) => setDealForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Marque</Label>
              <Select 
                value={dealForm.brand_id} 
                onValueChange={(v) => setDealForm(prev => ({ ...prev, brand_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une marque..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Montant</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={dealForm.amount}
                  onChange={(e) => setDealForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Devise</Label>
                <Select 
                  value={dealForm.currency} 
                  onValueChange={(v) => setDealForm(prev => ({ ...prev, currency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select 
                  value={dealForm.status} 
                  onValueChange={(v) => setDealForm(prev => ({ ...prev, status: v as DealStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(dealStatusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date limite</Label>
                <Input
                  type="date"
                  value={dealForm.deadline}
                  onChange={(e) => setDealForm(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Livrables</Label>
              <Textarea
                placeholder="Description des livrables..."
                value={dealForm.deliverables}
                onChange={(e) => setDealForm(prev => ({ ...prev, deliverables: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Notes sur le deal..."
                value={dealForm.notes}
                onChange={(e) => setDealForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDealDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveDeal} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
