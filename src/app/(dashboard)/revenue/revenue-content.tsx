'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { 
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  FileText,
  Download,
  Filter,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachMonthOfInterval, 
  subMonths,
  isSameMonth
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type Revenue = Tables<'revenues'> & {
  deal?: { 
    id: string
    title: string
    brand?: { id: string; name: string } | null
  } | null
}

type Analytics = Tables<'analytics_snapshots'>

type WonDeal = {
  id: string
  title: string
  amount: number | null
  currency: string
  brand?: { id: string; name: string } | null
}

interface RevenueContentProps {
  revenues: Revenue[]
  analytics: Analytics[]
  wonDeals: WonDeal[]
  userId: string
}

const sourceTypes = {
  sponsorship: { label: 'Sponsoring', color: 'bg-blue-500' },
  affiliation: { label: 'Affiliation', color: 'bg-green-500' },
  product: { label: 'Produit', color: 'bg-purple-500' },
  service: { label: 'Service', color: 'bg-orange-500' },
  adsense: { label: 'AdSense', color: 'bg-red-500' },
  other: { label: 'Autre', color: 'bg-gray-500' },
}

export function RevenueContent({ 
  revenues: initialRevenues, 
  analytics,
  wonDeals,
  userId 
}: RevenueContentProps) {
  const [revenues, setRevenues] = useState(initialRevenues)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('6m')
  
  // Revenue Dialog
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false)
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null)
  const [revenueForm, setRevenueForm] = useState({
    source: 'sponsorship' as Revenue['source'],
    amount: '',
    currency: 'EUR',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    deal_id: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = revenues.filter(r => isSameMonth(new Date(r.date), now))
    const lastMonth = revenues.filter(r => isSameMonth(new Date(r.date), subMonths(now, 1)))
    
    const thisMonthTotal = thisMonth.reduce((sum, r) => sum + r.amount, 0)
    const lastMonthTotal = lastMonth.reduce((sum, r) => sum + r.amount, 0)
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)
    
    const growth = lastMonthTotal > 0 
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0

    // By source type
    const bySource: Record<string, number> = {}
    revenues.forEach(r => {
      bySource[r.source] = (bySource[r.source] || 0) + r.amount
    })

    return {
      thisMonthTotal,
      lastMonthTotal,
      totalRevenue,
      growth,
      bySource,
      avgMonthly: totalRevenue / 6,
    }
  }, [revenues])

  // Monthly data for chart
  const monthlyData = useMemo(() => {
    const now = new Date()
    const months = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    })

    return months.map(month => {
      const monthRevenues = revenues.filter(r => 
        isSameMonth(new Date(r.date), month)
      )
      return {
        month: format(month, 'MMM'),
        total: monthRevenues.reduce((sum, r) => sum + r.amount, 0),
        bySource: Object.fromEntries(
          Object.keys(sourceTypes).map(type => [
            type,
            monthRevenues.filter(r => r.source === type).reduce((sum, r) => sum + r.amount, 0)
          ])
        ),
      }
    })
  }, [revenues])

  const maxMonthly = Math.max(...monthlyData.map(m => m.total), 1)

  const resetRevenueForm = () => {
    setRevenueForm({
      source: 'sponsorship',
      amount: '',
      currency: 'EUR',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      deal_id: '',
    })
    setEditingRevenue(null)
  }

  const openRevenueDialog = (revenue?: Revenue) => {
    if (revenue) {
      setEditingRevenue(revenue)
      setRevenueForm({
        source: revenue.source,
        amount: revenue.amount.toString(),
        currency: revenue.currency,
        date: revenue.date,
        description: revenue.description || '',
        deal_id: revenue.deal_id || '',
      })
    } else {
      resetRevenueForm()
    }
    setIsRevenueDialogOpen(true)
  }

  const handleSaveRevenue = async () => {
    if (!revenueForm.amount) {
      toast({
        title: 'Error',
        description: 'Amount is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const data = {
        source: revenueForm.source,
        amount: parseFloat(revenueForm.amount),
        currency: revenueForm.currency,
        date: revenueForm.date,
        description: revenueForm.description || null,
        deal_id: revenueForm.deal_id || null,
      }

      const supabaseMutation = createUntypedClient()

      if (editingRevenue) {
        const { data: updated, error } = await supabaseMutation
          .from('revenues')
          .update(data)
          .eq('id', editingRevenue.id)
          .select(`*, deal:deals(id, title, brand:brands(id, name))`)
          .single()

        if (error) throw error

        setRevenues(prev => prev.map(r => r.id === editingRevenue.id ? updated : r))
        toast({ title: 'Revenue updated' })
      } else {
        const { data: created, error } = await supabaseMutation
          .from('revenues')
          .insert({ ...data, user_id: userId })
          .select(`*, deal:deals(id, title, brand:brands(id, name))`)
          .single()

        if (error) throw error

        setRevenues(prev => [created, ...prev])
        toast({ title: 'Revenue added' })
      }

      setIsRevenueDialogOpen(false)
      resetRevenueForm()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le revenu.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRevenue = async (revenue: Revenue) => {
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', revenue.id)

      if (error) throw error

      setRevenues(prev => prev.filter(r => r.id !== revenue.id))
      toast({ title: 'Revenu supprimé' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le revenu.',
        variant: 'destructive',
      })
    }
  }

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Revenus & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos revenus et performances
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Ce mois</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => openRevenueDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un revenu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Ce mois</span>
            {stats.growth !== 0 && (
              <Badge 
                variant={stats.growth > 0 ? "default" : "destructive"}
                className={cn(
                  "gap-1",
                  stats.growth > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                )}
              >
                {stats.growth > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(stats.growth).toFixed(1)}%
              </Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(stats.thisMonthTotal)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border rounded-xl p-6"
        >
          <span className="text-sm text-muted-foreground">Mois dernier</span>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(stats.lastMonthTotal)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-xl p-6"
        >
          <span className="text-sm text-muted-foreground">Moyenne mensuelle</span>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(stats.avgMonthly)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border rounded-xl p-6"
        >
          <span className="text-sm text-muted-foreground">Total (6 mois)</span>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-card border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Évolution des revenus
                </h3>
              </div>
              <div className="flex items-end gap-4 h-[200px]">
                {monthlyData.map((month, index) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-md overflow-hidden flex flex-col justify-end" style={{ height: '160px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.total / maxMonthly) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-primary rounded-t-md relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(month.total)}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{month.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Revenue by Source */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border rounded-xl p-6"
            >
              <h3 className="font-medium flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5 text-primary" />
                Par source
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.bySource)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, amount]) => {
                    const config = sourceTypes[type as keyof typeof sourceTypes]
                    const percentage = stats.totalRevenue > 0 
                      ? (amount / stats.totalRevenue) * 100 
                      : 0
                    
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", config?.color)} />
                            <span className="text-sm">{config?.label || type}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                {Object.keys(stats.bySource).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun revenu enregistré
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-xl"
          >
            <div className="p-4 border-b">
              <h3 className="font-medium">Recent Transactions</h3>
            </div>
            <div className="divide-y">
              {revenues.slice(0, 5).map((revenue) => {
                const config = sourceTypes[revenue.source as keyof typeof sourceTypes]
                
                return (
                  <div key={revenue.id} className="p-4 flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config?.color, "text-white")}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {revenue.description || config?.label || 'Revenue'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {revenue.deal?.title && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {revenue.deal.brand?.name || revenue.deal.title}
                          </span>
                        )}
                        {!revenue.deal?.title && format(new Date(revenue.date), 'd MMMM yyyy')}
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(revenue.amount, revenue.currency)}
                    </p>
                  </div>
                )
              })}
              {revenues.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No transactions recorded
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <div className="bg-card border rounded-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">All Transactions</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="divide-y">
              {revenues.map((revenue) => {
                const config = sourceTypes[revenue.source as keyof typeof sourceTypes]
                
                return (
                  <div key={revenue.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", config?.color, "text-white")}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {revenue.description || config?.label || 'Revenue'}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="secondary">{config?.label}</Badge>
                        {revenue.deal?.brand?.name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {revenue.deal.brand.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(revenue.amount, revenue.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(revenue.date), 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openRevenueDialog(revenue)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteRevenue(revenue)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
              {revenues.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune transaction enregistrée</p>
                  <Button className="mt-4" onClick={() => openRevenueDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un revenu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="bg-card border rounded-xl p-8 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-medium mb-2">Analytics de contenus</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Connectez vos comptes sociaux pour suivre les performances de vos contenus (vues, likes, commentaires).
            </p>
            <Button variant="outline">
              Connecter mes comptes
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Revenue Dialog */}
      <Dialog open={isRevenueDialogOpen} onOpenChange={setIsRevenueDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRevenue ? 'Modifier le revenu' : 'Ajouter un revenu'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Montant *</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={revenueForm.amount}
                  onChange={(e) => setRevenueForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Devise</Label>
                <Select 
                  value={revenueForm.currency} 
                  onValueChange={(v) => setRevenueForm(prev => ({ ...prev, currency: v }))}
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
                <Label>Source</Label>
                <Select 
                  value={revenueForm.source} 
                  onValueChange={(v) => setRevenueForm(prev => ({ ...prev, source: v as Revenue['source'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sourceTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={revenueForm.date}
                  onChange={(e) => setRevenueForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            {wonDeals.length > 0 && (
              <div className="space-y-2">
                <Label>Associated Deal (optional)</Label>
                <Select 
                  value={revenueForm.deal_id} 
                  onValueChange={(v) => setRevenueForm(prev => ({ ...prev, deal_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {wonDeals.map(deal => (
                      <SelectItem key={deal.id} value={deal.id}>
                        {deal.title} {deal.brand?.name && `(${deal.brand.name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description du revenu..."
                value={revenueForm.description}
                onChange={(e) => setRevenueForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevenueDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveRevenue} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
