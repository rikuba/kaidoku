/**
 * @param {string} input
 * @returns {Uint8Array}
 */
function decode (input) {
  return Buffer.from(input, 'base64')
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function test (input) {
  const data = input.replace(/[\t\n\f\r\x20]/g, '')
  return /^(?:[+/0-9A-Z]{4})*(?:[+/0-9A-Z]{2}==|[+/0-9A-Z]{3}=)?$/i.test(data)
}

module.exports = { decode, test }
