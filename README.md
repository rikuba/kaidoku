# @rikuba/kaidoku

Offline decoder that supports the following encoding/escaping format.

- MIME B/Q
- Base64
- Quoted-printable
- Percent-encoding
- HTML entities
- Charsets
  - UTF-8
  - EUC-JP
  - ISO-2022-JP
  - Shift_JIS

## Install

```
$ npm install -g @rikuba/kaidoku
```

## Usage

### decode MIME

```
$ kaidoku '=?ISO-2022-JP?B?GyRCJDMkcyRLJEEkTyEjJDUkaCQmJEokaSEjGyhC?='
こんにちは。さようなら。
```

### decode Base64

```
$ kaidoku 'pLOk7KTPpcaluaXIzdGkzsq4vs+kx6S5oaM='
これはテスト用の文章です。
```

### decode Quoted-printable

```
$ kaidoku '=A4=B3=A4=EC=A4=CF=A5=C6=A5=B9=A5=C8=CD=D1=A4=CE=CA=B8=BE=CF=A4=C7=A4=B9==A1=A3'
これはテスト用の文章です。
```

### decode Percent-encoding

```
$ kaidoku '%82%B1%82%EA%82%CD%83e%83X%83g%97p%82%CC%95%B6%8F%CD%82%C5%82%B7%81B'
これはテスト用の文章です。
```

### decode HTML entities

```
$ kaidoku '&alpha; and &#x3b2;'
α and β
```

### input file and output file

```
$ kaidoku -i hello.eml -o decoded.txt
```
