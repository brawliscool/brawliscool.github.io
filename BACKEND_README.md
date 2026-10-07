# A&J production booking

GitHub Pages hosts the existing dark/gold site. `js/main.js` posts to the original Supabase project `vjrppghecgcqzyulpnkk`, function `quote`, with a public anon JWT. No service credentials belong in the frontend. The shared business catalog is authoritative; keep static package cards in sync with it.

The endpoint validates body type and size, strings, phone, optional email, vehicle, address, package IDs, and dates. Database-backed limits allow five attempts per phone number per 15 minutes and 100 globally per 15 minutes. Database failures fail closed. Caller-provided IP headers are not trusted. Honeypot and minimum completion time deter basic spam. Configure Cloudflare Turnstile for stronger bot protection; when TURNSTILE_SECRET_KEY is set, the client must supply a verified token from your matching widget.

Bookings are saved in `public.aj_booking_requests` with RLS and no anon/authenticated access. Review requests in the Supabase dashboard. Unique request IDs protect retries. Optional Resend notifications require RESEND_API_KEY and FROM_EMAIL (verified sender) in Supabase secrets. The business destination is ajmobiledetailingtx@gmail.com. Notification failure does not lose a saved request; monitor booking_notification_failed logs. Email delivery is not guaranteed until configured and tested.

The obsolete AI chat proxy returns 410. `server.js` is an allowlisted local preview only, with no live API routes. Do not expose the repository root with Express static middleware. Run `npm test` to check validation. Existing experimental sites under sub-websites are outside the detailing backend.
