// Development preview only. Production is GitHub Pages + Supabase Edge Functions.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const allowed = /^(?:index|portfolio|subscriptions|privacy|terms)\.html$|^(?:css|js|images)\/[a-zA-Z0-9_.-]+$|^supabase\/functions\/_shared\/business\.js$/;
http.createServer((req,res)=>{
 let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);return res.end();}
 if(!['GET','HEAD'].includes(req.method)||!allowed.test(file)){res.writeHead(404);return res.end('Not found');}
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg'};
 fs.readFile(path.join(__dirname,file),(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);});
}).listen(process.env.PORT || 3000,'127.0.0.1');
