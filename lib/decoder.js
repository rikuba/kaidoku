const base64 = require('./base64')
const mime = require('./mime')
const quotedPrintable = require('./quoted-printable')

const decoders = [mime, base64, quotedPrintable]

/**
 * @typedef {Object} DecodingResult
 * @property {string=} encoding
 * @property {string} text
 */

/**
 * @param {string} input
 * @returns {Array<DecodingResult>}
 */
function decode (input) {
  for (const decoder of decoders) {
    if (decoder.test(input)) {
      const buffer = decoder.decode(input)
      if (typeof buffer === 'string') {
        return [{ text: buffer }]
      }

      try {
        return decodeBuffer(buffer)
      } catch {}
    }
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

module.exports = { decode, decodeBuffer }
