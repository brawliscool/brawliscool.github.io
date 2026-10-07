import {business,validateBooking} from './business.js?v=nova-spacious-20261007';
const endpoint='https://vjrppghecgcqzyulpnkk.supabase.co/functions/v1/quote';
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcnBwZ2hlY2djcXp5dWxwbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ2NzMsImV4cCI6MjA4MDkyMDY3M30.Zx_tYyUv0HjUPpZhuz1KvOGdlkNoz8qX5_SP58g-Gts';
const form=document.getElementById('quoteForm');
let startedAt=Date.now(), requestId=crypto.randomUUID(), sending=false;
const status=document.getElementById('formStatus');
const select=form.elements.service;
const date=form.elements.date;
const steps=[...form.querySelectorAll('[data-booking-step]')];
const back=form.querySelector('[data-booking-back]');
const next=form.querySelector('[data-booking-next]');
const submit=form.querySelector('[data-booking-submit]');
const current=form.querySelector('[data-step-current]');
const progress=form.querySelector('[data-progress-bar]');
const packageNote=form.querySelector('[data-package-note]');
let stepIndex=0;
date.min=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());
select.replaceChildren(new Option('Choose a package',''),...business.packages.map(p=>new Option(`${p.name} — from $${p.price}`,p.id)));
const packageCopy={refresh:'Quick maintenance clean — from $90.',full:'Most popular: deeper interior + exterior reset — from $130.',complete:'Maximum care with deeper upholstery and paint protection — from $180.'};
function updatePackageNote(){packageNote.textContent=packageCopy[select.value] || 'Choose the package that fits your vehicle. Final pricing is confirmed before work begins.';}
function showStep(index){
 stepIndex=Math.max(0,Math.min(index,steps.length-1));
 steps.forEach((step,i)=>step.hidden=i!==stepIndex);
 current.textContent=String(stepIndex+1);
 progress.style.width=`${((stepIndex+1)/steps.length)*100}%`;
 back.hidden=stepIndex===0;
 next.hidden=stepIndex===steps.length-1;
 submit.hidden=stepIndex!==steps.length-1;
 status.textContent='';
}
function validateCurrentStep(){
 const fields=[...steps[stepIndex].querySelectorAll('input,select,textarea')];
 const invalid=fields.find(field=>!field.checkValidity());
 if(invalid){invalid.reportValidity();invalid.focus();return false;}
 return true;
}
next.addEventListener('click',()=>{if(validateCurrentStep())showStep(stepIndex+1);});
back.addEventListener('click',()=>showStep(stepIndex-1));
select.addEventListener('change',updatePackageNote);
document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{
 select.value=link.dataset.package;
 updatePackageNote();
 showStep(0);
}));
showStep(0);
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(stepIndex<steps.length-1){if(validateCurrentStep())showStep(stepIndex+1);return;}
 if(sending||!form.reportValidity())return;
 const input={...Object.fromEntries(new FormData(form)),startedAt,requestId};
 try{validateBooking(input);}catch(error){status.textContent=error.message;return;}
 sending=true;submit.disabled=true;submit.textContent='Sending…';status.textContent='';
 try{
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`},body:JSON.stringify(input),signal:AbortSignal.timeout(20000)});
  const data=await response.json();if(!response.ok||data.success!==true)throw new Error(data.message || 'Unable to submit.');
  status.textContent=data.message;form.reset();requestId=crypto.randomUUID();startedAt=Date.now();updatePackageNote();showStep(0);
 }catch(error){status.textContent=`${error.name==='TimeoutError'?'The request timed out. You can retry safely.':error.message || 'Unable to submit.'} Please try again later. Your details have been kept.`;}
 finally{sending=false;submit.disabled=false;submit.textContent='Send request';}
});