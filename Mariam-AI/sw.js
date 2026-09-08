const API='https://blynwakebyyhlmsfjabm.supabase.co/functions/v1/mariam-ai-solve';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method==='POST' && url.origin===self.location.origin && url.pathname==='/api/solve'){
    event.respondWith((async()=>{
      const body=await event.request.clone().text();
      return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body});
    })());
  }
});
