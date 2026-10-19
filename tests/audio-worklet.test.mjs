import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

for (const rate of [24000, 44100, 48000]) {
  test(`microphone batches 40ms at ${rate}Hz and transfers samples in order`, () => {
    let Processor;
    const messages = [];
    vm.runInNewContext(readFileSync(new URL('../js/receptionist-mic.js', import.meta.url), 'utf8'), {
      sampleRate: rate,
      AudioWorkletProcessor: class { port = {postMessage: (data, transfers) => {
        assert.equal(transfers[0], data.buffer);
        messages.push(Array.from(data));
      }}; },
      registerProcessor: (name, value) => { assert.equal(name, 'nova-microphone'); Processor = value; },
    });
    const processor = new Processor();
    const input = Float32Array.from({length: rate}, (_, i) => i / rate);
    for (let i = 0; i < input.length; i += 128) processor.process([[input.subarray(i, i + 128)]]);
    assert.equal(messages.length, 25);
    assert.deepEqual(messages.flat(), Array.from(input));
    assert.equal(processor.process([]), true);
  });
}
