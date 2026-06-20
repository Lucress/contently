'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export const dynamic = 'force-dynamic'

function UpdatePasswordForm() {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' })
      return
    }
    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' })
      router.push('/auth/login')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Something went wrong.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Choose a strong password for your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <React.Suspense>
      <UpdatePasswordForm />
    </React.Suspense>
  )
}
