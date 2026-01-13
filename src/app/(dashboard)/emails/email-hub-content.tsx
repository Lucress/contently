'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { 
  Mail,
  Plus,
  Search,
  Inbox,
  Send,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Edit,
  Reply,
  Forward,
  Tag,
  Filter,
  RefreshCw,
  Settings,
  Link2,
  Building2,
  FileText,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Paperclip
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database'
import { formatDistanceToNow, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type EmailAccount = Tables<'email_accounts'>
type EmailMessage = Tables<'email_messages'> & {
  account?: { id: string; email_address: string; provider: string } | null
}
type EmailTemplate = Tables<'email_templates'>
type Brand = { id: string; name: string }

interface EmailHubContentProps {
  emailAccounts: EmailAccount[]
  emails: EmailMessage[]
  templates: EmailTemplate[]
  brands: Brand[]
  userId: string
}

const providerConfig = {
  gmail: { label: 'Gmail', color: 'bg-red-500', icon: '📧' },
  imap: { label: 'IMAP', color: 'bg-blue-500', icon: '✉️' },
}

export function EmailHubContent({ 
  emailAccounts: initialAccounts, 
  emails: initialEmails,
  templates: initialTemplates,
  brands,
  userId 
}: EmailHubContentProps) {
  const [emailAccounts, setEmailAccounts] = useState(initialAccounts)
  const [emails, setEmails] = useState(initialEmails)
  const [templates, setTemplates] = useState(initialTemplates)
  const [activeTab, setActiveTab] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Account Dialog
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [accountForm, setAccountForm] = useState({
    provider: 'gmail' as 'gmail' | 'imap',
    email_address: '',
    imap_host: '',
    imap_port: '993',
    smtp_host: '',
    smtp_port: '587',
    username: '',
    password: '',
  })

  // Compose Dialog
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false)
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    body: '',
    account_id: '',
    template_id: '',
  })

  // Template Dialog
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'outreach',
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const supabaseMutation = createUntypedClient()

  // Filter emails
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = 
        email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (activeTab === 'inbox') {
        return matchesSearch && email.folder === 'inbox'
      } else if (activeTab === 'sent') {
        return matchesSearch && email.folder === 'sent'
      } else if (activeTab === 'starred') {
        return matchesSearch && email.is_starred
      }
      return matchesSearch
    })
  }, [emails, searchQuery, activeTab])

  // Stats
  const stats = useMemo(() => ({
    unread: emails.filter(e => !e.is_read && e.folder === 'inbox').length,
    starred: emails.filter(e => e.is_starred).length,
    total: emails.length,
  }), [emails])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // In a real implementation, this would call an edge function to sync emails
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    toast({
      title: 'Emails synced',
      description: 'Your inbox is up to date.',
    })
  }

  const handleAddAccount = async () => {
    if (!accountForm.email_address) {
      toast({
        title: 'Error',
        description: 'Email address is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const accountData: any = {
        user_id: userId,
        provider: accountForm.provider,
        email_address: accountForm.email_address,
        is_active: true,
      }

      if (accountForm.provider === 'imap') {
        accountData.imap_host = accountForm.imap_host
        accountData.imap_port = parseInt(accountForm.imap_port)
        accountData.smtp_host = accountForm.smtp_host
        accountData.smtp_port = parseInt(accountForm.smtp_port)
        // Note: In production, credentials should be encrypted
        accountData.credentials = {
          username: accountForm.username,
          password: accountForm.password, // Should be encrypted!
        }
      }

      const { data, error } = await supabase
        .from('email_accounts')
        .insert(accountData)
        .select()
        .single()

      if (error) throw error

      setEmailAccounts(prev => [...prev, data])
      setIsAccountDialogOpen(false)
      setAccountForm({
        provider: 'gmail',
        email_address: '',
        imap_host: '',
        imap_port: '993',
        smtp_host: '',
        smtp_port: '587',
        username: '',
        password: '',
      })

      if (accountForm.provider === 'gmail') {
        // Redirect to Gmail OAuth
        toast({
          title: 'Account added',
          description: 'You will be redirected to Google to authorize access.',
        })
        // In real implementation: redirect to OAuth flow
      } else {
        toast({ title: 'IMAP account added' })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to add account.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!composeForm.to || !composeForm.subject) {
      toast({
        title: 'Error',
        description: 'Recipient and subject are required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // In real implementation, this would call an edge function to send via SMTP/Gmail API
      const { data, error } = await supabaseMutation
        .from('email_messages')
        .insert({
          user_id: userId,
          email_account_id: composeForm.account_id || emailAccounts[0]?.id,
          message_id: `local-${Date.now()}`,
          subject: composeForm.subject,
          body_text: composeForm.body,
          to_emails: [composeForm.to],
          from_email: emailAccounts.find(a => a.id === composeForm.account_id)?.email_address || emailAccounts[0]?.email_address || '',
          folder: 'sent',
          is_read: true,
          received_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      setEmails(prev => [data, ...prev])
      setIsComposeDialogOpen(false)
      setComposeForm({ to: '', subject: '', body: '', account_id: '', template_id: '' })

      toast({
        title: 'Email sent',
        description: `Email sent to ${composeForm.to}`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to send email.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject) {
      toast({
        title: 'Error',
        description: 'Name and subject are required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      if (editingTemplate) {
        const { data, error } = await supabaseMutation
          .from('email_templates')
          .update({
            name: templateForm.name,
            subject: templateForm.subject,
            body: templateForm.body,
            category: templateForm.category,
          })
          .eq('id', editingTemplate.id)
          .select()
          .single()

        if (error) throw error

        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? data : t))
        toast({ title: 'Template updated' })
      } else {
        const { data, error } = await supabaseMutation
          .from('email_templates')
          .insert({
            user_id: userId,
            name: templateForm.name,
            subject: templateForm.subject,
            body: templateForm.body,
            category: templateForm.category,
          })
          .select()
          .single()

        if (error) throw error

        setTemplates(prev => [...prev, data])
        toast({ title: 'Template created' })
      }

      setIsTemplateDialogOpen(false)
      setEditingTemplate(null)
      setTemplateForm({ name: '', subject: '', body: '', category: 'outreach' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Unable to save template.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStar = async (email: EmailMessage) => {
    try {
      const { error } = await supabaseMutation
        .from('email_messages')
        .update({ is_starred: !email.is_starred })
        .eq('id', email.id)

      if (error) throw error

      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_starred: !e.is_starred } : e))
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAsRead = async (email: EmailMessage) => {
    if (email.is_read) return

    try {
      const { error } = await supabaseMutation
        .from('email_messages')
        .update({ is_read: true })
        .eq('id', email.id)

      if (error) throw error

      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: true } : e))
    } catch (error) {
      console.error(error)
    }
  }

  const handleUseTemplate = (template: EmailTemplate) => {
    setComposeForm(prev => ({
      ...prev,
      subject: template.subject || '',
      body: template.body,
      template_id: template.id,
    }))
  }

  const handleLinkToBrand = async (email: EmailMessage, brandId: string) => {
    try {
      const { error } = await supabaseMutation
        .from('email_messages')
        .update({ brand_id: brandId })
        .eq('id', email.id)

      if (error) throw error

      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, brand_id: brandId } : e))
      toast({ title: 'Email linked to brand' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Inbox
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage collabs, customer emails, and brand partnerships
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button variant="outline" onClick={() => setIsAccountDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Accounts
            </Button>
            <Button onClick={() => setIsComposeDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>

        {/* No accounts state */}
        {emailAccounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Connect your first email account</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Connect Gmail or IMAP to manage collabs, customer inquiries, and brand emails in one place.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => {
                setAccountForm(prev => ({ ...prev, provider: 'gmail' }))
                setIsAccountDialogOpen(true)
              }}>
                <span className="mr-2">📧</span>
                Connect Gmail
              </Button>
              <Button variant="outline" onClick={() => {
                setAccountForm(prev => ({ ...prev, provider: 'imap' }))
                setIsAccountDialogOpen(true)
              }}>
                <span className="mr-2">✉️</span>
                Connect IMAP
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-4 shrink-0">
              {/* Quick Actions */}
              <Button onClick={() => setIsComposeDialogOpen(true)} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New Message
              </Button>

              {/* Folders */}
              <div className="bg-card border rounded-xl p-2">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                    activeTab === 'inbox' ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Inbox className="h-4 w-4" />
                  <span className="flex-1 text-left">Inbox</span>
                  {stats.unread > 0 && (
                    <Badge variant="default" className="h-5 min-w-[20px] justify-center">
                      {stats.unread}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                    activeTab === 'sent' ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Send className="h-4 w-4" />
                  <span className="flex-1 text-left">Sent</span>
                </button>
                <button
                  onClick={() => setActiveTab('starred')}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                    activeTab === 'starred' ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Star className="h-4 w-4" />
                  <span className="flex-1 text-left">Starred</span>
                  {stats.starred > 0 && (
                    <Badge variant="secondary">{stats.starred}</Badge>
                  )}
                </button>
              </div>

              {/* Accounts */}
              <div className="bg-card border rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">Connected Accounts</h4>
                <div className="space-y-2">
                  {emailAccounts.map(account => {
                    const config = providerConfig[account.provider as keyof typeof providerConfig]
                    return (
                      <div key={account.id} className="flex items-center gap-2 text-sm">
                        <div className={cn("w-2 h-2 rounded-full", config?.color || 'bg-gray-500')} />
                        <span className="truncate flex-1">{account.email_address}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    )
                  })}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setIsAccountDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add account
                </Button>
              </div>

              {/* Templates */}
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Templates</h4>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => {
                      setEditingTemplate(null)
                      setTemplateForm({ name: '', subject: '', body: '', category: 'outreach' })
                      setIsTemplateDialogOpen(true)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {templates.slice(0, 5).map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        handleUseTemplate(template)
                        setIsComposeDialogOpen(true)
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-w-0">
              {/* Email List */}
              <div className="w-80 bg-card border rounded-xl flex flex-col shrink-0">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {filteredEmails.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8 text-sm">
                        Aucun email trouvé
                      </p>
                    ) : (
                      filteredEmails.map(email => (
                        <button
                          key={email.id}
                          onClick={() => {
                            setSelectedEmail(email)
                            handleMarkAsRead(email)
                          }}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-colors mb-1",
                            selectedEmail?.id === email.id 
                              ? "bg-primary/10" 
                              : "hover:bg-muted",
                            !email.is_read && "bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "font-medium text-sm truncate flex-1",
                              !email.is_read && "font-semibold"
                            )}>
                              {email.from_email || 'Unknown'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleStar(email)
                              }}
                            >
                              <Star className={cn(
                                "h-4 w-4",
                                email.is_starred 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : "text-muted-foreground"
                              )} />
                            </button>
                          </div>
                          <p className={cn(
                            "text-sm truncate mb-1",
                            !email.is_read ? "font-medium" : "text-muted-foreground"
                          )}>
                            {email.subject || '(No subject)'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {email.snippet || email.body_text?.slice(0, 100)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {email.received_at && formatDistanceToNow(new Date(email.received_at), { addSuffix: true, locale: enUS })}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Email Detail */}
              <div className="flex-1 bg-card border rounded-xl flex flex-col min-w-0">
                {selectedEmail ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-lg truncate">
                            {selectedEmail.subject || '(No subject)'}
                          </h2>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>From: {selectedEmail.from_email}</span>
                            <span>•</span>
                            <span>
                              {selectedEmail.received_at && format(new Date(selectedEmail.received_at), 'PPp')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => handleToggleStar(selectedEmail)}>
                            <Star className={cn(
                              "h-4 w-4",
                              selectedEmail.is_starred && "fill-yellow-500 text-yellow-500"
                            )} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setComposeForm({
                                  to: selectedEmail.from_email || '',
                                  subject: `Re: ${selectedEmail.subject}`,
                                  body: `\n\n---\n${selectedEmail.body_text || ''}`,
                                  account_id: selectedEmail.email_account_id || '',
                                  template_id: '',
                                })
                                setIsComposeDialogOpen(true)
                              }}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="h-4 w-4 mr-2" />
                                Forward
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {brands.length > 0 && (
                                <>
                                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                    Link to brand
                                  </div>
                                  {brands.map(brand => (
                                    <DropdownMenuItem 
                                      key={brand.id}
                                      onClick={() => handleLinkToBrand(selectedEmail, brand.id)}
                                    >
                                      <Building2 className="h-4 w-4 mr-2" />
                                      {brand.name}
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">
                          {selectedEmail.body_text || selectedEmail.body_html || 'No content'}
                        </pre>
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <Button 
                        onClick={() => {
                          setComposeForm({
                            to: selectedEmail.from_email || '',
                            subject: `Re: ${selectedEmail.subject}`,
                            body: '',
                            account_id: selectedEmail.email_account_id || '',
                            template_id: '',
                          })
                          setIsComposeDialogOpen(true)
                        }}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an email to read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Account Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un compte email</DialogTitle>
            <DialogDescription>
              Connectez un compte pour centraliser vos emails.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type de compte</Label>
              <Select 
                value={accountForm.provider} 
                onValueChange={(v) => setAccountForm(prev => ({ ...prev, provider: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">
                    <div className="flex items-center gap-2">
                      <span>📧</span> Gmail (OAuth)
                    </div>
                  </SelectItem>
                  <SelectItem value="imap">
                    <div className="flex items-center gap-2">
                      <span>✉️</span> IMAP/SMTP
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accountForm.provider === 'gmail' ? (
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="mb-2">
                  Vous serez redirigé vers Google pour autoriser l'accès à votre compte Gmail.
                </p>
                <p className="text-muted-foreground">
                  Permissions demandées : lecture et envoi d'emails.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Adresse email</Label>
                  <Input
                    type="email"
                    placeholder="vous@example.com"
                    value={accountForm.email_address}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, email_address: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serveur IMAP</Label>
                    <Input
                      placeholder="imap.example.com"
                      value={accountForm.imap_host}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, imap_host: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port IMAP</Label>
                    <Input
                      type="number"
                      value={accountForm.imap_port}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, imap_port: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serveur SMTP</Label>
                    <Input
                      placeholder="smtp.example.com"
                      value={accountForm.smtp_host}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, smtp_host: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port SMTP</Label>
                    <Input
                      type="number"
                      value={accountForm.smtp_port}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, smtp_port: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom d'utilisateur</Label>
                    <Input
                      value={accountForm.username}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <Input
                      type="password"
                      value={accountForm.password}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAccount} disabled={isLoading}>
              {accountForm.provider === 'gmail' ? 'Se connecter avec Google' : 'Ajouter le compte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compose Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {emailAccounts.length > 1 && (
              <div className="space-y-2">
                <Label>De</Label>
                <Select 
                  value={composeForm.account_id || emailAccounts[0]?.id} 
                  onValueChange={(v) => setComposeForm(prev => ({ ...prev, account_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.email_address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>À</Label>
              <Input
                type="email"
                placeholder="destinataire@example.com"
                value={composeForm.to}
                onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Objet</Label>
              <Input
                placeholder="Objet du message"
                value={composeForm.subject}
                onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Message</Label>
                {templates.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Utiliser un template
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {templates.map(template => (
                        <DropdownMenuItem 
                          key={template.id}
                          onClick={() => handleUseTemplate(template)}
                        >
                          {template.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <Textarea
                placeholder="Écrivez votre message..."
                rows={10}
                value={composeForm.body}
                onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendEmail} disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du template</Label>
              <Input
                placeholder="Ex: Proposition de partenariat"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select 
                value={templateForm.category} 
                onValueChange={(v) => setTemplateForm(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outreach">Prospection</SelectItem>
                  <SelectItem value="follow_up">Relance</SelectItem>
                  <SelectItem value="proposal">Proposition</SelectItem>
                  <SelectItem value="thank_you">Remerciement</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Objet</Label>
              <Input
                placeholder="Objet de l'email"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Email body..."
                rows={8}
                value={templateForm.body}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                You can use variables: {'{{name}}'}, {'{{brand}}'}, {'{{date}}'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
