// Batch 40 ms of audio: 25 transferable messages/sec instead of 375 cloned quanta.
class NovaMicrophone extends AudioWorkletProcessor {
  constructor() {
    super();
    this.size = Math.round(sampleRate * 0.04);
    this.buffer = new Float32Array(this.size);
    this.offset = 0;
  }
  process(inputs) {
    const samples = inputs[0]?.[0];
    if (!samples) return true;
    let read = 0;
    while (read < samples.length) {
      const count = Math.min(this.size - this.offset, samples.length - read);
      this.buffer.set(samples.subarray(read, read + count), this.offset);
      this.offset += count;
      read += count;
      if (this.offset === this.size) {
        this.port.postMessage(this.buffer, [this.buffer.buffer]);
        this.buffer = new Float32Array(this.size);
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('nova-microphone', NovaMicrophone);
