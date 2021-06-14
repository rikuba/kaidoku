const pattern = '=(?:([0-9A-F]{2})|[\\t\\x20]*(?:\\r\\n?|\\n))|([\\t\\n\\r\\x20-\\x3C\\x3E-\\x7E])'
const matchRegex = new RegExp(pattern, 'gi')
const testRegex = new RegExp(`\\s*(?:${pattern})+\\s*`)

/**
 * @param {string} input
 * @param {Object} options
 * @returns {Uint8Array}
 */
function decode (input, options = {}) {
  const bytes = []

  const matches = input.matchAll(matchRegex)
  for (const [, hex, char] of matches) {
    if (hex) {
      const byte = parseInt(hex, 16)
      bytes.push(byte)
    } else if (char) {
      if (options.mime && char === '_') {
        bytes.push(0x20)
      } else {
        const byte = char.charCodeAt(0)
        bytes.push(byte)
      }
    }
  }

  return new Uint8Array(bytes)
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function test (input) {
  return testRegex.test(input) && input.includes('=')
}

module.exports = { decode, test }
