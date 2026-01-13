import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { IdeaDetailContent } from '.'

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch idea with all related data
  const { data: idea, error } = await supabase
    .from('ideas')
    .select(`
      *,
      content_pillar:content_pillars(id, name, color),
      category:categories(id, name),
      content_type:content_types(id, name, icon),
      filming_setup:filming_setups(id, name, description),
      inspiration:inspirations(id, source_url, source_platform, notes)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !idea) {
    notFound()
  }

  // Fetch script blocks
  const { data: scriptBlocks } = await supabase
    .from('script_blocks')
    .select('*')
    .eq('idea_id', id)
    .order('order_index')

  // Fetch b-roll items
  const { data: brollItems } = await supabase
    .from('broll_items')
    .select('*')
    .eq('idea_id', id)
    .order('order_index')

  // Fetch idea hashtags
  const { data: ideaHashtags } = await supabase
    .from('idea_hashtags')
    .select('hashtag_id, hashtags(id, name)')
    .eq('idea_id', id)

  // Fetch all hashtags for editing
  const { data: allHashtags } = await supabase
    .from('hashtags')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  // Transform idea hashtags to the expected format
  const transformedHashtags = ideaHashtags?.map((ih: any) => ih.hashtags).filter(Boolean) || []

  return (
    <IdeaDetailContent 
      idea={idea}
      scriptBlocks={scriptBlocks || []}
      brollItems={brollItems || []}
      ideaHashtags={transformedHashtags}
      allHashtags={allHashtags || []}
      userId={user.id}
    />
  )
}
