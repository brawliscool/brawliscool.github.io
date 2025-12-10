# Supabase Edge Function Setup for DeepSeek AI Chat

This guide explains how to deploy the AI chatbot backend using Supabase Edge Functions.

## Prerequisites

1. A Supabase account (free at [supabase.com](https://supabase.com))
2. Supabase CLI installed
3. Your DeepSeek API key

## Step 1: Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Link to Your Project

Your project ID: `vjrppghecgcqzyulpnkk`

```bash
cd /path/to/your/project
supabase link --project-ref vjrppghecgcqzyulpnkk
```

## Step 4: Set Your DeepSeek API Key as a Secret

```bash
supabase secrets set DEEPSEEK_API_KEY=sk-3cfc10e48c424ff88f2aa69ee8c192f1
supabase secrets set DEEPSEEK_BASE_URL=https://api.deepseek.com/v3.2_speciale_expires_on_20251215
```

## Step 5: Deploy the Edge Function

```bash
supabase functions deploy chat
```

## Step 6: Update Your Website

The `js/main.js` file has already been configured with your Supabase URL:

```javascript
const SUPABASE_URL = 'https://vjrppghecgcqzyulpnkk.supabase.co';
```

## Step 7: Test the Function

You can test the function with curl:

```bash
curl -X POST 'https://vjrppghecgcqzyulpnkk.supabase.co/functions/v1/chat' \
  -H 'Content-Type: application/json' \
  -d '{"message": "What services do you offer?"}'
```

## Troubleshooting

### Function returns 500 error
- Check that secrets are set: `supabase secrets list`
- Check function logs: `supabase functions logs chat`

### CORS errors
- The function already includes CORS headers for all origins
- Make sure you're using the correct Supabase URL

### API key not working
- Verify your DeepSeek API key is valid
- Check the base URL is correct

---

## Quote Request Email Function

You can now process quote requests (store them in Supabase + send you an email) with the `quote` Edge Function.

### 1. Create the Database Table

Run this SQL in the Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  vehicle text,
  service text not null,
  requests text,
  marketing_consent boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referer text,
  user_agent text,
  inserted_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

create policy "Service role access only"
  on public.quote_requests
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
```

### 2. Grab Your Public Anon Key

1. Stay on **Project Settings → API**.
2. Copy the **anon public key** (this one is safe to expose on the frontend).
3. Open `js/main.js` and replace `YOUR_SUPABASE_ANON_KEY` with the value you just copied.

### 3. Set Supabase Secrets

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set BUSINESS_EMAIL=you@example.com
supabase secrets set RESEND_API_KEY=re_abc123
supabase secrets set FROM_EMAIL=notifications@ajdetailing.store
```

- `BUSINESS_EMAIL` – where the notification should be delivered
- `RESEND_API_KEY` – generate one for free at [resend.com](https://resend.com)
- `FROM_EMAIL` – optional, defaults to `nova@ajdetailing.store`

### 4. Deploy the Function

```bash
supabase functions deploy quote
```

### 5. Test

Submit the quote form on your site. You should see a new row in `quote_requests` and receive an email notification immediately.

## Costs

- Supabase Edge Functions: Free tier includes 500,000 invocations/month
- DeepSeek API: Pay per token (very affordable)

## Security

✅ API key stored as Supabase secret (never exposed to frontend)
✅ CORS enabled for cross-origin requests
✅ No sensitive data in client-side code
