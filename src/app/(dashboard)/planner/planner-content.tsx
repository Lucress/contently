'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  FileEdit,
  Send,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  GripVertical,
  CalendarDays,
  LayoutGrid
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  parseISO
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type PlannerItem = Tables<'planner_items'> & {
  idea?: {
    id: string
    title: string
    hook: string | null
    status: string
    priority: string
    content_pillar?: { id: string; name: string; color: string } | null
  } | null
}

type UnscheduledIdea = {
  id: string
  title: string
  hook: string | null
  status: string
  priority: string
  content_pillar?: { id: string; name: string; color: string } | null
}

type FilmedIdea = {
  id: string
  title: string
  hook: string | null
  status: string
  priority: string
  filmed_at: string | null
  content_pillar?: { id: string; name: string; color: string } | null
}

interface PlannerContentProps {
  plannerItems: PlannerItem[]
  unscheduledIdeas: UnscheduledIdea[]
  filmedIdeas: FilmedIdea[]
  userId: string
}

const slotTypeConfig = {
  filming: { label: 'Filming', icon: Video, color: 'bg-orange-500' },
  editing: { label: 'Editing', icon: FileEdit, color: 'bg-pink-500' },
  publishing: { label: 'Publishing', icon: Send, color: 'bg-green-500' },
  task: { label: 'Task', icon: Clock, color: 'bg-blue-500' },
  meeting: { label: 'Meeting', icon: Clock, color: 'bg-purple-500' },
  other: { label: 'Other', icon: Clock, color: 'bg-gray-500' },
}

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
}

