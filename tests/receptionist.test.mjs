import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../supabase/functions/receptionist/handler.js';
import {encodePCM,decodePCM} from '../js/receptionist-audio.js';
const secrets = {XAI_API_KEY:'test-secret',SUPABASE_SERVICE_ROLE_KEY:'test-service',RECEPTIONIST_TURNSTILE_SECRET:'test-captcha',RECEPTIONIST_TURNSTILE_SITE_KEY:'public-site-key'};
const origin = 'https://ajdetailing.store';
function req(body,custom = {}) {return new Request('https://example.com',{method:'POST',headers:{origin,'Content-Type':'application/json',...custom},body:JSON.stringify(body)});}
function harness(overrides = {}) {
  const calls = [];
  const handler = createHandler({env:k=>secrets[k],context:'current packages',rateLimit:async()=>true,fetchImpl:async(url,options)=>{calls.push({url,options});return Response.json(url.includes('siteverify')?{success:true,hostname:'ajdetailing.store',action:'nova-receptionist'}:{value:'temporary-token',expires_at:12345});},...overrides});
  return {handler,calls};
}
test('configuration never leaks private keys',async()=>{const {handler,calls} = harness();const r = await handler(req({action:'config'}));assert.deepEqual(await r.json(),{siteKey:'public-site-key'});assert.equal(calls.length,0);});
test('rejects untrusted origins before upstream calls',async()=>{const {handler,calls} = harness();assert.equal((await handler(req({action:'session',turnstileToken:'token'},{origin:'https://evil.example'}))).status,403);assert.equal(calls.length,0);});
test('missing secrets fail closed',async()=>{const {handler,calls} = harness({env:()=>undefined});assert.equal((await handler(req({action:'config'}))).status,503);assert.equal(calls.length,0);});
test('requires CAPTCHA before paid request',async()=>{const {handler,calls} = harness();assert.equal((await handler(req({action:'session'}))).status,400);assert.equal(calls.length,0);});
test('CAPTCHA hostname and action must match',async()=>{const {handler} = harness({fetchImpl:async()=>Response.json({success:true,hostname:'evil.example',action:'nova-receptionist'})});assert.equal((await handler(req({action:'session',turnstileToken:'token'}))).status,403);});
test('quota rejection prevents token issuance',async()=>{const {handler,calls} = harness({rateLimit:async()=>false});const r = await handler(req({action:'session',turnstileToken:'token'}));assert.equal(r.status,429);assert.equal(calls.length,1);assert.equal(r.headers.get('Retry-After'),'900');});
test('quota failure is a safe unavailable response',async()=>{const {handler,calls} = harness({rateLimit:async()=>{throw Error('private db diagnostic');}});const r = await handler(req({action:'session',turnstileToken:'token'}));assert.equal(r.status,503);assert.ok(!(await r.text()).includes('private'));assert.equal(calls.length,1);});
test('issues short-lived token for exact saved agent',async()=>{const {handler,calls} = harness();const r = await handler(req({action:'session',turnstileToken:'token'}));assert.equal(r.status,200);const body = await r.json();assert.equal(body.agentId,'agent_puv531kMMP30cKia');assert.equal(body.value,'temporary-token');assert.equal(r.headers.get('Cache-Control'),'no-store');assert.deepEqual(JSON.parse(calls[1].options.body),{expires_after:{seconds:60}});assert.ok(!JSON.stringify(body).includes('test-secret'));});
test('oversized and malformed bodies are rejected',async()=>{const {handler,calls} = harness();assert.equal((await handler(req({action:'session',turnstileToken:'x'.repeat(5000)}))).status,413);assert.equal((await handler(new Request('https://example.com',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:'{'}))).status,400);assert.equal(calls.length,0);});
test('PCM round trip preserves signed samples and clamps',()=>{const values = decodePCM(encodePCM(new Float32Array([-2,-1,-.5,0,.5,1,2])));assert.equal(values[0],-1);assert.equal(values[3],0);assert.ok(Math.abs(values[4]-.5)<.001);assert.ok(values[6]>.99 && values[6]<=1);assert.throws(()=>decodePCM(btoa('x')));});
