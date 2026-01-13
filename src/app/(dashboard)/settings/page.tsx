import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsContent } from '.'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all settings data in parallel
  const [
    { data: profile },
    { data: pillars },
    { data: categories },
    { data: contentTypes },
    { data: filmingSetups },
    { data: hashtags },
    { data: subscription },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('content_categories')
      .select('*, pillar:content_pillars(id, name, color)')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('content_types')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('filming_setups')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('hashtag_groups')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single(),
  ])

  return (
    <SettingsContent 
      profile={profile}
      pillars={pillars || []}
      categories={categories || []}
      contentTypes={contentTypes || []}
      filmingSetups={filmingSetups || []}
      hashtags={hashtags || []}
      subscription={subscription}
      userId={user.id}
      userEmail={user.email || ''}
    />
  )
}