export function PlannerContent({ 
  plannerItems: initialItems, 
  unscheduledIdeas: initialUnscheduled,
  filmedIdeas: initialFilmed,
  userId 
}: PlannerContentProps) {
  const [plannerItems, setPlannerItems] = useState(initialItems)
  const [unscheduledIdeas, setUnscheduledIdeas] = useState(initialUnscheduled)
  const [filmedIdeas, setFilmedIdeas] = useState(initialFilmed)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [sidebarTab, setSidebarTab] = useState<'scripted' | 'filmed'>('scripted')
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<string>('')
  const [selectedSlotType, setSelectedSlotType] = useState<string>('filming')
  const [selectedTime, setSelectedTime] = useState<string>('09:00')
  const [draggedIdea, setDraggedIdea] = useState<UnscheduledIdea | null>(null)
  const [draggedFilmedIdea, setDraggedFilmedIdea] = useState<FilmedIdea | null>(null)

  const { toast } = useToast()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Calculate days to display based on view mode
  const displayDays = useMemo(() => {
    if (viewMode === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      })
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }
  }, [currentDate, viewMode])

  // Group planner items by date
  const itemsByDate = useMemo(() => {
    const grouped: Record<string, PlannerItem[]> = {}
    plannerItems.forEach(item => {
      const dateKey = item.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(item)
    })
    return grouped
  }, [plannerItems])

  const navigatePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const navigateNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  const openScheduleDialog = (date: Date) => {
    setSelectedDate(date)
    setIsScheduleDialogOpen(true)
  }

  const handleScheduleIdea = async () => {
    if (!selectedDate || !selectedIdea) {
      toast({
        title: 'Error',
        description: 'Please select an idea.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Create planner item
      const { data: plannerItem, error } = await supabaseMutation
        .from('planner_items')
        .insert({
          user_id: userId,
          idea_id: selectedIdea,
          title: 'Scheduled Item',
          date: format(selectedDate, 'yyyy-MM-dd'),
          item_type: selectedSlotType,
          start_time: selectedTime,
        })
        .select(`
          *,
          idea:ideas(
            id,
            title,
            hook,
            status,
            priority,
            content_pillar:content_pillars(id, name, color)
          )
        `)
        .single()

      if (error) throw error

      // Update idea status if it's a filming slot
      if (selectedSlotType === 'filming') {
        await supabaseMutation
          .from('ideas')
          .update({ 
            status: 'planned',
            scheduled_date: format(selectedDate, 'yyyy-MM-dd')
          })
          .eq('id', selectedIdea)
      }

      // Update local state
      setPlannerItems(prev => [...prev, plannerItem as PlannerItem])
      setUnscheduledIdeas(prev => prev.filter(i => i.id !== selectedIdea))
      
      setIsScheduleDialogOpen(false)
      setSelectedIdea('')
      setSelectedSlotType('filming')
      setSelectedTime('09:00')

      toast({
        title: 'Idea scheduled',
        description: 'The idea has been added to the planner.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to schedule the idea.',
        variant: 'destructive',
      })
    }
  }

  const handleDeletePlannerItem = async (item: PlannerItem) => {
    try {
      const { error } = await supabaseMutation
        .from('planner_items')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      setPlannerItems(prev => prev.filter(i => i.id !== item.id))

      // Re-add idea to unscheduled if it was scheduled
      if (item.idea) {
        setUnscheduledIdeas(prev => [item.idea as UnscheduledIdea, ...prev])
        
        // Reset idea status
        await supabaseMutation
          .from('ideas')
          .update({ status: 'scripted', scheduled_date: null })
          .eq('id', item.idea_id)
      }

      toast({
        title: 'Item deleted',
        description: 'The item has been removed from the planner.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to delete the item.',
        variant: 'destructive',
      })
    }
  }

  // Drag and drop handlers
  const handleDragStart = (idea: UnscheduledIdea) => {
    setDraggedIdea(idea)
  }

  const handleFilmedDragStart = (idea: FilmedIdea) => {
    setDraggedFilmedIdea(idea)
  }

  const handleDragEnd = () => {
    setDraggedIdea(null)
    setDraggedFilmedIdea(null)
  }

  const handleDrop = async (date: Date) => {
    // Handle filmed idea drop (scheduling publication)
    if (draggedFilmedIdea) {
      try {
        const { data: plannerItem, error } = await supabaseMutation
          .from('planner_items')
          .insert({
            user_id: userId,
            idea_id: draggedFilmedIdea.id,
            title: draggedFilmedIdea.title,
            date: format(date, 'yyyy-MM-dd'),
            item_type: 'publishing',
            start_time: '12:00',
          })
          .select(`
            *,
            idea:ideas(
              id,
              title,
              hook,
              status,
              priority,
              content_pillar:content_pillars(id, name, color)
            )
          `)
          .single()

        if (error) throw error

        // Update idea with publish date
        await supabaseMutation
          .from('ideas')
          .update({ 
            status: 'scheduled',
            publish_date: format(date, 'yyyy-MM-dd')
          })
          .eq('id', draggedFilmedIdea.id)

        setPlannerItems(prev => [...prev, plannerItem as PlannerItem])
        setFilmedIdeas(prev => prev.filter(i => i.id !== draggedFilmedIdea.id))

        toast({
          title: 'Publication scheduled',
          description: `"${draggedFilmedIdea.title}" will be published on ${format(date, 'MMMM d')}.`,
        })
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: 'Unable to schedule the publication.',
          variant: 'destructive',
        })
      }

      setDraggedFilmedIdea(null)
      return
    }

    // Handle scripted idea drop (scheduling filming)
    if (!draggedIdea) return

    try {
      const { data: plannerItem, error } = await supabaseMutation
        .from('planner_items')
        .insert({
          user_id: userId,
          idea_id: draggedIdea.id,
          title: draggedIdea.title,
          date: format(date, 'yyyy-MM-dd'),
          item_type: 'filming',
          start_time: '09:00',
        })
        .select(`
          *,
          idea:ideas(
            id,
            title,
            hook,
            status,
            priority,
            content_pillar:content_pillars(id, name, color)
          )
        `)
        .single()

      if (error) throw error

      await supabaseMutation
        .from('ideas')
        .update({ 
          status: 'planned',
          scheduled_date: format(date, 'yyyy-MM-dd')
        })
        .eq('id', draggedIdea.id)

      setPlannerItems(prev => [...prev, plannerItem as PlannerItem])
      setUnscheduledIdeas(prev => prev.filter(i => i.id !== draggedIdea.id))

      toast({
        title: 'Idea scheduled',
        description: `"${draggedIdea.title}" scheduled for ${format(date, 'MMMM d')}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to schedule the idea.',
        variant: 'destructive',
      })
    }

    setDraggedIdea(null)
  }

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Planner</h1>
            <p className="text-muted-foreground mt-1">
              Schedule your filming and publications
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => setViewMode('week')}
              >
                <CalendarDays className="h-4 w-4" />
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => setViewMode('month')}
              >
                <LayoutGrid className="h-4 w-4" />
                Month
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={navigateToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Period Label */}
        <div className="mb-4">
          <h2 className="text-lg font-medium">
            {viewMode === 'week' 
              ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMMM d', { locale: enUS })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMMM d, yyyy', { locale: enUS })}`
              : format(currentDate, 'MMMM yyyy', { locale: enUS })
            }
          </h2>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Calendar */}
          <div className="flex-1 bg-card border rounded-xl overflow-hidden flex flex-col">
            {/* Days Header */}
            <div className={cn(
              "grid border-b bg-muted/30",
              viewMode === 'week' ? "grid-cols-7" : "grid-cols-7"
            )}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className={cn(
              "grid flex-1",
              viewMode === 'week' ? "grid-cols-7" : "grid-cols-7 auto-rows-fr"
            )}>
              {displayDays.map((day, index) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const dayItems = itemsByDate[dateKey] || []
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isDayToday = isToday(day)

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "border-r border-b p-2 min-h-[120px] transition-colors",
                      !isCurrentMonth && viewMode === 'month' && "bg-muted/20",
                      (draggedIdea || draggedFilmedIdea) && "hover:bg-primary/5 cursor-copy"
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(day)}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                        isDayToday && "bg-primary text-primary-foreground",
                        !isCurrentMonth && viewMode === 'month' && "text-muted-foreground"
                      )}>
                        {format(day, 'd')}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100"
                        onClick={() => openScheduleDialog(day)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Day Items */}
                    <div className="space-y-1">
                      {dayItems.slice(0, viewMode === 'week' ? 4 : 2).map((item) => {
                        const slotConfig = slotTypeConfig[item.item_type as keyof typeof slotTypeConfig]
                        const SlotIcon = slotConfig?.icon || Video

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "group bg-background border rounded-md p-1.5 text-xs cursor-pointer hover:shadow-sm transition-shadow border-l-2",
                              item.idea?.priority && priorityColors[item.idea.priority as keyof typeof priorityColors]
                            )}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={cn("p-0.5 rounded", slotConfig?.color, "text-white")}>
                                <SlotIcon className="h-3 w-3" />
                              </div>
                              <span className="truncate flex-1 font-medium">
                                {item.idea?.title || item.title || 'Untitled'}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {item.idea && (
                                    <DropdownMenuItem asChild>
                                      <Link href={`/ideas/${item.idea.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Idea
                                      </Link>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeletePlannerItem(item)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove from Planner
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {item.start_time && (
                              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{item.start_time}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                      {dayItems.length > (viewMode === 'week' ? 4 : 2) && (
                        <button className="text-xs text-primary hover:underline">
                          +{dayItems.length - (viewMode === 'week' ? 4 : 2)} more
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ideas Sidebar */}
          <div className="w-80 bg-card border rounded-xl flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setSidebarTab('scripted')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  sidebarTab === 'scripted' 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                To Film ({unscheduledIdeas.length})
              </button>
              <button
                onClick={() => setSidebarTab('filmed')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  sidebarTab === 'filmed' 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                To Post ({filmedIdeas.length})
              </button>
            </div>

            {/* Scripted Ideas - Ready to Film */}
            {sidebarTab === 'scripted' && (
              <>
                <div className="p-4 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Drag scripted ideas onto the calendar to schedule filming
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {unscheduledIdeas.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No scripted ideas to schedule
                    </p>
                  ) : (
                    unscheduledIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        draggable
                        onDragStart={() => handleDragStart(idea)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "bg-background border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4",
                          idea.priority && priorityColors[idea.priority as keyof typeof priorityColors]
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{idea.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant="outline" className="text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                Scripted
                              </Badge>
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Filmed Ideas - Ready to Publish */}
            {sidebarTab === 'filmed' && (
              <>
                <div className="p-4 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Drag filmed ideas to schedule when to publish
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filmedIdeas.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      No filmed ideas ready to publish
                    </p>
                  ) : (
                    filmedIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        draggable
                        onDragStart={() => handleFilmedDragStart(idea)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "bg-background border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4 border-l-green-500",
                          idea.priority && priorityColors[idea.priority as keyof typeof priorityColors]
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{idea.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                <Video className="h-3 w-3 mr-1" />
                                Filmed
                              </Badge>
                              {idea.filmed_at && (
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(idea.filmed_at), 'MMM d')}
                                </span>
                              )}
                            </div>
                            {idea.content_pillar && (
                              <Badge 
                                variant="secondary" 
                                className="mt-1.5 text-xs"
                                style={{ 
                                  backgroundColor: `${idea.content_pillar.color}20`,
                                  color: idea.content_pillar.color,
                                }}
                              >
                                {idea.content_pillar.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule an Idea</DialogTitle>
            <DialogDescription>
              {selectedDate && `For ${format(selectedDate, 'MMMM d, yyyy', { locale: enUS })}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Idea</Label>
              <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an idea..." />
                </SelectTrigger>
                <SelectContent>
                  {unscheduledIdeas.map((idea) => (
                    <SelectItem key={idea.id} value={idea.id}>
                      {idea.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slot Type</Label>
                <Select value={selectedSlotType} onValueChange={setSelectedSlotType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filming">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Filming
                      </div>
                    </SelectItem>
                    <SelectItem value="editing">
                      <div className="flex items-center gap-2">
                        <FileEdit className="h-4 w-4" />
                        Editing
                      </div>
                    </SelectItem>
                    <SelectItem value="publishing">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Publishing
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleIdea}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
