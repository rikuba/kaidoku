/* eslint-env mocha */

const assert = require('assert')
const { decode } = require('../lib/decoder')

const sampleText = `これはテスト文書です。

・Base64
・Quoted Printable
・パーセントエンコーディング

いずれかの形式により符号化されています。
`

const encodings = ['euc-jp', 'iso-2022-jp', 'shift_jis', 'utf-8']

describe('Base64', () => {
  const encodedTexts = {
    'euc-jp': 'pLOk7KTPpcaluaXIyri98aTHpLmhowoKoaZCYXNlNjQKoaZRdW90ZWQgUHJpbnRhYmxlCqGmpdGhvKW7pfOlyKWopfOls6G8pcelo6XzpbAKCqSkpLqk7KSrpM63wbywpMuk6KTqyeS55rK9pLWk7KTGpKSk3qS5oaMK',
    'iso-2022-jp': 'GyRCJDMkbCRPJUYlOSVISjg9cSRHJDkhIxsoQgoKGyRCISYbKEJCYXNlNjQKGyRCISYbKEJRdW90ZWQgUHJpbnRhYmxlChskQiEmJVEhPCU7JXMlSCUoJXMlMyE8JUclIyVzJTAbKEIKChskQiQkJDokbCQrJE43QTwwJEskaCRqSWQ5ZjI9JDUkbCRGJCQkXiQ5ISMbKEIK',
    shift_jis: 'grGC6oLNg2WDWINnlbaPkYLFgreBQgoKgUVCYXNlNjQKgUVRdW90ZWQgUHJpbnRhYmxlCoFFg3CBW4Nag5ODZ4NHg5ODUoFbg2aDQoOTg08KCoKigriC6oKpgsyMYI6ugsmC5oLolYSNhom7grOC6oLEgqKC3IK3gUIK',
    'utf-8': '44GT44KM44Gv44OG44K544OI5paH5pu444Gn44GZ44CCCgrjg7tCYXNlNjQK44O7UXVvdGVkIFByaW50YWJsZQrjg7vjg5Hjg7zjgrvjg7Pjg4jjgqjjg7PjgrPjg7zjg4fjgqPjg7PjgrAKCuOBhOOBmuOCjOOBi+OBruW9ouW8j+OBq+OCiOOCiuespuWPt+WMluOBleOCjOOBpuOBhOOBvuOBmeOAggo='
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

  it('should decode base64 (more than one result)', () => {
    const results = decode('8Km4vQ==')
    assert(results.length > 1)

    const result = results.find((result) => result.encoding === 'utf-8')
    assert(result !== undefined)

    assert.strictEqual(result.text, '𩸽')
  })

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
