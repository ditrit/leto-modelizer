/**
 * Makes an hexadecimal string of the specified length
 * @param {number} length
 */
export function randomHexString(length) {
  const buffer = new Uint32Array(length);
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer, (i) => (i % 16).toString(16)).join('');
}
