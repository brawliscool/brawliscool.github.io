const endpoint='https://vjrppghecgcqzyulpnkk.supabase.co/functions/v1/quote';
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcnBwZ2hlY2djcXp5dWxwbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ2NzMsImV4cCI6MjA4MDkyMDY3M30.Zx_tYyUv0HjUPpZhuz1KvOGdlkNoz8qX5_SP58g-Gts';

// Kept separate from form rendering so network failures never discard entered details.
export async function submitBooking(input) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  if (!response.ok || data.success !== true) throw new Error(data.message || 'Unable to submit.');
  return data;
}
