export function encodePCM(samples) {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  samples.forEach((value, i) => view.setInt16(i * 2, Math.round(Math.max(-1, Math.min(1, value)) * (value < 0 ? 32768 : 32767)), true));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
export function decodePCM(encoded) {
  const raw = atob(encoded);
  if (raw.length % 2) throw new Error('Invalid audio.');
  const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
  const view = new DataView(bytes.buffer);
  return Float32Array.from({length: bytes.length / 2}, (_, i) => view.getInt16(i * 2, true) / 32768);
}
