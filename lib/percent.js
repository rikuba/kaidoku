/**
 * @param {string} input
 * @returns {Uint8Array}
 */
function decode (input) {
  const bytes = []

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '%') {
      const hex = input.slice(i + 1, i + 3)
      if (hex.length === 2) {
        const byte = parseInt(hex, 16)
        if (Number.isFinite(byte)) {
          bytes.push(byte)
          i += 2
          continue
        }
      }
    }

    bytes.push(input.charCodeAt(i))
  }

  return new Uint8Array(bytes)
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function test (input) {
  return /%[0-9A-F]{2}/i.test(input)
}

module.exports = { decode, test }
