'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
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
      
      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        <Topbar user={user} profile={profile} subscription={subscription} />
        
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  )
}
