'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Users, CreditCard, TrendingUp, Lightbulb, Sparkles, Handshake, DollarSign, Crown, Zap, Activity } from 'lucide-react'
import { format } from 'date-fns'

interface Stats {
  totalUsers: number
  activeSubscriptions: number
  mrr: number
  totalIdeas: number
  totalInspirations: number
  totalDeals: number
  monthlyRevenue: number
  planBreakdown: { free: number; pro: number; creator_plus: number }
}

interface RecentUser {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

interface SignupDay {
  date: string
  count: number
}

interface Props {
  stats: Stats
  recentUsers: RecentUser[]
  signupChartData: SignupDay[]
}

const PIE_COLORS = ['#94a3b8', '#8b5cf6', '#6366f1']

export function AdminDashboard({ stats, recentUsers, signupChartData }: Props) {
  const planPieData = [
    { name: 'Free', value: stats.planBreakdown.free },
    { name: 'Pro', value: stats.planBreakdown.pro },
    { name: 'Creator+', value: stats.planBreakdown.creator_plus },
  ]

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Paid Subscribers',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'MRR',
      value: `€${stats.mrr.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Total Ideas Created',
      value: stats.totalIdeas.toLocaleString(),
      icon: Lightbulb,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Inspirations Saved',
      value: stats.totalInspirations.toLocaleString(),
      icon: Sparkles,
      color: 'text-pink-600',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
    },
    {
      label: 'Deals Tracked',
      value: stats.totalDeals.toLocaleString(),
      icon: Handshake,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Activity className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
            Private
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Platform overview · Last updated {format(new Date(), 'MMM d, yyyy HH:mm')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="p-4 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
            <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Signup chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
          <h2 className="font-semibold mb-1">New Sign-ups (Last 14 days)</h2>
          <p className="text-xs text-gray-500 mb-4">Daily new user registrations</p>
          {signupChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={signupChartData} barSize={20}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) => {
                    try { return format(new Date(d), 'MMM d') } catch { return d }
                  }}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [v, 'Sign-ups']}
                  labelFormatter={(d) => {
                    try { return format(new Date(d), 'MMM d, yyyy') } catch { return d }
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
              No sign-up data yet
            </div>
          )}
        </div>

        {/* Plan breakdown pie */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
          <h2 className="font-semibold mb-1">Plan Distribution</h2>
          <p className="text-xs text-gray-500 mb-4">Active users by plan</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={planPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {planPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [v, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Free', count: stats.planBreakdown.free, color: 'bg-slate-400', icon: null },
              { label: 'Pro — €4.99/mo', count: stats.planBreakdown.pro, color: 'bg-violet-500', icon: Zap },
              { label: 'Creator+ — €9.99/mo', count: stats.planBreakdown.creator_plus, color: 'bg-indigo-500', icon: Crown },
            ].map(({ label, count, color, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
        <h2 className="font-semibold mb-1">Recent Sign-ups</h2>
        <p className="text-xs text-gray-500 mb-4">Latest 10 users who joined</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 text-xs text-gray-400 font-medium">Name</th>
                <th className="pb-3 text-xs text-gray-400 font-medium">Email</th>
                <th className="pb-3 text-xs text-gray-400 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 font-medium">{u.full_name || '—'}</td>
                  <td className="py-3 text-gray-500">{u.email || '—'}</td>
                  <td className="py-3 text-gray-400">
                    {u.created_at ? format(new Date(u.created_at), 'MMM d, yyyy') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsers.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No users yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
