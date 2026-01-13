'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Sparkles, Target, Users, Zap } from 'lucide-react'

const CONTENT_TYPES = [
  { id: 'blog', name: 'Blog Articles', icon: '📝' },
  { id: 'social', name: 'Social Media', icon: '📱' },
  { id: 'newsletter', name: 'Email Newsletter', icon: '✉️' },
  { id: 'video', name: 'Video Scripts', icon: '🎥' },
]

const GOALS = [
  { id: 'grow-audience', name: 'Grow My Audience', icon: Users },
  { id: 'increase-engagement', name: 'Increase Engagement', icon: Zap },
  { id: 'drive-sales', name: 'Drive Sales', icon: Target },
  { id: 'brand-awareness', name: 'Build Brand Awareness', icon: Sparkles },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    contentTypes: [] as string[],
    goals: [] as string[],
    audienceDescription: '',
  })

  const toggleSelection = (field: 'contentTypes' | 'goals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive',
        })
        return
      }

      // Update profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          company_name: formData.companyName,
          content_types: formData.contentTypes,
          goals: formData.goals,
          audience_description: formData.audienceDescription,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Welcome to Contently! 🎉',
        description: 'Your workspace is ready.',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.fullName.length >= 2
      case 2:
        return formData.contentTypes.length > 0
      case 3:
        return formData.goals.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            <span className="text-sm font-medium">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card p-8 rounded-2xl border shadow-lg"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Welcome to Contently! 👋</h1>
                <p className="text-muted-foreground">Let's get to know you better</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Content Types */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card p-8 rounded-2xl border shadow-lg"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">What content do you create?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleSelection('contentTypes', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.contentTypes.includes(type.id)
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/30'
                        : 'border-border hover:border-violet-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.name}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Goals & Finish */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card p-8 rounded-2xl border shadow-lg"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">What are your goals?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleSelection('goals', goal.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.goals.includes(goal.id)
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/30'
                        : 'border-border hover:border-violet-300'
                    }`}
                  >
                    <goal.icon className={`h-8 w-8 mb-2 ${
                      formData.goals.includes(goal.id) ? 'text-violet-600' : 'text-muted-foreground'
                    }`} />
                    <div className="font-medium">{goal.name}</div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <Label htmlFor="audienceDescription">Tell us about your audience (Optional)</Label>
                <Textarea
                  id="audienceDescription"
                  placeholder="e.g., Small business owners interested in digital marketing"
                  value={formData.audienceDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, audienceDescription: e.target.value }))}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
