import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient, createUntypedServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accountId, to, subject, body } = await request.json()

    if (!accountId || !to || !subject) {
      return NextResponse.json({ error: 'accountId, to, and subject are required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Only IMAP/SMTP accounts support sending' }, { status: 400 })
    }

    const credentials = account.credentials as { username: string; password: string }

    const transporter = nodemailer.createTransport({
      host: account.smtp_host,
      port: account.smtp_port || 587,
      secure: account.smtp_port === 465,
      auth: {
        user: credentials.username,
        pass: credentials.password,
      },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: account.email_address,
      to,
      subject,
      text: body,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
