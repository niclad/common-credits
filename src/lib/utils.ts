/**
 * Encode a given string to hexadecimal values
 * Note: May only support ASCII characters
 * @param str The string to encode
 * @returns A string encoded to hexadecimal values
 */
function hexEncode(str: string): string {
  return str
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decode a given hexadecimal string to a string
 * @param str The hexadecimal string to decode
 * @returns A string decoded from hexadecimal values
 */
function hexDecode(str: string): string {
  const hexMatch = str.match(/.{1,2}/g);
  return hexMatch ? hexMatch.map((c) => String.fromCharCode(parseInt(c, 16))).join('') : '';
}

/**
 * Compress a hexadecimal string using an unknown (to me) compression algorithm
 * @param hex A hexadecimal string to compress
 * @returns A compressed hexadecimal string
 */
function hexCompress(hex: string) {
  // Verify that the string is a valid hexadecimal string
  if (!hex.match(/^[0-9a-fA-F]+$/)) {
    throw new Error('Invalid hexadecimal string');
  }

  hex = hex.toLowerCase();
  let compressedHex = hex;


  // Replace numbers with letters
  const charMap = ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  for (let i = 0; i < 10; i++) {
    compressedHex = compressedHex.replace(new RegExp(i.toString(), 'g'), charMap[i]);
  }

  // Compress compressedHex
  compressedHex = compressedHex.replace(/([g-p])\1{2,}/g, (match): string => {
    return match[0] + match.length;
  });

  return compressedHex.length < hex.length ? compressedHex : hex;
}

export {
  hexEncode,
  hexDecode
}