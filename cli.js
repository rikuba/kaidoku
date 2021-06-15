#!/usr/bin/env node

const { cac } = require('cac')
const { prompt } = require('enquirer')
const fs = require('fs')
const { decode, decodeBuffer } = require('./lib/decoder')

function run () {
  const cli = cac()
  cli.option('-i, --input <file>', '指定されたファイルの内容を解析する')
  cli.option('-o, --output <file>', '指定されたファイルに解析結果を出力する')

  cli.command('[string]', '解析する文字列').action(async (input, options) => {
    if (options.input) {
      input = await readInputFile(options.input)
    } else if (!input) {
      const result = await prompt({
        type: 'input',
        name: 'input',
        message: '解読する文字列を入力'
      })
      input = result.input
    }

    decodeInput(input, options).catch((e) => {
      console.error(e.message)
      process.exit(1)
    })
  })

  cli.help()

  cli.parse()
}

/**
 * @param {string} file
 */
async function readInputFile (file) {
  const buffer = fs.readFileSync(file)
  const results = decodeBuffer(buffer)
  if (results.length === 1) {
    return results[0].text
  }

  const result = await selectDecodingResult(results, '入力ファイルの文字コードを選択してください')
  return result.text
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

  let result
  if (results.length === 1) {
    result = results[0]
  } else {
    result = await selectDecodingResult(results, '適切なデコード結果を選択してください')
  }

  if (options.output) {
    fs.writeFileSync(options.output, result.text, { encoding: 'utf-8' })
  } else {
    console.log(result.text)
  }
}

/**
 * @param {Array<import('./lib/decoder').DecodingResult>} results
 */
async function selectDecodingResult (results, message) {
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
    message,
    choices,
    result () {
      return this.focused.value
    }
  })

  const encoding = answers.encoding
  return results.find((result) => result.encoding === encoding)
}

run()
