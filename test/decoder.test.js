/* eslint-env mocha */

const assert = require('assert')
const { decode } = require('../lib/decoder')

const sampleText = `吾輩は猫である。名前はまだ無い。

どこで生れたかとんと見当がつかぬ。
何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。
`

const encodings = ['euc-jp', 'iso-2022-jp', 'shift_jis', 'utf-8']

describe('Base64', () => {
  const encodedTexts = {
    'euc-jp': 'uOPH2qTPx62kx6SipOuho8y+wbCkz6TepMDMtaSkoaMKCqTJpLOkx8C4pOykv6SrpMik86TIuKvF9qSspMSkq6TMoaMKsr+kx6Tix/awxaSkpLik4aS4pOGkt6S/veqkx6XLpeOhvKXLpeOhvLXjpKSkxqSkpL+79qTApLGkz7WtsrGkt6TGpKSk66GjCrjjx9qkz6SzpLOkx7vPpOGkxr/NtNakyKSkpKak4qTOpPK4q6S/oaMK',
    'iso-2022-jp': 'GyRCOGNHWiRPRy0kRyQiJGshI0w+QTAkTyReJEBMNSQkISMbKEIKChskQiRJJDMkR0A4JGwkPyQrJEgkcyRIOCtFdiQsJEQkKyRMISMbKEIKGyRCMj8kRyRiR3YwRSQkJDgkYSQ4JGEkNyQ/PWokRyVLJWMhPCVLJWMhPDVjJCQkRiQkJD87diRAJDEkTzUtMjEkNyRGJCQkayEjGyhCChskQjhjR1okTyQzJDMkRztPJGEkRj9NNFYkSCQkJCYkYiROJHI4KyQ/ISMbKEIK',
    shift_jis: 'jOGUeYLNlEyCxYKggumBQpa8kU+CzYLcgr6Ws4KigUIKCoLHgrGCxZC2guqCvYKpgsaC8YLGjKmTloKqgsKCqYLKgUIKib2CxYLglJaIw4KigraC34K2gt+CtYK9j4qCxYNqg4OBW4Nqg4OBW4uDgqKCxIKigr2OloK+gq+CzYtMia+CtYLEgqKC6YFCCozhlHmCzYKxgrGCxY5ugt+CxJBsitSCxoKigqSC4ILMgvCMqYK9gUIK',
    'utf-8': '5ZC+6Lyp44Gv54yr44Gn44GC44KL44CC5ZCN5YmN44Gv44G+44Gg54Sh44GE44CCCgrjganjgZPjgafnlJ/jgozjgZ/jgYvjgajjgpPjgajopovlvZPjgYzjgaTjgYvjgazjgIIK5L2V44Gn44KC6JaE5pqX44GE44GY44KB44GY44KB44GX44Gf5omA44Gn44OL44Oj44O844OL44Oj44O85rOj44GE44Gm44GE44Gf5LqL44Gg44GR44Gv6KiY5oa244GX44Gm44GE44KL44CCCuWQvui8qeOBr+OBk+OBk+OBp+Wni+OCgeOBpuS6uumWk+OBqOOBhOOBhuOCguOBruOCkuimi+OBn+OAggo='
  }

  for (const encoding of encodings) {
    it(`should decode base64 (${encoding})`, () => {
      const encoded = encodedTexts[encoding]
      const results = decode(encoded)
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].encoding, encoding)
      assert.strictEqual(results[0].text, sampleText)
    })
  }

  it('should fail to decode random text', () => {
    const text = 'abcdefgh1234'
    const results = decode(text)
    assert.strictEqual(results.length, 0)
  })

  it('should fail to decode text containing illegal character', () => {
    const text = 'jOGUえYLN'
    const results = decode(text)
    assert.strictEqual(results.length, 0)
  })
})
