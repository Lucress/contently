# Vercel Deployment Fix Applied ✅

## Issue
Build was failing with: `Error: supabaseUrl is required.`

## Root Cause
The Stripe webhook route was initializing Supabase client at module level, which runs during build time when environment variables aren't available yet.

## Fix Applied
Changed Supabase client initialization to lazy loading - it now only runs when the webhook endpoint is actually called at runtime, not during build.

## Next Steps

### 1. Add Environment Variables to Vercel

Go to your Vercel project: https://vercel.com/lucress/contently/settings/environment-variables

Add these variables for **Production, Preview, and Development**:

#### Required for Build to Succeed:
```
NEXT_PUBLIC_SUPABASE_URL=https://mfukaceddufuatdourvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
```

#### Required for Full Functionality:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_CREATOR_PLUS=price_...
EMAIL_ENCRYPTION_KEY=cfb03a971f7dcecc0f7cd3cb4612f52eaede7f42f39419de74995c1c026a95c9
NEXT_PUBLIC_APP_URL=https://contentlyapp.com
```

#### Optional (Gmail integration):
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly
```

### 2. Redeploy

After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Find the failed deployment
3. Click "Redeploy" or push a new commit

### 3. Where to Get Missing Values

#### Supabase Keys:
1. Go to: https://supabase.com/dashboard/project/mfukaceddufuatdourvd/settings/api
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

#### Stripe Keys:
See `SETUP_CREDENTIALS.md` for detailed instructions

## Verification

After successful deployment:
1. Visit your Vercel URL
2. Check the logs for any runtime errors
3. Test authentication flow
4. Verify all pages load correctly
