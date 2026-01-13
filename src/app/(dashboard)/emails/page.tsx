import { createClient } from '@/lib/supabase/server'
import { EmailHubContent } from './email-hub-content'

export default async function EmailHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch email accounts
  const { data: emailAccounts } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')

  // Fetch recent emails
  const { data: emails } = await supabase
    .from('email_messages')
    .select(`
      *,
      account:email_accounts(id, email_address, provider)
    `)
    .eq('user_id', user.id)
    .order('received_at', { ascending: false })
    .limit(50)

  // Fetch email templates
  const { data: templates } = await supabase
    .from('email_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  // Fetch brands for linking
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  return (
    <EmailHubContent 
      emailAccounts={emailAccounts || []}
      emails={emails || []}
      templates={templates || []}
      brands={brands || []}
      userId={user.id}
    />
  )
}
