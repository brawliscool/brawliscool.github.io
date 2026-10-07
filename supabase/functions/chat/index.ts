import {response,origins} from '../_shared/http.ts';
// Retired: no public, unauthenticated paid-model proxy.
Deno.serve((req: Request)=>response(req,{success:false,message:'Please view our current packages or call (903) 879-2012.'},req.method==='OPTIONS' && origins.includes(req.headers.get('origin') || '')?200:410));
