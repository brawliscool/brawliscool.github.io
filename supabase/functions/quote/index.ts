import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.44.4';
import {business,validateBooking} from '../../../js/business.js';
import {response,payload,origins} from '../_shared/http.ts';
const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
Deno.serve(async(req: Request)=>{
 if(req.method==='OPTIONS')return response(req,{},origins.includes(req.headers.get('origin') || '')?200:403);
 if(req.method!=='POST')return response(req,{success:false,message:'Method not allowed.'},405,{'Allow':'POST, OPTIONS'});
 try{
  let input;try{input=await payload(req);}catch{return response(req,{success:false,message:'Invalid request.'},400);}
  let booking;try{booking=validateBooking(input);}catch(e){return response(req,{success:false,message:(e as Error).message},400);}
  // Contact-based quota is deterministic; global quota prevents spoofed contacts bypassing limits.
  const identity=booking.phone;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity+Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')));
  const key=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const {data:allowed,error:rateError}=await client.rpc('aj_booking_rate_limit',{bucket_key:key});
  if(rateError)throw rateError;
  if(!allowed)return response(req,{success:false,message:'Too many requests. Please wait 15 minutes or call us.'},429,{'Retry-After':'900'});
  if(booking.website || typeof input.startedAt!=='number' || Date.now()-input.startedAt<3000 || Date.now()-input.startedAt>86400000)return response(req,{success:false,message:'Please reload the page and try again.'},400);
  const secret=Deno.env.get('TURNSTILE_SECRET_KEY');
  if(secret){
   if(typeof input.turnstileToken!=='string' || input.turnstileToken.length>2048)return response(req,{success:false,message:'Complete the spam check.'},400);
   const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:input.turnstileToken}),signal:AbortSignal.timeout(8000)});
   const verdict=await check.json();if(!verdict.success || !['ajdetailing.store','www.ajdetailing.store','brawliscool.github.io'].includes(verdict.hostname))return response(req,{success:false,message:'Spam verification failed.'},400);
  }
  const {website,...record}=booking;
  const {error}=await client.from('aj_booking_requests').insert(record);
  if(error && error.code!=='23505')throw error;
  // A saved booking remains successful if email delivery fails; retries cannot duplicate it.
  if(!error && Deno.env.get('RESEND_API_KEY')){
   try{const email=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${Deno.env.get('RESEND_API_KEY')}`,'Idempotency-Key':record.request_id},body:JSON.stringify({from:Deno.env.get('FROM_EMAIL') || 'A&J Mobile Detailing <nova@ajdetailing.store>',to:[business.email],subject:'New A&J booking request',text:Object.entries({...record,service:business.packages.find(p=>p.id===record.service)?.name}).map(([k,v])=>`${k}: ${v}`).join('\n')}),signal:AbortSignal.timeout(8000)});if(!email.ok)console.error('booking_notification_failed');else console.log('booking_notification_sent');}catch{console.error('booking_notification_failed');}
  }
  if(!error && !Deno.env.get('RESEND_API_KEY'))console.warn('booking_notification_unconfigured');
  return response(req,{success:true,message:'Your request has been received. We will contact you to confirm availability and the final price. Your appointment is not confirmed yet.'});
 }catch{console.error('booking_request_failed');return response(req,{success:false,message:'Unable to submit right now. Please try again or call (903) 879-2012.'},503);}
});
