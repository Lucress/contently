'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPillar(formData: {
  name: string
  description: string | null
  color: string
}): Promise<{ data?: any; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get count for sort order
  const { count } = await supabase
    .from('content_pillars')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)

  // Direct insert with type casting to bypass strict typing
  const { data, error } = await (supabase.from('content_pillars') as any)
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: '📌',
      is_active: true,
      sort_order: count || 0,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function updatePillar(
  id: string,
  formData: {
    name: string
    description: string | null
    color: string
  }
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await (supabase.from('content_pillars') as any)
    .update({
      name: formData.name,
      description: formData.description,
      color: formData.color,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deletePillar(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await (supabase.from('content_pillars') as any)
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
