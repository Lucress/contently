# ⚠️ IMPORTANT: You Need PRICE IDs, Not Product IDs

You provided **Product IDs** (prod_...) but the app needs **Price IDs** (price_...).

## Here's How to Get the Price IDs:

### Step 1: Go to Stripe Dashboard
https://dashboard.stripe.com/products

### Step 2: Find Your Products

**Creator Plus Product:** `prod_Tmi2uc49Wbuhnm`
**Pro Product:** `prod_Tmi1Qpwe07zTuN`

### Step 3: Click on Each Product

For each product, you'll see a **Pricing** section with one or more prices.

### Step 4: Copy the Price ID

Each price will have an ID that starts with `price_` (e.g., `price_1ABC123xyz`)

Look for:
- The recurring price (monthly or yearly)
- Click on the price to see its full ID
- Copy the **Price ID** (NOT the Product ID)

---

## Example:

When you click on "Pro" product, you might see:
```
Pricing:
  $29.00 / month
  ID: price_1ABC123xyz...  ← Copy this!
```

---

## What You Still Need:

### 🔴 REQUIRED (App won't work without these):

1. **Supabase Keys** from: https://supabase.com/dashboard/project/mfukaceddufuatdourvd/settings/api
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the anon/public key)
   - `SUPABASE_SERVICE_ROLE_KEY` (the service_role key - keep secret!)

2. **Stripe Secret Key** from: https://dashboard.stripe.com/apikeys
   - `STRIPE_SECRET_KEY` (starts with `sk_live_...`)
   - ⚠️ This is DIFFERENT from the publishable key

3. **Stripe Price IDs** from: https://dashboard.stripe.com/products
   - Click on "Creator Plus" product → Copy the Price ID (price_...)
   - Click on "Pro" product → Copy the Price ID (price_...)

### 🟡 OPTIONAL (Can add later):

4. **Stripe Webhook Secret** (after deploying)
   - Set up webhook at: https://dashboard.stripe.com/webhooks
   - Endpoint: `https://contentlyapp.com/api/stripe/webhook`

5. **Google OAuth** (for Gmail integration)
   - Set up at: https://console.cloud.google.com/

---

## ✅ What You Already Have:

- Stripe Publishable Key: `pk_live_51SgOH...`
- Supabase URL: `https://mfukaceddufuatdourvd.supabase.co`
- Email Encryption Key: `cfb03a97...`
- Product IDs (reference only)

---

## Next Steps:

1. **Get the Price IDs** from Stripe (see instructions above)
2. **Get Supabase keys** from the API settings
3. **Get Stripe Secret Key** from API keys page
4. **Add ALL values to Vercel** environment variables
5. **Redeploy**

---

## Quick Links:

- Supabase API Settings: https://supabase.com/dashboard/project/mfukaceddufuatdourvd/settings/api
- Stripe API Keys: https://dashboard.stripe.com/apikeys
- Stripe Products: https://dashboard.stripe.com/products
- Vercel Env Vars: https://vercel.com/lucress/contently/settings/environment-variables
