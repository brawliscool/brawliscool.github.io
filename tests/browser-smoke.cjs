const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{let file=path.join(root,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');fs.readFile(file,(e,data)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});}).listen(3101,'127.0.0.1');
(async()=>{const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote']});
for(const width of [320,390,760,1024,1440]){
 const page=await browser.newPage({viewport:{width,height:844}});page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.WebSocket=class{static OPEN=1;readyState=1;bufferedAmount=0;constructor(){window.__socket=this;setTimeout(()=>this.onopen?.(),0);}send(s){(window.__sent||=[]).push(JSON.parse(s));}close(){this.readyState=3;setTimeout(()=>this.onclose?.(),0);}};});
 let bookingCalls=0;
 await page.route('**/functions/v1/**',async route=>{const quote=route.request().url().endsWith('/quote');if(quote)bookingCalls++;await route.fulfill({json:quote?{success:true,message:'Request received'}:{agentId:'test',value:'token',context:'test'}});});
 await page.goto('http://127.0.0.1:3101/',{waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`home overflow ${width}`);
 assert.equal(await page.locator('#nova-reception').count(),0);
 if(width<=760){await page.locator('.menu-toggle').click();assert.equal(await page.locator('#navigation').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#navigation').isVisible(),false);}
 await page.locator('[data-package="full"]').click();await page.locator('select[name="service"] option').filter({hasText:'Nova Full Detail'}).waitFor({state:'attached'});
 assert.equal(await page.locator('select[name="service"]').inputValue(),'full');
 for(const [name,value]of Object.entries({name:'Test Customer',phone:'9035551234',vehicle:'Ford F150',address:'Fairfield Texas'}))await page.locator(`[name="${name}"]`).fill(value);
 await page.locator('#quoteForm [type="submit"]').click();await page.getByText('Request received',{exact:true}).waitFor();assert.equal(bookingCalls,1);
 await page.locator('.nova-reception-launch').click();await page.getByText('Ready. Type your question below.').waitFor();
 await page.locator('.nova-chat-form input').fill('What packages?');await page.locator('.nova-chat-form button').click();
 await page.evaluate(()=>{for(const delta of ['Hello',' there','!'])window.__socket.onmessage({data:JSON.stringify({type:'response.text.delta',delta})});window.__socket.onmessage({data:JSON.stringify({type:'response.done'})});});
 assert.equal(await page.locator('.nova-chat-message').last().textContent(),'Hello there!');
 await page.locator('[data-mode="voice"]').click();await page.getByText('Ready. Tap Start speaking; Nova sends your speech automatically when you pause.').waitFor();assert.equal(await page.locator('.nova-chat-form').isVisible(),false);assert.equal(await page.locator('[data-mic]').isEnabled(),true);

 await page.locator('[data-close]').click();await page.locator('.nova-reception-launch').click();assert.equal(await page.locator('link[href*="receptionist.css"]').count(),1);await page.locator('[data-close]').click();
 for(const name of ['portfolio','privacy','terms','subscriptions']){await page.goto(`http://127.0.0.1:3101/${name}.html`,{waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} overflow ${width}`);}
 assert.deepEqual(errors,[],`browser errors ${width}`);console.log(`PASS ${width}px: navigation, booking, chat, voice UI, all 5 pages`);await page.close();
}
await browser.close();server.close();})().catch(e=>{console.error(e);server.close();process.exit(1)});
