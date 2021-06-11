const base64 = require('./base64')

/**
 * @typedef {Object} DecodingResult
 * @property {string} encoding
 * @property {string} text
 */

/**
 * @param {string} input
 * @returns {Array<DecodingResult>}
 */
function decode (input) {
  if (base64.test(input)) {
    try {
      const buffer = base64.decode(input)
      return decodeBuffer(buffer)
    } catch {}
  }

  return []
}

/**
 * @param {Uint8Array} buffer
 * @returns {Array<DecodingResult>}
 */
function decodeBuffer (buffer) {
  const encodings = buffer.indexOf(0x1B) >= 0 ? ['iso-2022-jp'] : ['utf-8', 'euc-jp', 'shift_jis']
  const results = []
  for (const encoding of encodings) {
    const decoder = new TextDecoder(encoding, { fatal: true })
    try {
      const text = decoder.decode(buffer)
      results.push({ encoding, text })
    } catch {}
  }
  return results
}

module.exports = { decode }
