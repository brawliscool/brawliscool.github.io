import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../supabase/functions/receptionist/handler.js';
import {encodePCM,decodePCM} from '../js/receptionist-audio.js';

const secrets = {XAI_API_KEY:'test-secret',SUPABASE_SERVICE_ROLE_KEY:'test-service'};
const origin = 'https://ajdetailing.store';
function req(body,custom = {}) {
  return new Request('https://example.com',{method:'POST',headers:{origin,'Content-Type':'application/json',...custom},body:JSON.stringify(body)});
}
function harness(overrides = {}) {
  const calls = [];
  const handler = createHandler({
    env:k=>secrets[k],context:'current packages',rateLimit:async()=>true,
    fetchImpl:async(url,options)=>{calls.push({url,options});return Response.json({value:'temporary-token',expires_at:12345});},
    ...overrides,
  });
  return {handler,calls};
}

test('rejects untrusted origins before upstream calls',async()=>{
  const {handler,calls}=harness();
  const response=await handler(req({action:'session',mode:'text'},{origin:'https://evil.example'}));
  assert.equal(response.status,403);assert.equal(calls.length,0);
});
test('missing xAI or server secrets fail closed',async()=>{
  const {handler,calls}=harness({env:()=>undefined});
  assert.equal((await handler(req({action:'session',mode:'text'}))).status,503);assert.equal(calls.length,0);
});
test('rate limits reject sessions before xAI token issuance',async()=>{
  const {handler,calls}=harness({rateLimit:async()=>false});const r=await handler(req({action:'session',mode:'text'}));
  assert.equal(r.status,429);assert.equal(calls.length,0);assert.equal(r.headers.get('Retry-After'),'900');
});
test('quota failures are safe and fail closed',async()=>{
  const {handler,calls}=harness({rateLimit:async()=>{throw Error('private db diagnostic');}});const r=await handler(req({action:'session',mode:'text'}));
  assert.equal(r.status,503);assert.ok(!(await r.text()).includes('private'));assert.equal(calls.length,0);
});
test('text sessions issue short-lived credentials for the saved agent without CAPTCHA',async()=>{
  const {handler,calls}=harness();const r=await handler(req({action:'session',mode:'text'}));const body=await r.json();
  assert.equal(r.status,200);assert.equal(body.agentId,'agent_puv531kMMP30cKia');assert.equal(body.value,'temporary-token');assert.match(body.context,/text-only chatbot/);
  assert.equal(r.headers.get('Cache-Control'),'no-store');assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.x.ai/v1/realtime/client_secrets');
  assert.deepEqual(JSON.parse(calls[0].options.body),{expires_after:{seconds:60}});assert.ok(!JSON.stringify(body).includes('test-secret'));
});
test('voice sessions receive speech-only context',async()=>{
  const {handler}=harness();const r=await handler(req({action:'session',mode:'voice'}));const body=await r.json();assert.match(body.context,/speech-only interface/);
});
test('rejects unknown assistant modes',async()=>{
  const {handler,calls}=harness();assert.equal((await handler(req({action:'session',mode:'both'}))).status,400);assert.equal(calls.length,0);
});
test('oversized and malformed bodies are rejected',async()=>{
  const {handler,calls}=harness();assert.equal((await handler(req({action:'session',mode:'text',x:'x'.repeat(5000)}))).status,413);
  assert.equal((await handler(new Request('https://example.com',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:'{'}))).status,400);assert.equal(calls.length,0);
});
test('PCM round trip preserves signed samples and clamps',()=>{
  const values=decodePCM(encodePCM(new Float32Array([-2,-1,-.5,0,.5,1,2])));assert.equal(values[0],-1);assert.equal(values[3],0);
  assert.ok(Math.abs(values[4]-.5)<.001);assert.ok(values[6]>.99&&values[6]<=1);assert.throws(()=>decodePCM(btoa('x')));
});
