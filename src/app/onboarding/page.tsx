'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { createUntypedClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createUntypedClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [supabase])

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

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          timezone: formData.timezone,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Welcome to Contently',
        description: 'Your workspace is ready.',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
      toast({
        title: 'Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    return formData.fullName.length >= 2
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 to-zinc-800 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-xl">C</span>
            </div>
            <span className="font-semibold text-xl text-white">Contently</span>
          </div>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white leading-tight">
            The content platform<br />
            for modern creators
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Organize all your content in one place</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Plan and schedule with precision</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Track performance and grow your audience</span>
            </div>
          </div>
        </div>

        <p className="text-zinc-500 text-sm">
          © 2026 Contently. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-semibold text-xl">Contently</span>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
            </div>
            <p className="text-sm text-muted-foreground">Step {step} of 2</p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Welcome to Contently</h2>
                  <p className="text-muted-foreground">Let's set up your profile</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      value={userEmail}
                      disabled
                      className="mt-1.5 bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="w-full mt-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Timezone & Finish */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Almost there</h2>
                  <p className="text-muted-foreground">Confirm your preferences</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="timezone" className="text-sm font-medium">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Europe/Berlin">Berlin (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">Shanghai (CST)</option>
                      <option value="Australia/Sydney">Sydney (AEST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-medium mb-2">Your Profile</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Name: {formData.fullName}</p>
                      <p>Email: {userEmail}</p>
                      <p>Timezone: {formData.timezone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {isLoading ? 'Setting up...' : 'Get Started'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
