const origins = ['https://ajdetailing.store','https://www.ajdetailing.store','https://brawliscool.github.io'];
export function createHandler({env,fetchImpl = fetch,rateLimit,context}) {
  return async req => {
    const origin = req.headers.get('origin') || '';
    const reply = (body,status = 200) => new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff',...(origins.includes(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS',...(status === 429?{'Retry-After':'900'}:{})}});
    if(!origins.includes(origin))return reply({message:'Access denied.'},403);
    if(req.method === 'OPTIONS')return reply({});
    if(req.method !== 'POST')return reply({message:'Method not allowed.'},405);
    try {
      if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({message:'Invalid request.'},400);
      const reader = req.body?.getReader();if(!reader)return reply({message:'Invalid request.'},400);
      let length = 0, chunks = [];
      while(true){const {done,value} = await reader.read();if(done)break;length += value.length;if(length > 4096){await reader.cancel();return reply({message:'Request too large.'},413);}chunks.push(value);}
      const bytes = new Uint8Array(length);let offset = 0;for(const chunk of chunks){bytes.set(chunk,offset);offset += chunk.length;}
      let input;try{input = JSON.parse(new TextDecoder().decode(bytes));}catch{return reply({message:'Invalid request.'},400);}
      if(!input || Array.isArray(input) || !['config','session'].includes(input.action))return reply({message:'Invalid request.'},400);
      if(!env('XAI_API_KEY') || !env('RECEPTIONIST_TURNSTILE_SECRET') || !env('RECEPTIONIST_TURNSTILE_SITE_KEY'))return reply({message:'The receptionist is temporarily unavailable. Please use Request a detail.'},503);
      if(input.action === 'config')return reply({siteKey:env('RECEPTIONIST_TURNSTILE_SITE_KEY')});
      if(input.mode !== undefined && !['text','voice'].includes(input.mode))return reply({message:'Invalid assistant mode.'},400);
      if(typeof input.turnstileToken !== 'string' || input.turnstileToken.length < 1 || input.turnstileToken.length > 2048)return reply({message:'Complete the security check.'},400);
      // CAPTCHA is mandatory; fail closed before issuing any paid-model credential.
      const check = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env('RECEPTIONIST_TURNSTILE_SECRET'),response:input.turnstileToken}),signal:AbortSignal.timeout(8000)});
      if(!check.ok)throw new Error('verification unavailable');
      const verdict = await check.json();
      if(!verdict.success || verdict.hostname !== new URL(origin).hostname || verdict.action !== 'nova-receptionist')return reply({message:'Security verification failed. Close and reopen to retry.'},403);
      // Global and per-client quotas are atomic in Postgres, not isolate-local memory.
      const identity = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      const hash = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity + env('SUPABASE_SERVICE_ROLE_KEY')));
      const key = Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
      if(!await rateLimit(key))return reply({message:'Too many conversations. Please try again in 15 minutes.'},429);
      const upstream = await fetchImpl('https://api.x.ai/v1/realtime/client_secrets',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env('XAI_API_KEY')}`},body:JSON.stringify({expires_after:{seconds:60}}),signal:AbortSignal.timeout(10000)});
      if(!upstream.ok)throw new Error('upstream unavailable');
      const token = await upstream.json();
      if(typeof token.value !== 'string' || !Number.isFinite(token.expires_at))throw new Error('invalid upstream');
      const assistantContext = input.mode === 'voice'
        ? `${context} Your name in this session is Nova Voice. This is a speech-only interface: the customer speaks and hears your spoken reply. Do not direct them to type in this interface.`
        : `${context} Your name in this session is Nova. This is a text-only chatbot interface. The customer types and reads your reply; there are no microphone controls in this mode.`;
      return reply({value:token.value,expiresAt:token.expires_at,agentId:'agent_puv531kMMP30cKia',context:assistantContext});
    } catch {return reply({message:'The receptionist is unavailable right now. Please use Request a detail.'},503);}
  };
}
