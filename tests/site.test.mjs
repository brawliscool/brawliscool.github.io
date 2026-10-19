import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {Window} from 'happy-dom';

const root = new URL('../', import.meta.url);
function page(name) {
  const window = new Window({url:'https://ajdetailing.store/'});
  window.document.write(readFileSync(new URL(name, root), 'utf8'));
  return window;
}

test('home starts without assistant, audio, or booking modules on its critical path', async () => {
  const window = page('index.html');
  const doc = window.document;
  assert.ok(doc.querySelector('.nova-reception-launch'));
  const eager = [...doc.querySelectorAll('script[src],link[rel="stylesheet"]')].map(e => e.getAttribute('src') || e.getAttribute('href'));
  assert.deepEqual(eager.map(p => p.split('?')[0]).sort(), ['css/style.css','js/nova.js']);
  assert.ok(eager.reduce((bytes, path) => bytes + statSync(new URL(path.split('?')[0], root)).size, 0) < 25000);
  await window.happyDOM.abort();
});

for (const name of ['index.html','portfolio.html','privacy.html','terms.html','subscriptions.html']) {
  test(`${name} uses valid local images and shared styles`, async () => {
    const window = page(name);
    for (const el of window.document.querySelectorAll('img,source,script[src],link[rel="stylesheet"]')) {
      const values = el.getAttribute('srcset')?.split(',').map(p => p.trim().split(/\s/)[0]) || [el.getAttribute('src') || el.getAttribute('href')];
      for (const value of values) {
        assert.ok(!value.startsWith('http'), `Unexpected external dependency ${value}`);
        assert.ok(existsSync(new URL(value.split('?')[0], root)), value);
      }
    }
    await window.happyDOM.abort();
  });
}

test('live booking markup initializes, preserves package, prevents duplicates, and retains failures for retry', async () => {
  const window = page('index.html');
  const form = window.document.querySelector('#quoteForm');
  form.elements.service.value = 'full';
  globalThis.document = window.document;
  const originalFormData = globalThis.FormData;
  globalThis.FormData = window.FormData;
  const originalFetch = globalThis.fetch;
  let resolveRequest;
  const requests = [];
  globalThis.fetch = (url, options) => new Promise(resolve => { requests.push(JSON.parse(options.body)); resolveRequest = resolve; });
  try {
    await import('../js/main.js');
    assert.equal(form.elements.service.value, 'full');
    for (const [name, value] of Object.entries({name:'Test Customer',phone:'9035551234',vehicle:'Ford F150',address:'Fairfield Texas'})) form.elements[name].value = value;
    const submit = () => form.dispatchEvent(new window.Event('submit', {bubbles:true,cancelable:true}));
    const settle = () => new Promise(resolve => setImmediate(resolve));
    submit();
    // Dynamic module import can take more than one event-loop turn.
    for (let i = 0; i < 50 && !requests.length; i++) await settle();
    assert.equal(requests.length, 1);
    submit();
    assert.equal(requests.length, 1);
    resolveRequest(Response.json({message:'Try again'}, {status:503}));
    await settle(); await settle();
    assert.equal(form.elements.name.value, 'Test Customer');
    assert.match(window.document.querySelector('#formStatus').textContent, /details have been kept/);
    submit(); await settle();
    assert.equal(requests.length, 2);
    assert.equal(requests[0].requestId, requests[1].requestId);
    resolveRequest(Response.json({success:true,message:'Request received'}));
    await settle(); await settle();
    assert.equal(form.elements.name.value, '');
    assert.equal(window.document.querySelector('#formStatus').textContent, 'Request received');
    assert.equal(form.querySelector('[type="submit"]').disabled, false);
  } finally { globalThis.fetch = originalFetch; delete globalThis.document; globalThis.FormData = originalFormData; await window.happyDOM.abort(); }
});
