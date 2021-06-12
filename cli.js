#!/usr/bin/env node

const { cac } = require('cac')
const { prompt } = require('enquirer')
const fs = require('fs')
const { decode } = require('./lib/decoder')

function run () {
  const cli = cac()
  cli.option('-i, --input <file>', '指定されたファイルの内容を解析する')
  cli.option('-o, --output <file>', '指定されたファイルに解析結果を出力する')

  cli.command('[string]', '解析する文字列').action((input, options) => {
    if (options.input) {
      input = fs.readFileSync(options.input, { encoding: 'utf-8' })
    }

    decodeInput(input, options).catch((e) => {
      console.error(e)
      process.exit(1)
    })
  })

  cli.help()

  cli.parse()
}

/**
 * @param {string} input
 * @param {Object} options
 */
async function decodeInput (input, options) {
  const results = decode(input).filter((result) => result.text !== '')

  if (results.length === 0) {
    throw new Error('解読できませんでした')
  }

  const result = results.length === 1 ? results[0] : await selectDecodingResult(results)

  if (options.output) {
    fs.writeFileSync(options.output, result.text, { encoding: 'utf-8' })
  } else {
    console.log(result.text)
  }
}

/**
 * @param {Array<import('./lib/decoder').DecodingResult>} results
 */
async function selectDecodingResult (results) {
  const choices = results.map((result) => {
    const sample = result.text.replace(/\t\n\f\r/g, ' ').slice(0, 60)
    return {
      name: `${result.encoding}: ${sample}`,
      value: result.encoding
    }
  })

  const answers = await prompt({
    type: 'select',
    name: 'encoding',
    message: '適切なデコード結果を選択してください',
    choices,
    result () {
      return this.focused.value
    }
  })

  const encoding = answers.encoding
  return results.find((result) => result.encoding === encoding)
}

run()
