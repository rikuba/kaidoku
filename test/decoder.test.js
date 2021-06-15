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
})

describe('Quoted Printable', () => {
  const encodedTexts = {
    'euc-jp': `=A4=B3=A4=EC=A4=CF=A5=C6=A5=B9=A5=C8=CA=B8=BD=F1=A4=C7=A4=B9=A1=A3

=A1=A6Base64
=A1=A6Quoted Printable
=A1=A6=A5=D1=A1=BC=A5=BB=A5=F3=A5=C8=A5=A8=A5=F3=A5=B3=A1=BC=A5=C7=A5=A3=
=A5=F3=A5=B0

=A4=A4=A4=BA=A4=EC=A4=AB=A4=CE=B7=C1=BC=B0=A4=CB=A4=E8=A4=EA=C9=E4=B9=E6=
=B2=BD=A4=B5=A4=EC=A4=C6=A4=A4=A4=DE=A4=B9=A1=A3
`,
    'iso-2022-jp': `=1B$B$3$l$O%F%9%HJ8=3Dq$G$9!#=1B(B

=1B$B!&=1B(BBase64
=1B$B!&=1B(BQuoted Printable
=1B$B!&%Q!<%;%s%H%(%s%3!<%G%#%s%0=1B(B

=1B$B$$$:$l$+$N7A<0$K$h$jId9f2=3D$5$l$F$$$^$9!#=1B(B
`,
    shift_jis: `=82=B1=82=EA=82=CD=83e=83X=83g=95=B6=8F=91=82=C5=82=B7=81B

=81EBase64
=81EQuoted Printable
=81E=83p=81[=83Z=83=93=83g=83G=83=93=83R=81[=83f=83B=83=93=83O

=82=A2=82=B8=82=EA=82=A9=82=CC=8C\`=8E=AE=82=C9=82=E6=82=E8=95=84=8D=86=89=
=BB=82=B3=82=EA=82=C4=82=A2=82=DC=82=B7=81B
`,
    'utf-8': `=E3=81=93=E3=82=8C=E3=81=AF=E3=83=86=E3=82=B9=E3=83=88=E6=96=87=E6=9B=B8=
=E3=81=A7=E3=81=99=E3=80=82

=E3=83=BBBase64
=E3=83=BBQuoted Printable
=E3=83=BB=E3=83=91=E3=83=BC=E3=82=BB=E3=83=B3=E3=83=88=E3=82=A8=E3=83=B3=
=E3=82=B3=E3=83=BC=E3=83=87=E3=82=A3=E3=83=B3=E3=82=B0

=E3=81=84=E3=81=9A=E3=82=8C=E3=81=8B=E3=81=AE=E5=BD=A2=E5=BC=8F=E3=81=AB=
=E3=82=88=E3=82=8A=E7=AC=A6=E5=8F=B7=E5=8C=96=E3=81=95=E3=82=8C=E3=81=A6=
=E3=81=84=E3=81=BE=E3=81=99=E3=80=82
`
  }

  for (const encoding of encodings) {
    it(`should decode quoted-printable (${encoding})`, () => {
      const encoded = encodedTexts[encoding]
      const results = decode(encoded)
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].encoding, encoding)
      assert.strictEqual(results[0].text, sampleText)
    })
  }

  it('should decode quoted-printable (more than one result)', () => {
    const results = decode('=F0=A9=B8=BD')
    assert(results.length > 1)

    const result = results.find((result) => result.encoding === 'utf-8')
    assert(result !== undefined)

    assert.strictEqual(result.text, '𩸽')
  })
})

describe('MIME', () => {
  it('should decode MIME B (euc-jp)', () => {
    const results = decode('=?EUC-JP?B?pLOk7KTPpcaluaXIzdGkzsq4vs+kx6S5oaM=?=')
    assert.strictEqual(results.length, 1)
    assert.strictEqual(results[0].text, 'これはテスト用の文章です。')
  })

  it('should decode MIME B (shift_jis)', () => {
    const results = decode('=?Shift_JIS?B?grGC6oLNg2WDWINnl3CCzJW2j82CxYK3gUI=?=')
    assert.strictEqual(results.length, 1)
    assert.strictEqual(results[0].text, 'これはテスト用の文章です。')
  })

  it('should decode MIME Q (iso-2022-jp)', () => {
    const results = decode('Subject: =?ISO-2022-JP?Q?iTunes_Movie_=1B$B%K%e!<%j%j!<%9$HCmL\\:nIJ=1B(B?=')
    assert.strictEqual(results.length, 1)
    assert.strictEqual(results[0].text, 'Subject: iTunes Movie ニューリリースと注目作品')
  })

  it('should decode MIME Q (utf-8)', () => {
    const results = decode('Subject: =?UTF-8?B?5LuK5pel44GvNuaciDE05pel44CBTW9uZGF544Gn44GZ44CC?=')
    assert.strictEqual(results.length, 1)
    assert.strictEqual(results[0].text, 'Subject: 今日は6月14日、Mondayです。')
  })
})

describe('Percent', () => {
  const sampleText = 'q=これはテスト用の文章です。'

  const encodedTexts = {
    'euc-jp': 'q=%A4%B3%A4%EC%A4%CF%A5%C6%A5%B9%A5%C8%CD%D1%A4%CE%CA%B8%BE%CF%A4%C7%A4%B9%A1%A3',
    'iso-2022-jp': 'q=%1B%24B%243%24l%24O%25F%259%25HMQ%24NJ8>O%24G%249!%23%1B(B',
    shift_jis: 'q=%82%B1%82%EA%82%CD%83e%83X%83g%97p%82%CC%95%B6%8F%CD%82%C5%82%B7%81B',
    'utf-8': 'q=%E3%81%93%E3%82%8C%E3%81%AF%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%E3%81%AE%E6%96%87%E7%AB%A0%E3%81%A7%E3%81%99%E3%80%82'
  }

  for (const encoding of encodings) {
    it(`should decode Percent-encoding (${encoding})`, () => {
      const encoded = encodedTexts[encoding]
      const results = decode(encoded)
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].encoding, encoding)
      assert.strictEqual(results[0].text, sampleText)
    })
  }
})

describe('HTML entities', () => {
  it('should decode HTML entities', () => {
    const results = decode('今日は&#171581;を見つけた。')
    assert.strictEqual(results.length, 1)
    assert.strictEqual(results[0].text, '今日は𩸽を見つけた。')
  })
})

describe('Failure', () => {
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
