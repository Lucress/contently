'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPillar(formData: {
  name: string
  description: string | null
  color: string
  hashtags?: string[]
  contentType?: string | null
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

  // Store hashtags and content type in the icon field as JSON (temporary workaround)
  // In production, you'd want to add proper columns to the database
  const metadata = JSON.stringify({
    hashtags: formData.hashtags || [],
    contentType: formData.contentType || null
  })

  // Direct insert with type casting to bypass strict typing
  const { data, error } = await (supabase.from('content_pillars') as any)
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: metadata,
      is_active: true,
      sort_order: count || 0,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Parse back the metadata
  if (data) {
    try {
      const meta = JSON.parse(data.icon || '{}')
      data.hashtags = meta.hashtags || []
      data.contentType = meta.contentType || null
    } catch {
      data.hashtags = []
      data.contentType = null
    }
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
    hashtags?: string[]
    contentType?: string | null
  }
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Store hashtags and content type in the icon field as JSON
  const metadata = JSON.stringify({
    hashtags: formData.hashtags || [],
    contentType: formData.contentType || null
  })

  const { error } = await (supabase.from('content_pillars') as any)
    .update({
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: metadata,
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
