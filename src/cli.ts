#!/usr/bin/env node

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import { type Readable } from 'node:stream'
import { validateExportStream } from './verify.js'

// Parse command-line arguments
const { values, positionals } = parseArgs({
  options: {
    output: {
      type: 'string',
      short: 'o'
    }
  },
  allowPositionals: true
})

const [command, filePath] = positionals

if (command !== 'validate') {
  console.error('Usage: wallet-export validate <path-to-export.tsr>')
  process.exit(1)
}

// Handle stdin (e.g., `cat file.tar | wallet-export validate /dev/stdin`)
const inputStream: Readable =
  filePath === '/dev/stdin' ? process.stdin : fs.createReadStream(filePath)

// Validate the archive
validateExportStream(inputStream)
  .then(({ valid, errors }) => {
    if (values.output === 'json') {
      // Output errors as JSON
      console.log(JSON.stringify({ valid, errors }, null, 2))
    } else {
      // Output errors to stdio
      if (valid) {
        console.log('✅ Export is valid.')
      } else {
        console.error('❌ Export is invalid:')
        errors.forEach((error) => {
          console.error(`- ${error}`)
        })
      }
    }

    // Exit with appropriate code
    if (!valid) {
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error)
    process.exit(1)
  })
