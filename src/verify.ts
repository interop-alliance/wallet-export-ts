import * as tar from 'tar-stream'
import { type Readable } from 'stream'
import YAML from 'yaml'

/**
 * Validates the structure and content of an exported ActivityPub tarball.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @returns A promise that resolves to an object with `valid` (boolean) and `errors` (string[]).
 */
export async function validateExportStream(
  tarStream: Readable
): Promise<{ valid: boolean; errors: string[] }> {
  console.log('Validating export stream...')
  console.log('length of tarStream: ', tarStream)
  const extract = tar.extract()
  const errors: string[] = []
  const requiredFiles = [
    'manifest.yaml', // or 'manifest.yml'
    'activitypub/actor.json',
    'activitypub/outbox.json'
  ].map((file) => file.toLowerCase()) // Normalize to lowercase for consistent comparison
  const foundFiles = new Set<string>()

  return await new Promise((resolve) => {
    extract.on('entry', (header, stream, next) => {
      const fileName = header.name.toLowerCase() // Normalize file name
      console.log(`Processing file: ${fileName}`) // Log the file name
      foundFiles.add(fileName)

      let content = ''
      stream.on('data', (chunk) => {
        content += chunk.toString()
      })

      stream.on('end', () => {
        try {
          // Validate JSON files
          if (fileName.endsWith('.json')) {
            JSON.parse(content) // Throws an error if content is not valid JSON
          }

          // Validate manifest file
          if (fileName === 'manifest.yaml' || fileName === 'manifest.yml') {
            const manifest = YAML.parse(content)
            if (!manifest['ubc-version']) {
              errors.push('Manifest is missing required field: ubc-version')
            }
            if (!manifest.contents?.activitypub) {
              errors.push(
                'Manifest is missing required field: contents.activitypub'
              )
            }
          }
        } catch (error: any) {
          errors.push(`Error processing file ${fileName}: ${error.message}`)
        }
        next()
      })

      stream.on('error', (error) => {
        errors.push(`Stream error on file ${fileName}: ${error.message}`)
        next()
      })
    })

    extract.on('finish', () => {
      console.log('Found files:', Array.from(foundFiles)) // Debug log
      console.log('Required files:', requiredFiles) // Debug log

      // Check if all required files are present
      for (const file of requiredFiles) {
        if (!foundFiles.has(file)) {
          errors.push(`Missing required file: ${file}`)
        }
      }

      resolve({
        valid: errors.length === 0,
        errors
      })
    })

    extract.on('error', (error) => {
      errors.push(`Error during extraction: ${error.message}`)
      resolve({
        valid: false,
        errors
      })
    })

    // Pipe the ReadableStream into the extractor
    tarStream.pipe(extract)
  })
}
