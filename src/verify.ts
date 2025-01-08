import * as tar from 'tar-stream'
import { Readable } from 'stream'
import YAML from 'yaml'

/**
 * Validates the structure and content of an exported ActivityPub tarball.
 * @param tarBuffer - A Buffer containing the .tar archive.
 * @returns A promise that resolves to an object with `valid` (boolean) and `errors` (string[]).
 */
export async function validateExportStream(
  tarBuffer: Buffer
): Promise<{ valid: boolean; errors: string[] }> {
  const extract = tar.extract()
  const errors: string[] = []
  const requiredFiles = [
    'manifest.yaml',
    'activitypub/actor.json',
    'activitypub/outbox.json'
  ]
  const foundFiles = new Set()

  return await new Promise((resolve) => {
    extract.on('entry', (header, stream, next) => {
      const fileName = header.name
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
          if (fileName === 'manifest.yaml') {
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

    // Convert Buffer to a Readable stream and pipe it to the extractor
    const stream = Readable.from(tarBuffer)
    stream.pipe(extract)
  })
}
