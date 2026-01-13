'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Sparkles,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Users,
  Video,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
  format,
  parseISO,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameWeek,
  isSameMonth,
  isWithinInterval,
} from 'date-fns'
import { cn } from '@/lib/utils'

interface Idea {
  id: string
  title: string
  status: string
  created_at: string
  pillar_id: string | null
  content_pillar?: { name: string; color: string } | null
}

interface Inspiration {
  id: string
  title: string
  source: string
  status: string
  created_at: string
  pillar_id: string | null
}

interface Revenue {
  id: string
  amount: number
  source: string
  date: string
  description: string | null
}

interface Pillar {
  id: string
  name: string
  color: string
}

interface ContentType {
  id: string
  name: string
}

interface AnalyticsContentProps {
  ideas: Idea[]
  inspirations: Inspiration[]
  revenues: Revenue[]
  pillars: Pillar[]
  contentTypes: ContentType[]
  userId: string
}

type TimeRange = '7d' | '30d' | '90d' | '6m' | 'all'

export function AnalyticsContent({
  ideas,
  inspirations,
  revenues,
  pillars,
}: AnalyticsContentProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [activeView, setActiveView] = useState<'overview' | 'content' | 'revenue'>('overview')

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date()
    switch (timeRange) {
      case '7d':
        return { start: subDays(now, 7), end: now }
      case '30d':
        return { start: subDays(now, 30), end: now }
      case '90d':
        return { start: subDays(now, 90), end: now }
      case '6m':
        return { start: subMonths(now, 6), end: now }
      case 'all':
        return { start: new Date(2020, 0, 1), end: now }
      default:
        return { start: subDays(now, 30), end: now }
    }
  }, [timeRange])

  // Filter data by date range
  const filteredIdeas = useMemo(
    () =>
      ideas.filter((idea) =>
        isWithinInterval(parseISO(idea.created_at), dateRange)
      ),
    [ideas, dateRange]
  )

  const filteredInspirations = useMemo(
    () =>
      inspirations.filter((insp) =>
        isWithinInterval(parseISO(insp.created_at), dateRange)
      ),
    [inspirations, dateRange]
  )

  const filteredRevenues = useMemo(
    () =>
      revenues.filter((rev) =>
        isWithinInterval(parseISO(rev.date), dateRange)
      ),
    [revenues, dateRange]
  )

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalIdeas = filteredIdeas.length
    const publishedIdeas = filteredIdeas.filter(
      (i) => i.status === 'published'
    ).length
    const draftIdeas = filteredIdeas.filter((i) => i.status === 'draft').length
    const scriptingIdeas = filteredIdeas.filter(
      (i) => i.status === 'scripting'
    ).length

    const totalInspirations = filteredInspirations.length
    const convertedInspirations = filteredInspirations.filter(
      (i) => i.status === 'converted'
    ).length

    const totalRevenue = filteredRevenues.reduce((sum, r) => sum + r.amount, 0)

    // Previous period comparison
    const prevRange = {
      start: subDays(dateRange.start, (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)),
      end: dateRange.start,
    }

    const prevIdeas = ideas.filter((idea) =>
      isWithinInterval(parseISO(idea.created_at), prevRange)
    ).length

    const prevRevenue = revenues
      .filter((rev) => isWithinInterval(parseISO(rev.date), prevRange))
      .reduce((sum, r) => sum + r.amount, 0)

    const ideasGrowth = prevIdeas > 0 ? ((totalIdeas - prevIdeas) / prevIdeas) * 100 : 0
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

    return {
      totalIdeas,
      publishedIdeas,
      draftIdeas,
      scriptingIdeas,
      totalInspirations,
      convertedInspirations,
      totalRevenue,
      ideasGrowth,
      revenueGrowth,
    }
  }, [filteredIdeas, filteredInspirations, filteredRevenues, ideas, revenues, dateRange])

  // Inspiration sources breakdown
  const inspirationSources = useMemo(() => {
    const sources: Record<string, number> = {}
    filteredInspirations.forEach((insp) => {
      sources[insp.source] = (sources[insp.source] || 0) + 1
    })
    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
  }, [filteredInspirations])

  // Ideas by pillar
  const ideasByPillar = useMemo(() => {
    const byPillar: Record<string, { name: string; color: string; count: number }> = {}
    filteredIdeas.forEach((idea) => {
      if (idea.content_pillar) {
        const pillarId = idea.pillar_id!
        if (!byPillar[pillarId]) {
          byPillar[pillarId] = {
            name: idea.content_pillar.name,
            color: idea.content_pillar.color,
            count: 0,
          }
        }
        byPillar[pillarId].count++
      }
    })
    return Object.values(byPillar).sort((a, b) => b.count - a.count)
  }, [filteredIdeas])

  // Weekly/Monthly trends
  const trendData = useMemo(() => {
    const days = eachDayOfInterval(dateRange)
    return days.map((day) => {
      const ideasCount = ideas.filter(
        (i) => format(parseISO(i.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length
      const inspirationsCount = inspirations.filter(
        (i) => format(parseISO(i.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length
      const revenueAmount = revenues
        .filter((r) => format(parseISO(r.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
        .reduce((sum, r) => sum + r.amount, 0)
      
      return {
        date: format(day, 'MMM dd'),
        ideas: ideasCount,
        inspirations: inspirationsCount,
        revenue: revenueAmount,
      }
    })
  }, [dateRange, ideas, inspirations, revenues])

  // Status distribution
  const statusDistribution = useMemo(() => {
    const statuses: Record<string, number> = {}
    filteredIdeas.forEach((idea) => {
      statuses[idea.status] = (statuses[idea.status] || 0) + 1
    })
    return Object.entries(statuses).map(([status, count]) => ({ status, count }))
  }, [filteredIdeas])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your content creation progress and performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Ideas"
          value={metrics.totalIdeas}
          change={metrics.ideasGrowth}
          icon={Lightbulb}
          color="text-yellow-600"
          bgColor="bg-yellow-100 dark:bg-yellow-900/30"
        />
        <MetricCard
          title="Published"
          value={metrics.publishedIdeas}
          subtitle={`${metrics.scriptingIdeas} in progress`}
          icon={CheckCircle2}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
        <MetricCard
          title="Inspirations"
          value={metrics.totalInspirations}
          subtitle={`${metrics.convertedInspirations} converted`}
          icon={Sparkles}
          color="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          color="text-emerald-600"
          bgColor="bg-emerald-100 dark:bg-emerald-900/30"
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Trend
                </CardTitle>
                <CardDescription>Ideas and inspirations created over time</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleTrendChart data={trendData} />
              </CardContent>
            </Card>

            {/* Ideas by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Ideas by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          item.status === 'published' && 'bg-green-500',
                          item.status === 'draft' && 'bg-gray-400',
                          item.status === 'scripting' && 'bg-blue-500',
                          item.status === 'filming' && 'bg-purple-500',
                          item.status === 'editing' && 'bg-orange-500'
                        )}
                      />
                      <span className="text-sm capitalize">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            item.status === 'published' && 'bg-green-500',
                            item.status === 'draft' && 'bg-gray-400',
                            item.status === 'scripting' && 'bg-blue-500',
                            item.status === 'filming' && 'bg-purple-500',
                            item.status === 'editing' && 'bg-orange-500'
                          )}
                          style={{
                            width: `${(item.count / metrics.totalIdeas) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Inspiration Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Inspiration Sources
                </CardTitle>
                <CardDescription>Where your ideas come from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {inspirationSources.length > 0 ? (
                  inspirationSources.map((item) => (
                    <div key={item.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {item.source}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(item.count / metrics.totalInspirations) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No inspirations yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ideas by Pillar */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Ideas by Content Pillar
                </CardTitle>
                <CardDescription>Distribution across your content pillars</CardDescription>
              </CardHeader>
              <CardContent>
                {ideasByPillar.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ideasByPillar.map((pillar) => (
                      <motion.div
                        key={pillar.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: pillar.color }}
                          />
                          <span className="font-medium">{pillar.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{pillar.count}</span>
                          <span className="text-sm text-muted-foreground">ideas</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: pillar.color,
                              width: `${(pillar.count / metrics.totalIdeas) * 100}%`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No pillar data available. Start assigning pillars to your ideas!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Productivity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Productivity</CardTitle>
                <CardDescription>Your content creation rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Ideas per week</p>
                    <p className="text-2xl font-bold">
                      {(metrics.totalIdeas / Math.max(1, Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000)))).toFixed(1)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.totalInspirations > 0
                        ? ((metrics.convertedInspirations / metrics.totalInspirations) * 100).toFixed(0)
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...filteredIdeas]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((idea) => (
                      <div key={idea.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{idea.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(idea.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {idea.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Your earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleRevenueTrendChart data={trendData} />
              </CardContent>
            </Card>

            {/* Revenue Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                  {metrics.revenueGrowth !== 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {metrics.revenueGrowth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={cn(
                          'text-sm font-medium',
                          metrics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {formatPercentage(metrics.revenueGrowth)}
                      </span>
                      <span className="text-sm text-muted-foreground">vs previous period</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average per deal</p>
                  <p className="text-2xl font-bold">
                    {filteredRevenues.length > 0
                      ? formatCurrency(metrics.totalRevenue / filteredRevenues.length)
                      : '$0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredRevenues.length > 0 ? (
                    [...filteredRevenues]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((revenue) => (
                        <div key={revenue.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                          <div>
                            <p className="text-sm font-medium">
                              {revenue.description || revenue.source}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(revenue.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-emerald-600">
                            {formatCurrency(revenue.amount)}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No revenue data yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string
  value: string | number
  change?: number
  subtitle?: string
  icon: React.ElementType
  color: string
  bgColor: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {change !== undefined && change !== 0 && (
                <div className="flex items-center gap-1">
                  {change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      change > 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {change > 0 ? '+' : ''}
                    {change.toFixed(1)}%
                  </span>
                </div>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className={cn('p-3 rounded-lg', bgColor)}>
              <Icon className={cn('h-6 w-6', color)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Simple Trend Chart Component
function SimpleTrendChart({ data }: { data: any[] }) {
  const maxIdeas = Math.max(...data.map((d) => d.ideas), 1)
  const maxInspirations = Math.max(...data.map((d) => d.inspirations), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Ideas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Inspirations</span>
        </div>
      </div>
      <div className="h-64 flex items-end gap-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full flex flex-col justify-end h-full gap-0.5">
              <div
                className="w-full bg-yellow-500 rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(item.ideas / maxIdeas) * 100}%`,
                  minHeight: item.ideas > 0 ? '4px' : '0',
                }}
                title={`${item.date}: ${item.ideas} ideas`}
              />
              <div
                className="w-full bg-purple-500 rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(item.inspirations / maxInspirations) * 100}%`,
                  minHeight: item.inspirations > 0 ? '4px' : '0',
                }}
                title={`${item.date}: ${item.inspirations} inspirations`}
              />
            </div>
            {index % Math.ceil(data.length / 7) === 0 && (
              <span className="text-xs text-muted-foreground mt-2">{item.date}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Revenue Trend Chart
function SimpleRevenueTrendChart({ data }: { data: any[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  return (
    <div className="h-64 flex items-end gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
            style={{
              height: `${(item.revenue / maxRevenue) * 100}%`,
              minHeight: item.revenue > 0 ? '4px' : '0',
            }}
            title={`${item.date}: $${item.revenue.toFixed(2)}`}
          />
          {index % Math.ceil(data.length / 7) === 0 && (
            <span className="text-xs text-muted-foreground mt-2">{item.date}</span>
          )}
        </div>
      ))}
    </div>
  )
}
