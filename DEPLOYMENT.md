# Contently - Vercel Deployment Guide

## Prerequisites

- GitHub account with your repository at: https://github.com/Lucress/contently
- Vercel account (sign up at https://vercel.com)
- Domain: contentlyapp.com
- Supabase project configured
- Stripe account for payments

## Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `Lucress/contently`
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

## Step 2: Configure Environment Variables

Add the following environment variables in Vercel Dashboard:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://mfukaceddufuatdourvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
```

### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe webhook config)
STRIPE_PRICE_ID_PRO=price_... (Pro plan price ID)
STRIPE_PRICE_ID_CREATOR_PLUS=price_... (Creator Plus price ID)
```

### Google OAuth (for Gmail integration)
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly
```

### Email Encryption
```
EMAIL_ENCRYPTION_KEY=your-32-byte-hex-key
```
Generate with: `openssl rand -hex 32`

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://contentlyapp.com
```

## Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (~2-3 minutes)
3. Your app will be available at a Vercel URL (e.g., `contently.vercel.app`)

## Step 4: Configure Custom Domain

1. In Vercel Dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your domain: `contentlyapp.com`
4. Add www subdomain: `www.contentlyapp.com`
5. Vercel will provide DNS records to configure:

### DNS Configuration
Add these records to your domain provider (e.g., Namecheap, GoDaddy, Cloudflare):

**For contentlyapp.com:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto or 300
```

**For www.contentlyapp.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 300
```

## Step 5: Configure Supabase

1. In Supabase Dashboard, go to Authentication → URL Configuration
2. Add your production URL to allowed redirect URLs:
   - `https://contentlyapp.com/auth/callback`
   - `https://www.contentlyapp.com/auth/callback`
3. Update Site URL to: `https://contentlyapp.com`

## Step 6: Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://contentlyapp.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

## Step 7: Test Deployment

1. Visit https://contentlyapp.com
2. Test authentication (sign up/login)
3. Test all pages:
   - Dashboard
   - Ideas
   - Planner
   - Production
   - CRM
   - Emails
   - Revenue
   - Settings
4. Test language switcher (English/French)
5. Test Stripe checkout (if configured)

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch → https://contentlyapp.com
- **Preview**: Pull requests → unique preview URLs

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Ensure no TypeScript errors: `npm run type-check`

### 404 Errors
- Check middleware.ts is properly configured
- Verify Supabase auth is working
- Check browser console for errors

### Stripe Webhook Issues
- Verify webhook secret is correct
- Check webhook endpoint is publicly accessible
- Review webhook logs in Stripe Dashboard

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies are properly configured
- Ensure service role key has proper permissions

## Production Checklist

- [ ] All environment variables configured
- [ ] Domain DNS configured and verified
- [ ] Supabase redirect URLs updated
- [ ] Stripe webhooks configured
- [ ] Test authentication flow
- [ ] Test all major features
- [ ] Monitor error logs in Vercel Dashboard
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure analytics (optional: Vercel Analytics)

## Commands

Deploy from CLI (optional):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs
- Stripe Webhooks: https://stripe.com/docs/webhooks
