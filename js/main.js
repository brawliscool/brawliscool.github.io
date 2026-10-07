import {business,validateBooking} from './business.js?v=nova-ui-20261007';
const endpoint='https://vjrppghecgcqzyulpnkk.supabase.co/functions/v1/quote';
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcnBwZ2hlY2djcXp5dWxwbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ2NzMsImV4cCI6MjA4MDkyMDY3M30.Zx_tYyUv0HjUPpZhuz1KvOGdlkNoz8qX5_SP58g-Gts';
const form=document.getElementById('quoteForm');
let startedAt=Date.now(), requestId=crypto.randomUUID(), sending=false;
const date=form.elements.date;
date.min=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());
const status=document.getElementById('formStatus');
const select=form.elements.service;
select.replaceChildren(new Option('Choose a package',''),...business.packages.map(p=>new Option(`${p.name} - Starting at $${p.price}`,p.id)));
document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{select.value=link.dataset.package;}));
form.addEventListener('submit',async event=>{
 event.preventDefault();if(sending||!form.reportValidity())return;
 const input={...Object.fromEntries(new FormData(form)),startedAt,requestId};
 try{validateBooking(input);}catch(error){status.textContent=error.message;return;}
 sending=true;const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';status.textContent='';
 try{
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`},body:JSON.stringify(input),signal:AbortSignal.timeout(20000)});
  const data=await response.json();if(!response.ok||data.success!==true)throw new Error(data.message || 'Unable to submit.');
  status.textContent=data.message;form.reset();requestId=crypto.randomUUID();startedAt=Date.now();
 }catch(error){status.textContent=`${error.name==='TimeoutError'?'The request timed out. You can retry safely.':error.message || 'Unable to submit.'} Call ${business.phone} or email ${business.email} if needed. Your details have been kept.`;}
 finally{sending=false;button.disabled=false;button.textContent='Send booking request';}
});
