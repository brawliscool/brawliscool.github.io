# Nova website receptionist

Nova is the text chatbot. Nova Voice is speech-only. Both use the saved xAI agent `agent_puv531kMMP30cKia` with mode-specific business context. The text form and transcript are hidden in voice mode; the microphone and playback are hidden in text mode. Switching assistants closes the prior session and stops the microphone/audio.

The Call Nova Voice button opens the caller's dialer for the owner-supplied number, +1 (443) 486-3925. This does not provision or change telephone routing; verify call handling with the phone provider.

## Backend

The production Supabase project is `vjrppghecgcqzyulpnkk`. Function `receptionist` is deployed with JWT gateway verification off because it is a public customer endpoint. It allows only the three site origins in `handler.js`, accepts small JSON POST requests, returns generic errors, and sends no xAI API key to the browser.

No CAPTCHA provider or application session quota is used. The endpoint still validates the origin, request method, JSON size and assistant mode. The browser ends a session after ten minutes, but that client timer can be bypassed. Ephemeral client secrets expire after 60 seconds for new connections; they do not enforce an existing-session time limit or documented agent scope. Without a session quota, xAI usage can increase with public traffic; keep a spending limit on the dedicated xAI API key and monitor usage.

`XAI_API_KEY` is saved as an encrypted Supabase Edge Function secret. Do not put it in frontend code, GitHub, or chat. The key was exposed in chat when initially supplied; rotate it in the xAI console and replace the Supabase secret with the rotated key when convenient.

## Verify

Run `node --test tests/receptionist.test.mjs`. Check the public function returns 200 and a short-lived session for both `mode: text` and `mode: voice`, 403 for an untrusted origin, and safe 503 when the xAI secret is unavailable. Then test the deployed page, package answers, mic permission denial, iPhone Safari voice playback, stopping mic on close/background, and the direct-call behavior. The booking form remains the only route for appointment requests; all appointments require personal confirmation.
