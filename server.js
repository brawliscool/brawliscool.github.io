// Development preview only. Production is GitHub Pages + Supabase Edge Functions.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = import.meta.dirname;
const allowed = /^(?:index|portfolio|subscriptions|privacy|terms)\.html$|^(?:css|js|images)\/[a-zA-Z0-9_.-]+$|^supabase\/functions\/_shared\/business\.js$/;
http.createServer((req,res)=>{
 let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);return res.end();}
 if(!['GET','HEAD'].includes(req.method)||!allowed.test(file)){res.writeHead(404);return res.end('Not found');}
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml'};
 fs.readFile(path.join(root,file),(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);});
}).listen(process.env.PORT || 3000,'127.0.0.1');
