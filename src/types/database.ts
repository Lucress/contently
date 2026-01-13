export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'pro' | 'creator_plus'
          status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused'
          price_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'pro' | 'creator_plus'
          status?: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused'
          price_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'pro' | 'creator_plus'
          status?: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused'
          price_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      content_pillars: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          icon: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          icon?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          pillar_id: string | null
          name: string
          description: string | null
          color: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pillar_id?: string | null
          name: string
          description?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pillar_id?: string | null
          name?: string
          description?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      filming_setups: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          location: string | null
          orientation: 'portrait' | 'landscape' | 'square'
          distance: 'close_up' | 'medium' | 'wide' | 'full_body'
          microphone: 'lav' | 'shotgun' | 'internal' | 'wireless' | 'none'
          lighting_notes: string | null
          camera_settings: string | null
          checklist: Json
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          location?: string | null
          orientation?: 'portrait' | 'landscape' | 'square'
          distance?: 'close_up' | 'medium' | 'wide' | 'full_body'
          microphone?: 'lav' | 'shotgun' | 'internal' | 'wireless' | 'none'
          lighting_notes?: string | null
          camera_settings?: string | null
          checklist?: Json
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          location?: string | null
          orientation?: 'portrait' | 'landscape' | 'square'
          distance?: 'close_up' | 'medium' | 'wide' | 'full_body'
          microphone?: 'lav' | 'shotgun' | 'internal' | 'wireless' | 'none'
          lighting_notes?: string | null
          camera_settings?: string | null
          checklist?: Json
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      hashtag_groups: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      hashtags: {
        Row: {
          id: string
          user_id: string
          group_id: string | null
          tag: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          group_id?: string | null
          tag: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          group_id?: string | null
          tag?: string
          usage_count?: number
          created_at?: string
        }
      }
      content_types: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string
          color: string
          default_structure: Json
          default_cta: string | null
          default_hashtags: string[] | null
          default_filming_setup_id: string | null
          estimated_filming_minutes: number
          estimated_editing_minutes: number
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string
          color?: string
          default_structure?: Json
          default_cta?: string | null
          default_hashtags?: string[] | null
          default_filming_setup_id?: string | null
          estimated_filming_minutes?: number
          estimated_editing_minutes?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string
          color?: string
          default_structure?: Json
          default_cta?: string | null
          default_hashtags?: string[] | null
          default_filming_setup_id?: string | null
          estimated_filming_minutes?: number
          estimated_editing_minutes?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      inspirations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          source: 'manual' | 'email' | 'social' | 'conversation' | 'article' | 'other'
          source_url: string | null
          source_author: string | null
          notes: string | null
          tags: string[] | null
          is_processed: boolean
          converted_to_idea_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          source?: 'manual' | 'email' | 'social' | 'conversation' | 'article' | 'other'
          source_url?: string | null
          source_author?: string | null
          notes?: string | null
          tags?: string[] | null
          is_processed?: boolean
          converted_to_idea_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          source?: 'manual' | 'email' | 'social' | 'conversation' | 'article' | 'other'
          source_url?: string | null
          source_author?: string | null
          notes?: string | null
          tags?: string[] | null
          is_processed?: boolean
          converted_to_idea_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          hook: string | null
          description: string | null
          script_text: string | null
          pillar_id: string | null
          category_id: string | null
          content_type_id: string | null
          status: 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'
          priority: number
          cta: string | null
          hashtags: string[] | null
          platforms: ('tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other')[]
          filming_setup_id: string | null
          filming_date: string | null
          filming_notes: string | null
          is_filmed: boolean
          filmed_at: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          published_at: string | null
          published_url: string | null
          is_sponsored: boolean
          deal_id: string | null
          inspiration_id: string | null
          views_count: number
          likes_count: number
          comments_count: number
          shares_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          hook?: string | null
          description?: string | null
          script_text?: string | null
          pillar_id?: string | null
          category_id?: string | null
          content_type_id?: string | null
          status?: 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'
          priority?: number
          cta?: string | null
          hashtags?: string[] | null
          platforms?: ('tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other')[]
          filming_setup_id?: string | null
          filming_date?: string | null
          filming_notes?: string | null
          is_filmed?: boolean
          filmed_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          published_at?: string | null
          published_url?: string | null
          is_sponsored?: boolean
          deal_id?: string | null
          inspiration_id?: string | null
          views_count?: number
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          hook?: string | null
          description?: string | null
          script_text?: string | null
          pillar_id?: string | null
          category_id?: string | null
          content_type_id?: string | null
          status?: 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'
          priority?: number
          cta?: string | null
          hashtags?: string[] | null
          platforms?: ('tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other')[]
          filming_setup_id?: string | null
          filming_date?: string | null
          filming_notes?: string | null
          is_filmed?: boolean
          filmed_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          published_at?: string | null
          published_url?: string | null
          is_sponsored?: boolean
          deal_id?: string | null
          inspiration_id?: string | null
          views_count?: number
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      script_blocks: {
        Row: {
          id: string
          user_id: string
          idea_id: string
          block_type: 'hook' | 'intro' | 'main' | 'transition' | 'cta' | 'outro' | 'custom'
          title: string | null
          content: string
          duration_seconds: number | null
          sort_order: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id: string
          block_type?: 'hook' | 'intro' | 'main' | 'transition' | 'cta' | 'outro' | 'custom'
          title?: string | null
          content: string
          duration_seconds?: number | null
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string
          block_type?: 'hook' | 'intro' | 'main' | 'transition' | 'cta' | 'outro' | 'custom'
          title?: string | null
          content?: string
          duration_seconds?: number | null
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      broll_items: {
        Row: {
          id: string
          user_id: string
          idea_id: string
          script_block_id: string | null
          description: string
          status: 'needed' | 'filmed' | 'found' | 'edited'
          source_url: string | null
          duration_seconds: number | null
          sort_order: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id: string
          script_block_id?: string | null
          description: string
          status?: 'needed' | 'filmed' | 'found' | 'edited'
          source_url?: string | null
          duration_seconds?: number | null
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string
          script_block_id?: string | null
          description?: string
          status?: 'needed' | 'filmed' | 'found' | 'edited'
          source_url?: string | null
          duration_seconds?: number | null
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      planner_items: {
        Row: {
          id: string
          user_id: string
          idea_id: string | null
          deal_id: string | null
          item_type: 'filming' | 'editing' | 'publishing' | 'task' | 'meeting' | 'other'
          title: string
          description: string | null
          date: string
          start_time: string | null
          end_time: string | null
          all_day: boolean
          is_completed: boolean
          completed_at: string | null
          is_recurring: boolean
          recurrence_rule: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id?: string | null
          deal_id?: string | null
          item_type?: 'filming' | 'editing' | 'publishing' | 'task' | 'meeting' | 'other'
          title: string
          description?: string | null
          date: string
          start_time?: string | null
          end_time?: string | null
          all_day?: boolean
          is_completed?: boolean
          completed_at?: string | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string | null
          deal_id?: string | null
          item_type?: 'filming' | 'editing' | 'publishing' | 'task' | 'meeting' | 'other'
          title?: string
          description?: string | null
          date?: string
          start_time?: string | null
          end_time?: string | null
          all_day?: boolean
          is_completed?: boolean
          completed_at?: string | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          website: string | null
          industry: string | null
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_role: string | null
          status: 'prospect' | 'contacted' | 'in_discussion' | 'active' | 'past' | 'blacklisted'
          instagram_handle: string | null
          tiktok_handle: string | null
          linkedin_url: string | null
          notes: string | null
          tags: string[] | null
          total_deals: number
          total_revenue: number
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          website?: string | null
          industry?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          status?: 'prospect' | 'contacted' | 'in_discussion' | 'active' | 'past' | 'blacklisted'
          instagram_handle?: string | null
          tiktok_handle?: string | null
          linkedin_url?: string | null
          notes?: string | null
          tags?: string[] | null
          total_deals?: number
          total_revenue?: number
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          website?: string | null
          industry?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          status?: 'prospect' | 'contacted' | 'in_discussion' | 'active' | 'past' | 'blacklisted'
          instagram_handle?: string | null
          tiktok_handle?: string | null
          linkedin_url?: string | null
          notes?: string | null
          tags?: string[] | null
          total_deals?: number
          total_revenue?: number
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          user_id: string
          brand_id: string
          title: string
          description: string | null
          deal_type: 'sponsored_post' | 'ugc' | 'affiliate' | 'ambassador' | 'gifted' | 'other'
          status: 'lead' | 'contacted' | 'negotiating' | 'proposal_sent' | 'accepted' | 'in_progress' | 'delivered' | 'invoiced' | 'paid' | 'completed' | 'lost' | 'cancelled'
          deliverables: Json
          deliverables_count: number
          start_date: string | null
          end_date: string | null
          deadline: string | null
          budget: number | null
          currency: string
          payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          payment_terms: string | null
          invoice_number: string | null
          paid_amount: number
          paid_at: string | null
          contract_url: string | null
          contract_signed: boolean
          contract_signed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id: string
          title: string
          description?: string | null
          deal_type?: 'sponsored_post' | 'ugc' | 'affiliate' | 'ambassador' | 'gifted' | 'other'
          status?: 'lead' | 'contacted' | 'negotiating' | 'proposal_sent' | 'accepted' | 'in_progress' | 'delivered' | 'invoiced' | 'paid' | 'completed' | 'lost' | 'cancelled'
          deliverables?: Json
          deliverables_count?: number
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          budget?: number | null
          currency?: string
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          payment_terms?: string | null
          invoice_number?: string | null
          paid_amount?: number
          paid_at?: string | null
          contract_url?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string
          title?: string
          description?: string | null
          deal_type?: 'sponsored_post' | 'ugc' | 'affiliate' | 'ambassador' | 'gifted' | 'other'
          status?: 'lead' | 'contacted' | 'negotiating' | 'proposal_sent' | 'accepted' | 'in_progress' | 'delivered' | 'invoiced' | 'paid' | 'completed' | 'lost' | 'cancelled'
          deliverables?: Json
          deliverables_count?: number
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          budget?: number | null
          currency?: string
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          payment_terms?: string | null
          invoice_number?: string | null
          paid_amount?: number
          paid_at?: string | null
          contract_url?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          idea_id: string | null
          deal_id: string | null
          brand_id: string | null
          email_id: string | null
          title: string
          description: string | null
          task_type: 'respond' | 'follow_up' | 'filming' | 'editing' | 'review' | 'payment' | 'meeting' | 'other'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          due_time: string | null
          reminder_at: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id?: string | null
          deal_id?: string | null
          brand_id?: string | null
          email_id?: string | null
          title: string
          description?: string | null
          task_type?: 'respond' | 'follow_up' | 'filming' | 'editing' | 'review' | 'payment' | 'meeting' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          due_time?: string | null
          reminder_at?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string | null
          deal_id?: string | null
          brand_id?: string | null
          email_id?: string | null
          title?: string
          description?: string | null
          task_type?: 'respond' | 'follow_up' | 'filming' | 'editing' | 'review' | 'payment' | 'meeting' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          due_time?: string | null
          reminder_at?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_accounts: {
        Row: {
          id: string
          user_id: string
          email_address: string
          provider: 'gmail' | 'imap'
          display_name: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          google_token_expires_at: string | null
          imap_host: string | null
          imap_port: number
          imap_username: string | null
          imap_password_encrypted: string | null
          imap_use_tls: boolean
          last_sync_at: string | null
          sync_enabled: boolean
          sync_error: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_address: string
          provider: 'gmail' | 'imap'
          display_name?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expires_at?: string | null
          imap_host?: string | null
          imap_port?: number
          imap_username?: string | null
          imap_password_encrypted?: string | null
          imap_use_tls?: boolean
          last_sync_at?: string | null
          sync_enabled?: boolean
          sync_error?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_address?: string
          provider?: 'gmail' | 'imap'
          display_name?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expires_at?: string | null
          imap_host?: string | null
          imap_port?: number
          imap_username?: string | null
          imap_password_encrypted?: string | null
          imap_use_tls?: boolean
          last_sync_at?: string | null
          sync_enabled?: boolean
          sync_error?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      email_messages: {
        Row: {
          id: string
          user_id: string
          email_account_id: string
          message_id: string
          thread_id: string | null
          from_email: string
          from_name: string | null
          to_emails: string[] | null
          cc_emails: string[] | null
          subject: string | null
          snippet: string | null
          body_text: string | null
          body_html: string | null
          is_read: boolean
          is_starred: boolean
          is_archived: boolean
          brand_id: string | null
          deal_id: string | null
          labels: string[] | null
          folder: string | null
          received_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_account_id: string
          message_id: string
          thread_id?: string | null
          from_email: string
          from_name?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          subject?: string | null
          snippet?: string | null
          body_text?: string | null
          body_html?: string | null
          is_read?: boolean
          is_starred?: boolean
          is_archived?: boolean
          brand_id?: string | null
          deal_id?: string | null
          labels?: string[] | null
          folder?: string | null
          received_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_account_id?: string
          message_id?: string
          thread_id?: string | null
          from_email?: string
          from_name?: string | null
          to_emails?: string[] | null
          cc_emails?: string[] | null
          subject?: string | null
          snippet?: string | null
          body_text?: string | null
          body_html?: string | null
          is_read?: boolean
          is_starred?: boolean
          is_archived?: boolean
          brand_id?: string | null
          deal_id?: string | null
          labels?: string[] | null
          folder?: string | null
          received_at?: string
          created_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          subject: string | null
          body: string
          category: string | null
          variables: string[] | null
          is_active: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          subject?: string | null
          body: string
          category?: string | null
          variables?: string[] | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          subject?: string | null
          body?: string
          category?: string | null
          variables?: string[] | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      revenues: {
        Row: {
          id: string
          user_id: string
          deal_id: string | null
          brand_id: string | null
          source: 'sponsorship' | 'ugc' | 'affiliate' | 'adsense' | 'product' | 'service' | 'other'
          description: string | null
          amount: number
          currency: string
          date: string
          is_received: boolean
          received_at: string | null
          payment_method: string | null
          invoice_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deal_id?: string | null
          brand_id?: string | null
          source: 'sponsorship' | 'ugc' | 'affiliate' | 'adsense' | 'product' | 'service' | 'other'
          description?: string | null
          amount: number
          currency?: string
          date: string
          is_received?: boolean
          received_at?: string | null
          payment_method?: string | null
          invoice_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deal_id?: string | null
          brand_id?: string | null
          source?: 'sponsorship' | 'ugc' | 'affiliate' | 'adsense' | 'product' | 'service' | 'other'
          description?: string | null
          amount?: number
          currency?: string
          date?: string
          is_received?: boolean
          received_at?: string | null
          payment_method?: string | null
          invoice_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_snapshots: {
        Row: {
          id: string
          user_id: string
          idea_id: string | null
          platform: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other' | null
          views: number
          likes: number
          comments: number
          shares: number
          saves: number
          watch_time_seconds: number
          snapshot_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id?: string | null
          platform?: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other' | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          watch_time_seconds?: number
          snapshot_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string | null
          platform?: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other' | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          watch_time_seconds?: number
          snapshot_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused'
      subscription_plan: 'free' | 'pro' | 'creator_plus'
      camera_orientation: 'portrait' | 'landscape' | 'square'
      camera_distance: 'close_up' | 'medium' | 'wide' | 'full_body'
      microphone_type: 'lav' | 'shotgun' | 'internal' | 'wireless' | 'none'
      inspiration_source: 'manual' | 'email' | 'social' | 'conversation' | 'article' | 'other'
      idea_status: 'draft' | 'scripted' | 'planned' | 'to_film' | 'filmed' | 'editing' | 'scheduled' | 'published' | 'archived'
      content_platform: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'youtube' | 'linkedin' | 'twitter' | 'other'
      block_type: 'hook' | 'intro' | 'main' | 'transition' | 'cta' | 'outro' | 'custom'
      broll_status: 'needed' | 'filmed' | 'found' | 'edited'
      planner_item_type: 'filming' | 'editing' | 'publishing' | 'task' | 'meeting' | 'other'
      brand_status: 'prospect' | 'contacted' | 'in_discussion' | 'active' | 'past' | 'blacklisted'
      deal_status: 'lead' | 'contacted' | 'negotiating' | 'proposal_sent' | 'accepted' | 'in_progress' | 'delivered' | 'invoiced' | 'paid' | 'completed' | 'lost' | 'cancelled'
      deal_type: 'sponsored_post' | 'ugc' | 'affiliate' | 'ambassador' | 'gifted' | 'other'
      payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
      task_type: 'respond' | 'follow_up' | 'filming' | 'editing' | 'review' | 'payment' | 'meeting' | 'other'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      email_provider: 'gmail' | 'imap'
      revenue_source: 'sponsorship' | 'ugc' | 'affiliate' | 'adsense' | 'product' | 'service' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
