#!/usr/bin/env node

const { decode } = require('./lib/decoder')

async function run () {
  const input = await readStdin()
  const results = decode(input)

  if (results.length === 0) {
    throw new Error('解読できませんでした')
  }

  for (const result of results) {
    console.log(result.text)
  }
}

/**
 * @returns {string}
 */
async function readStdin () {
  let text = ''
  for await (const chunk of process.stdin) {
    text += chunk
  }
  return text
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
