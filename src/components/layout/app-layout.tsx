'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { cn } from '@/lib/utils'
import type { Tables } from '@/types/database'

interface AppLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    email: string | undefined
  }
  profile: Tables<'profiles'> | null
  subscription: Tables<'subscriptions'> | null
}

export function AppLayout({ children, user, profile, subscription }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div
        className={cn(
          "flex flex-col min-h-screen transition-[margin] duration-150",
          isCollapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        <Topbar user={user} profile={profile} subscription={subscription} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
