const base64 = require('./base64')
const quotedPrintable = require('./quoted-printable')

const regex = /=\?([()\-._0-9:A-Za-z]+)\?([BQ])\?([^\s?]+)(?:\?=)?/g

/**
 * @param {string} input
 * @returns {string}
 */
function decode (input) {
  return input.replace(regex, (source, charset, encoding, encodedText) => {
    let decoder

    switch (encoding.toUpperCase()) {
      case 'B':
        decoder = base64
        break

      case 'Q':
        decoder = quotedPrintable
        break

      default:
        return source
    }

    const buffer = decoder.decode(encodedText, { mime: true })
    return new TextDecoder(charset).decode(buffer)
  })
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function test (input) {
  return regex.test(input)
}

module.exports = { decode, test }
