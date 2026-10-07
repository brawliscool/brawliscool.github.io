# Nova website receptionist

## Assistant modes

Nova is the text chatbot: typed input and visible text replies, with no microphone controls or audio playback. Nova Voice is the speech assistant: microphone input and spoken output, with no text entry or displayed conversation transcript. Each mode starts a separate realtime session; switching ends the prior session and stops microphone/audio. Both use the saved agent, with current business and mode context. The phone call button is labelled Call Nova Voice.

Uses the saved xAI agent `agent_puv531kMMP30cKia` for typed questions and opt-in voice. The existing booking form still handles actual requests; the receptionist cannot confirm or submit appointments. The Call AI receptionist button opens the caller's dialer for the owner-supplied agent number, +1 (443) 486-3925. This integration does not provision or change that number's routing; live telephone behavior must be verified separately.

## Activation

1. In Supabase project `vjrppghecgcqzyulpnkk`, apply `supabase/sql/receptionist-setup.sql` and verify its RLS and service-role-only RPC permissions.
2. Create a Cloudflare Turnstile widget for `ajdetailing.store`, `www.ajdetailing.store`, and `brawliscool.github.io`.
3. Set Edge Function secrets `XAI_API_KEY`, `RECEPTIONIST_TURNSTILE_SECRET`, and `RECEPTIONIST_TURNSTILE_SITE_KEY`. Never put the xAI key in frontend files, source control, or chat. Use a dedicated xAI key with a spending limit.
4. Deploy only the `receptionist` function. After checking `supabase --help` and `supabase functions deploy --help`, use `supabase functions deploy receptionist --project-ref vjrppghecgcqzyulpnkk`. Its JWT setting is in config.toml; mandatory CAPTCHA and quotas guard this public visitor endpoint.
5. Verify config returns a public site key, CAPTCHA failures return 403, quota exhaustion returns 429, and backend failures expose no secrets. Test the saved agent with the actual key, typed replies, microphone permission denied, iPhone Safari voice playback, close/background stopping the mic, reconnect, and current prices.

## Limits

Ephemeral credentials expire after 60 seconds for new connections. This is not a hard limit on an established xAI session, and these credentials are not documented as agent-scoped. The widget closes after ten minutes, but a modified client can bypass frontend limits. CAPTCHA plus atomic global issuance quotas reduce abuse; a dedicated xAI key spending limit is still needed. A server WebSocket relay is necessary if hard per-session spend/agent restrictions are required.

Quota defaults: 3 sessions per forwarded client IP per 15 minutes, 30 globally per 15 minutes, and 200 globally per rolling 24-hour window. Global limits still apply if client headers are spoofed. Missing secrets, SQL, or failed rate checks fail closed. Conversations remain only in page memory on the website; xAI receives the conversation and Cloudflare receives verification data. Update privacy disclosures before activation.

Source code is installed independently of backend activation. Do not describe the receptionist as live until an authenticated end-to-end conversation has passed.
