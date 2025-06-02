export function generateTraceParent() {
  const toHex = (bytes) =>
    Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

  const version   = '00';
  const traceId   = toHex(16);
  const parentId  = toHex(8);
  const flags     = '01';
  return `${version}-${traceId}-${parentId}-${flags}`;
}
