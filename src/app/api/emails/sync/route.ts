import { NextRequest, NextResponse } from 'next/server'
import { ImapFlow } from 'imapflow'
import { createClient, createUntypedServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  let client: ImapFlow | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 })
    }

    const db = await createUntypedServerClient()
    const { data: account, error: accountError } = await db
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Email account not found' }, { status: 404 })
    }

    if (account.provider !== 'imap') {
      return NextResponse.json({ error: 'Only IMAP accounts support sync' }, { status: 400 })
    }

    const credentials = account.credentials as { username: string; password: string }

    client = new ImapFlow({
      host: account.imap_host,
      port: account.imap_port || 993,
      secure: (account.imap_port || 993) !== 143,
      auth: {
        user: credentials.username,
        pass: credentials.password,
      },
      logger: false,
      tls: { rejectUnauthorized: false },
    })

    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    const newMessages: any[] = []

    try {
      const mailbox = client.mailbox as { exists?: number } | false
      const total = (mailbox && mailbox.exists) ? mailbox.exists : 0
      const start = Math.max(1, total - 49)

      if (total > 0) {
        for await (const msg of client.fetch(`${start}:*`, {
          uid: true,
          envelope: true,
          flags: true,
        })) {
          const envelope = msg.envelope
          const messageId = envelope?.messageId || `imap-${account.id}-${msg.uid}`

          const { count } = await db
            .from('email_messages')
            .select('*', { count: 'exact', head: true })
            .eq('email_account_id', accountId)
            .eq('message_id', messageId)

          if ((count ?? 0) > 0) continue

          newMessages.push({
            user_id: user.id,
            email_account_id: accountId,
            message_id: messageId,
            subject: envelope?.subject || '(no subject)',
            from_email: envelope?.from?.[0]?.address || '',
            to_emails: envelope?.to?.map((a: any) => a.address) || [],
            body_text: '',
            snippet: `From: ${envelope?.from?.[0]?.address || ''}`,
            folder: 'inbox',
            is_read: msg.flags?.has('\\Seen') ?? false,
            received_at: envelope?.date?.toISOString() ?? new Date().toISOString(),
          })
        }
      }
    } finally {
      lock.release()
    }

    await client.logout()
    client = null

    if (newMessages.length > 0) {
      await db.from('email_messages').insert(newMessages)
    }

    return NextResponse.json({ synced: newMessages.length })
  } catch (error: any) {
    console.error('Email sync error:', error)
    if (client) {
      try { await client.logout() } catch {}
    }
    return NextResponse.json(
      { error: error.message || 'Failed to sync emails' },
      { status: 500 }
    )
  }
}
