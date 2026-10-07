import {encodePCM, decodePCM} from './receptionist-audio.js';
const endpoint = 'https://vjrppghecgcqzyulpnkk.supabase.co/functions/v1/receptionist';
const launch = document.createElement('button');
launch.className = 'nova-reception-launch';
launch.textContent = '✦ Ask Nova';
launch.setAttribute('aria-expanded', 'false');
launch.setAttribute('aria-controls', 'nova-reception');
const panel = document.createElement('section');
panel.id = 'nova-reception'; panel.className = 'nova-reception'; panel.hidden = true;
panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Nova AI receptionist');
panel.innerHTML = `<header><div><h2>Nova receptionist</h2><small>AI help · Packages, questions & booking</small></div><button type="button" aria-label="Close receptionist" data-close>✕</button></header><div class="nova-chat-log" role="log" aria-live="polite" aria-relevant="additions text"></div><div class="nova-chat-controls"><p class="nova-chat-status" role="status">Connecting…</p><div class="nova-chat-captcha"></div><form class="nova-chat-form"><input aria-label="Your message" placeholder="Ask about your car…" maxlength="1500" required disabled><button type="submit" disabled>Send</button></form><div class="nova-chat-actions"><button type="button" data-mic disabled>Talk to Nova</button><a href="index.html#contact">Request a detail</a></div><p class="nova-chat-notice">Messages and voice are sent to xAI. Voice starts only when you choose Talk. Appointments need personal confirmation. <a href="privacy.html">Privacy</a></p></div>`;
document.body.append(launch, panel);
const log = panel.querySelector('.nova-chat-log'), status = panel.querySelector('.nova-chat-status');
const form = panel.querySelector('form'), input = form.querySelector('input'), submit = form.querySelector('button');
const mic = panel.querySelector('[data-mic]'), captcha = panel.querySelector('.nova-chat-captcha');
let ws, connecting = false, busy = false, answer, audio, stream, source, processor, mute, nextPlay = 0, timer, captchaId, generation = 0, micStarting = false;
const playing = new Set();
function message(role, text) {
  const p = document.createElement('p'); p.className = 'nova-chat-message'; p.dataset.role = role; p.textContent = text;
  log.append(p); log.scrollTop = log.scrollHeight;
  while (log.children.length > 60) log.firstChild.remove();
  return p;
}
message('assistant', 'Hi! I’m Nova’s AI receptionist. Ask about packages, pricing, or getting your car detailed.');
function controls() { const ready = ws?.readyState === WebSocket.OPEN; input.disabled = !ready || busy || !!stream; submit.disabled = input.disabled; mic.disabled = !ready || busy || micStarting; }
function send(event) { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(event)); }
function stopPlayback() { for (const node of playing) {try {node.stop();} catch {}} playing.clear(); nextPlay = 0; }
function stopMic(commit = false) {
  const wasRecording = !!stream;
  stream?.getTracks().forEach(track => track.stop()); stream = undefined;
  source?.disconnect(); processor?.disconnect(); mute?.disconnect();
  if (processor) processor.port.onmessage = null;
  source = processor = mute = undefined; mic.textContent = 'Talk to Nova';
  if (commit && wasRecording) {busy = true; answer = undefined; send({type:'input_audio_buffer.commit'}); send({type:'response.create'}); status.textContent = 'Nova is replying…';}
  else if (wasRecording) send({type:'input_audio_buffer.clear'});
  controls();
}
function disconnect() {
  generation++; clearTimeout(timer); stopMic(); stopPlayback();
  ws?.close(); ws = undefined; connecting = busy = false; answer = undefined;
  audio?.close().catch(() => {}); audio = undefined; controls();
  if (captchaId !== undefined && window.turnstile) window.turnstile.remove(captchaId);
  captchaId = undefined; captcha.replaceChildren();
}
async function request(body) {
  const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'The receptionist is unavailable. Please use Request a detail.');
  return data;
}
async function connect(token, attempt) {
  try {
    status.textContent = 'Connecting to Nova…';
    const data = await request({action:'session',turnstileToken:token});
    if (attempt !== generation || panel.hidden) return;
    const socket = new WebSocket(`wss://api.x.ai/v1/realtime?agent_id=${encodeURIComponent(data.agentId)}`, [`xai-client-secret.${data.value}`]);
    ws = socket;
    timer = setTimeout(() => {if(socket.readyState !== WebSocket.OPEN){disconnect(); status.textContent = 'Connection timed out. Close and reopen to retry.';}},15000);
    socket.onopen = () => {
      clearTimeout(timer); connecting = false;
      send({type:'session.update',session:{turn_detection:null,audio:{input:{format:{type:'audio/pcm',rate:48000}},output:{format:{type:'audio/pcm',rate:24000}}}}});
      // Send current site facts as context without replacing the saved agent's instructions or voice.
      send({type:'conversation.item.create',item:{type:'message',role:'user',content:[{type:'input_text',text:data.context}]}});
      status.textContent = 'Ready. Type a question or choose Talk to Nova.'; controls();
      timer = setTimeout(() => {disconnect(); status.textContent = 'Session ended. Close and reopen to start again.';},600000);
    };
    socket.onmessage = event => {
      if (ws !== socket) return;
      try {
        const e = JSON.parse(event.data);
        if (['response.output_audio_transcript.delta','response.audio_transcript.delta','response.output_text.delta','response.text.delta'].includes(e.type)) {
          answer ||= message('assistant',''); answer.textContent += String(e.delta || ''); log.scrollTop = log.scrollHeight;
        } else if (['response.output_audio.delta','response.audio.delta'].includes(e.type) && audio && !panel.hidden) {
          const samples = decodePCM(e.delta), buffer = audio.createBuffer(1,samples.length,24000); buffer.copyToChannel(samples,0);
          const node = audio.createBufferSource(); node.buffer = buffer; node.connect(audio.destination); playing.add(node); node.onended = () => playing.delete(node);
          nextPlay = Math.max(nextPlay,audio.currentTime); node.start(nextPlay); nextPlay += buffer.duration;
        } else if (e.type === 'conversation.item.input_audio_transcription.completed') message('user',e.transcript || 'Voice message');
        else if (e.type === 'response.done') {busy = false; answer = undefined; status.textContent = 'Ready for your next question.'; controls();}
        else if (e.type === 'error') {busy = false; stopMic(); status.textContent = 'Nova could not respond. Please try again or use Request a detail.'; controls();}
      } catch {status.textContent = 'Unable to read the response. Please try again.';busy = false;controls();}
    };
    socket.onerror = () => {status.textContent = 'Unable to connect. Please use Request a detail or reopen to retry.';};
    socket.onclose = () => {if(ws === socket){disconnect();status.textContent = 'Connection ended. Close and reopen to retry.';}};
  } catch(error) {if(attempt === generation){connecting = false; status.textContent = error.message; controls();}}
}
async function setup() {
  if (connecting || ws) return;
  connecting = true; const attempt = generation;
  try {
    const config = await request({action:'config'});
    if (attempt !== generation || panel.hidden) return;
    status.textContent = 'Complete the quick security check to begin.';
    if (!window.turnstile) await new Promise((resolve,reject) => {
      const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.onload = resolve; script.onerror = () => reject(new Error('Security check could not load. Please use Request a detail.')); document.head.append(script);
    });
    if (attempt !== generation || panel.hidden) return;
    captchaId = window.turnstile.render(captcha,{sitekey:config.siteKey,theme:'dark',action:'nova-receptionist',callback:token => {captcha.hidden = true;connect(token,attempt);},'error-callback':() => {status.textContent = 'Security check failed. Close and reopen to retry.';},'expired-callback':() => {if(!ws)status.textContent = 'Security check expired. Close and reopen to retry.';}});
  } catch {connecting = false;status.textContent = 'The receptionist is temporarily unavailable. You can still request a detail below.';}
}
launch.addEventListener('click', () => {
  panel.hidden = !panel.hidden; launch.setAttribute('aria-expanded', String(!panel.hidden));
  if(panel.hidden) disconnect(); else {captcha.hidden = false;panel.querySelector('[data-close]').focus();setup();}
});
function close() {panel.hidden = true;launch.setAttribute('aria-expanded','false');disconnect();launch.focus();}
panel.querySelector('[data-close]').addEventListener('click',close);
panel.querySelector('.nova-chat-actions a').addEventListener('click',close);
panel.addEventListener('keydown',event => {if(event.key === 'Escape')close();});
document.addEventListener('visibilitychange',() => {if(document.hidden)stopMic();});
window.addEventListener('pagehide',disconnect);
form.addEventListener('submit',event => {
  event.preventDefault(); const text = input.value.trim(); if(!text || busy || ws?.readyState !== WebSocket.OPEN)return;
  busy = true; answer = undefined; stopPlayback();message('user',text);input.value = ''; status.textContent = 'Nova is replying…';controls();
  send({type:'conversation.item.create',item:{type:'message',role:'user',content:[{type:'input_text',text}]}});send({type:'response.create'});
});
mic.addEventListener('click',async () => {
  if(stream){stopMic(true);return;}
  if(micStarting || busy)return;
  micStarting = true;controls();const attempt = generation;
  try {
    audio ||= new AudioContext({sampleRate:48000});await audio.resume();stopPlayback();
    const acquired = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
    if(attempt !== generation || panel.hidden){acquired.getTracks().forEach(t => t.stop());return;}
    stream = acquired;await audio.audioWorklet.addModule('js/receptionist-mic.js');
    if(attempt !== generation || !stream)return;
    send({type:'session.update',session:{audio:{input:{format:{type:'audio/pcm',rate:audio.sampleRate}}}}});
    source = audio.createMediaStreamSource(stream);processor = new AudioWorkletNode(audio,'nova-microphone');mute = audio.createGain();mute.gain.value = 0;
    processor.port.onmessage = event => {if(stream && !document.hidden && ws?.bufferedAmount < 100000)send({type:'input_audio_buffer.append',audio:encodePCM(event.data)});};
    source.connect(processor);processor.connect(mute);mute.connect(audio.destination);mic.textContent = 'Finish speaking';status.textContent = 'Microphone on. Tap Finish speaking to send.';
  } catch {stopMic();status.textContent = 'Microphone unavailable. You can type your question instead.';}
  finally {micStarting = false;controls();}
});
