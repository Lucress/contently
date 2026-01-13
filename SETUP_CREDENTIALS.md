# How to Get All Required Credentials

## 1. Supabase Credentials ✅ (You Already Have)

**Your Supabase Project:** `mfukaceddufuatdourvd.supabase.co`

### Where to Find:
1. Go to: https://supabase.com/dashboard/project/mfukaceddufuatdourvd/settings/api
2. Copy these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mfukaceddufuatdourvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (find in "Project API keys" → anon/public)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (find in "Project API keys" → service_role - keep secret!)
```

---

## 2. Google OAuth (Gmail Integration) 🔑

### Step-by-Step Setup:

#### A. Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: `Contently`
4. Click "Create"

#### B. Enable Gmail API
1. In your project, go to: https://console.cloud.google.com/apis/library
2. Search for "Gmail API"
3. Click "Gmail API"
4. Click "Enable"

#### C. Configure OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Select "External" (unless you have Google Workspace)
3. Click "Create"
4. Fill in:
   - **App name:** Contently
   - **User support email:** your email
   - **Developer contact:** your email
5. Click "Save and Continue"
6. **Scopes:** Click "Add or Remove Scopes"
   - Search for: `gmail.readonly`
   - Check: `https://www.googleapis.com/auth/gmail.readonly`
   - Click "Update" → "Save and Continue"
7. **Test users:** Add your email for testing
8. Click "Save and Continue"

#### D. Create OAuth Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Contently Web`
5. **Authorized redirect URIs** - Add these:
   ```
   http://localhost:3002/auth/callback
   https://contentlyapp.com/auth/callback
   https://www.contentlyapp.com/auth/callback
   ```
6. Click "Create"
7. **Copy these values:**

```env
GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz...
GOOGLE_GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly
```

---

## 3. Stripe (Payment Processing) 💳

### Step-by-Step Setup:

#### A. Create Stripe Account
1. Go to: https://stripe.com
2. Sign up for an account
3. Verify your email

#### B. Get API Keys
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy these values:

```env
# For testing (starts with pk_test_ and sk_test_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
```

**For production:**
1. Toggle to "Live mode" in Stripe Dashboard
2. Copy the live keys (pk_live_ and sk_live_)

#### C. Create Products & Prices
1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add product"

**Product 1: Pro Plan**
- Name: `Pro`
- Description: `Pro plan for content creators`
- Pricing: Set your price (e.g., $29/month)
- Click "Save product"
- Copy the **Price ID** (starts with `price_...`)

**Product 2: Creator Plus Plan**
- Name: `Creator Plus`
- Description: `Creator Plus plan with advanced features`
- Pricing: Set your price (e.g., $79/month)
- Click "Save product"
- Copy the **Price ID**

```env
STRIPE_PRICE_ID_PRO=price_1ABC123...
STRIPE_PRICE_ID_CREATOR_PLUS=price_1XYZ789...
```

#### D. Setup Webhooks (After Deploying to Vercel)
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://contentlyapp.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret**:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

---

## 4. Email Encryption Key 🔐

Generate a random 32-byte encryption key for securing email credentials:

### On Mac/Linux:
```bash
openssl rand -hex 32
```

### On Windows (PowerShell):
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.BitConverter]::ToString($bytes).Replace("-","").ToLower()
```

Copy the output:
```env
EMAIL_ENCRYPTION_KEY=a1b2c3d4e5f6...64characters...
```

---

## 5. App URL 🌐

```env
# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3002

# For production (after deploying to Vercel)
NEXT_PUBLIC_APP_URL=https://contentlyapp.com
```

---

## Complete .env.local File

Create a file named `.env.local` in your project root with all these values:

```env
# ===================
# SUPABASE
# ===================
NEXT_PUBLIC_SUPABASE_URL=https://mfukaceddufuatdourvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# ===================
# STRIPE
# ===================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_PRO=price_your-pro-price-id
STRIPE_PRICE_ID_CREATOR_PLUS=price_your-creator-plus-price-id

# ===================
# GOOGLE OAUTH (Gmail)
# ===================
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly

# ===================
# EMAIL ENCRYPTION
# ===================
EMAIL_ENCRYPTION_KEY=your-64-character-hex-key

# ===================
# APP CONFIG
# ===================
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

---

## For Vercel Deployment

After getting all credentials:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add each variable with its value
4. Make sure to set them for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## Testing Locally

After creating `.env.local`:

```bash
# Restart your dev server
npm run dev -- -p 3002
```

Visit: http://localhost:3002

---

## Quick Checklist

- [ ] Supabase credentials copied
- [ ] Google Cloud project created
- [ ] Gmail API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Stripe account created
- [ ] Stripe API keys copied
- [ ] Stripe products & prices created
- [ ] Email encryption key generated
- [ ] `.env.local` file created
- [ ] Dev server running successfully
- [ ] Ready to deploy to Vercel!

---

## Need Help?

- **Supabase:** https://supabase.com/docs
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
- **Stripe:** https://stripe.com/docs
- **Vercel:** https://vercel.com/docs
