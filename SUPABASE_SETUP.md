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

## Costs

- Supabase Edge Functions: Free tier includes 500,000 invocations/month
- DeepSeek API: Pay per token (very affordable)

## Security

✅ API key stored as Supabase secret (never exposed to frontend)
✅ CORS enabled for cross-origin requests
✅ No sensitive data in client-side code
