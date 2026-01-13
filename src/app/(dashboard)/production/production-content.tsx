'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import Link from 'next/link'
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
  RotateCcw,
  Timer,
  ListTodo,
  FileText,
  Image,
  Settings,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { format, isToday, isTomorrow, differenceInMinutes, addMinutes } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type PlannerItem = Tables<'planner_items'> & {
  idea?: {
    id: string
    title: string
    hook: string | null
    status: string
    priority: number
    content_pillar?: { id: string; name: string; color: string } | null
    filming_setup?: { 
      id: string
      name: string
      description: string | null
      checklist: Record<string, unknown> | null
    } | null
  } | null
}

type FilmingSetup = Tables<'filming_setups'>

interface ProductionContentProps {
  plannerItems: PlannerItem[]
  filmingSetups: FilmingSetup[]
  userId: string
}

export function ProductionContent({ 
  plannerItems: initialItems, 
  filmingSetups,
  userId 
}: ProductionContentProps) {
  const [plannerItems, setPlannerItems] = useState(initialItems)
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null)
  const [checkedEquipment, setCheckedEquipment] = useState<Record<string, boolean>>({})
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const { toast } = useToast()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Group items by date
  const itemsByDate = useMemo(() => {
    const grouped: Record<string, PlannerItem[]> = {}
    plannerItems.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = []
      }
      grouped[item.date].push(item)
    })
    return grouped
  }, [plannerItems])

  const todayItems = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return itemsByDate[today] || []
  }, [itemsByDate])

  const activeIdea = plannerItems.find(item => item.idea?.id === activeIdeaId)?.idea

  // Get unique checklist items from all filming setups of today's items
  const todayChecklist = useMemo(() => {
    const items = new Set<string>()
    todayItems.forEach(item => {
      if (item.idea?.filming_setup?.checklist) {
        const checklist = item.idea.filming_setup.checklist as { items?: string[] }
        if (checklist.items) {
          checklist.items.forEach(e => items.add(e))
        }
      }
    })
    return Array.from(items)
  }, [todayItems])

  const checklistProgress = useMemo(() => {
    if (todayChecklist.length === 0) return 100
    const checked = todayChecklist.filter(e => checkedEquipment[e]).length
    return Math.round((checked / todayChecklist.length) * 100)
  }, [todayChecklist, checkedEquipment])

  const toggleEquipment = (item: string) => {
    setCheckedEquipment(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const startTimer = () => {
    if (timerInterval) return
    setIsTimerRunning(true)
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    pauseTimer()
    setTimerSeconds(0)
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleMarkAsFilmed = async (ideaId: string) => {
    try {
      const { error } = await supabaseMutation
        .from('ideas')
        .update({ 
          status: 'filmed',
          filmed_at: new Date().toISOString()
        })
        .eq('id', ideaId)

      if (error) throw error

      setPlannerItems(prev => 
        prev.map(item => {
          if (item.idea?.id === ideaId) {
            return {
              ...item,
              idea: { ...item.idea, status: 'filmed' }
            }
          }
          return item
        })
      )

      toast({
        title: 'Content filmed! 🎬',
        description: 'The idea has been marked as filmed.',
      })

      // Move to next idea
      const currentIndex = todayItems.findIndex(item => item.idea?.id === ideaId)
      if (currentIndex < todayItems.length - 1) {
        setActiveIdeaId(todayItems[currentIndex + 1].idea?.id || null)
      } else {
        setActiveIdeaId(null)
      }
      
      resetTimer()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut.',
        variant: 'destructive',
      })
    }
  }

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return "Aujourd'hui"
    if (isTomorrow(date)) return "Demain"
    return format(date, 'EEEE d MMMM', { locale: fr })
  }

  const filmedCount = todayItems.filter(item => item.idea?.status === 'filmed').length
  const totalCount = todayItems.length
  const dayProgress = totalCount > 0 ? Math.round((filmedCount / totalCount) * 100) : 0

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Filming Day
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        
        {/* Day Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progression du jour</p>
            <p className="text-lg font-semibold">{filmedCount}/{totalCount} tournés</p>
          </div>
          <div className="w-32">
            <Progress value={dayProgress} className="h-3" />
          </div>
        </div>
      </div>

      {todayItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucun tournage prévu aujourd'hui</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Planifiez des contenus dans le Planner pour les voir apparaître ici le jour J.
          </p>
          <Button asChild>
            <Link href="/planner">
              <Calendar className="h-4 w-4 mr-2" />
              Aller au Planner
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Filming Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Recording */}
            {activeIdea && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white mr-2" />
                    En cours de tournage
                  </Badge>
                  <div className="text-3xl font-mono font-bold">
                    {formatTimer(timerSeconds)}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">{activeIdea.title}</h2>
                
                {activeIdea.hook && (
                  <p className="text-muted-foreground mb-4">
                    <span className="font-medium text-foreground">Hook:</span> {activeIdea.hook}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  {!isTimerRunning ? (
                    <Button onClick={startTimer} className="gap-2">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} variant="outline" className="gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <div className="flex-1" />
                  <Button 
                    onClick={() => handleMarkAsFilmed(activeIdea.id)}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                    Mark as Filmed
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Today's Queue */}
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-medium flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  Today's Queue
                </h3>
              </div>
              <div className="divide-y">
                {todayItems.map((item, index) => {
                  const isActive = item.idea?.id === activeIdeaId
                  const isFilmed = item.idea?.status === 'filmed'

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 flex items-center gap-4 transition-colors",
                        isActive && "bg-primary/5",
                        isFilmed && "opacity-60"
                      )}
                    >
                      <div className="shrink-0">
                        {isFilmed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : isActive ? (
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "font-medium truncate",
                            isFilmed && "line-through"
                          )}>
                            {item.idea?.title}
                          </h4>
                          {item.idea?.content_pillar && (
                            <Badge 
                              variant="secondary"
                              className="shrink-0"
                              style={{ 
                                backgroundColor: `${item.idea.content_pillar.color}20`,
                                color: item.idea.content_pillar.color,
                              }}
                            >
                              {item.idea.content_pillar.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {item.start_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {item.start_time}
                            </span>
                          )}
                          {item.idea?.filming_setup && (
                            <span className="flex items-center gap-1">
                              <Camera className="h-3.5 w-3.5" />
                              {item.idea.filming_setup.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isFilmed && !isActive && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveIdeaId(item.idea?.id || null)}
                          >
                            Film
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/ideas/${item.idea?.id}`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Days */}
            {Object.entries(itemsByDate)
              .filter(([dateKey]) => dateKey !== format(new Date(), 'yyyy-MM-dd'))
              .slice(0, 3)
              .map(([dateKey, items]) => (
                <div key={dateKey} className="bg-card border rounded-xl overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {getDateLabel(dateKey)}
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {items.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="text-muted-foreground">{item.start_time}</span>
                        <span className="font-medium">{item.idea?.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>

          {/* Sidebar - Checklist */}
          <div className="space-y-6">
            {/* Equipment Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Checklist
                  </h3>
                  <Badge variant={checklistProgress === 100 ? "default" : "secondary"}>
                    {checklistProgress}%
                  </Badge>
                </div>
                <Progress value={checklistProgress} className="mt-2 h-2" />
              </div>
              
              <ScrollArea className="h-[300px]">
                <div className="p-4 space-y-2">
                  {todayChecklist.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No checklist items defined for today's setups.
                    </p>
                  ) : (
                    todayChecklist.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleEquipment(item)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        {checkedEquipment[item] ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={cn(
                          "text-sm",
                          checkedEquipment[item] && "line-through text-muted-foreground"
                        )}>
                          {item}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border rounded-xl p-4"
            >
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Tips du jour
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Vérifiez la lumière naturelle avant de commencer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Faites un test audio de 10 secondes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Filmez toujours quelques secondes de plus
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  N'oubliez pas les plans B-roll !
                </li>
              </ul>
            </motion.div>

            {/* Filming Setups */}
            {filmingSetups.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Vos setups
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {filmingSetups.slice(0, 3).map(setup => (
                    <div key={setup.id} className="text-sm">
                      <p className="font-medium">{setup.name}</p>
                      {setup.description && (
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {setup.description}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/settings/setups">
                      Gérer les setups
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
