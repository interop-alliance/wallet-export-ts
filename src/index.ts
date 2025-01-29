/*!
 * Copyright (c) 2024 Interop Alliance and Dmitri Zagidulin. All rights reserved.
 */
import * as tar from 'tar-stream'
import { type Pack } from 'tar-stream'
import YAML from 'yaml'
import { type Readable } from 'stream'
import path from 'path'

export interface ActorProfileOptions {
  actorProfile?: any
  outbox?: any
  followers?: any
  followingAccounts?: any
  lists?: any
  bookmarks?: any
  likes?: any
  blockedAccounts?: any
  blockedDomains?: any
  mutedAccounts?: any
}

export async function exportActorProfile({
  actorProfile,
  outbox,
  followers,
  followingAccounts,
  lists,
  bookmarks,
  likes,
  blockedAccounts,
  blockedDomains,
  mutedAccounts
}: ActorProfileOptions & { media?: File[] }): Promise<{
  addMediaFile: (
    fileName: string,
    buffer: ArrayBuffer,
    contentType: string
  ) => void
  finalize: () => tar.Pack
}> {
  const pack: Pack = tar.pack()

  const manifest: any = {
    'ubc-version': '0.1',
    meta: {
      createdBy: {
        client: {
          url: 'https://github.com/interop-alliance/wallet-export-ts'
        }
      }
    },
    contents: {
      'manifest.yml': {
        url: 'https://w3id.org/fep/6fcd#manifest-file'
      },
      activitypub: {
        contents: {}
      },
      media: {
        contents: {}
      }
    }
  }

  pack.entry({ name: 'activitypub', type: 'directory' })
  pack.entry({ name: 'media', type: 'directory' })

  if (actorProfile) {
    manifest.contents.activitypub.contents['actor.json'] = {
      url: 'https://www.w3.org/TR/activitypub/#actor-objects'
    }
    pack.entry(
      { name: 'activitypub/actor.json' },
      JSON.stringify(actorProfile, null, 2)
    )
  }

  if (outbox) {
    manifest.contents.activitypub.contents['outbox.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/outbox.json' },
      JSON.stringify(outbox, null, 2)
    )
  }

  if (followers) {
    manifest.contents.activitypub.contents['followers.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/followers.json' },
      JSON.stringify(followers, null, 2)
    )
  }

  if (likes) {
    manifest.contents.activitypub.contents['likes.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/likes.json' },
      JSON.stringify(likes, null, 2)
    )
  }

  if (bookmarks) {
    manifest.contents.activitypub.contents['bookmarks.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/bookmarks.json' },
      JSON.stringify(bookmarks, null, 2)
    )
  }

  if (followingAccounts) {
    manifest.contents.activitypub.contents['following.json'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/following.json' },
      JSON.stringify(followers, null, 2)
    )
  }

  if (lists) {
    manifest.contents.activitypub.contents['lists.json'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/lists.json' },
      JSON.stringify(lists, null, 2)
    )
  }

  if (blockedAccounts) {
    manifest.contents.activitypub.contents['blocked_accounts.json'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/blocked_accounts.json' },
      JSON.stringify(blockedAccounts, null, 2)
    )
  }

  if (blockedDomains) {
    manifest.contents.activitypub.contents['blocked_domains.json'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/blocked_domains.csv' },
      JSON.stringify(blockedDomains, null, 2)
    )
  }

  if (mutedAccounts) {
    manifest.contents.activitypub.contents['muted_accounts.json'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/muted_accounts.json' },
      JSON.stringify(mutedAccounts, null, 2)
    )
  }

  return {
    addMediaFile(fileName: string, buffer: ArrayBuffer, contentType: string) {
      addMediaFile(pack, manifest, fileName, buffer, contentType)
    },

    finalize() {
      pack.entry({ name: 'manifest.yaml' }, YAML.stringify(manifest))
      pack.finalize()
      return pack
    }
  }
}

/**
 * Imports an ActivityPub profile from a .tar archive stream.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @param options - Options for the import process.
 * @returns A promise that resolves to the parsed profile data.
 */
export async function importActorProfile(
  tarStream: Readable,
  options: {
    console?: Pick<Console, 'log' | 'warn' | 'error'>
    onError?: (error: Error, context: { fileName?: string }) => void
  } = {}
): Promise<Record<string, any>> {
  const { console = undefined, onError = undefined } = options
  const extract = tar.extract()
  const result: Record<string, any> = {}

  return await new Promise((resolve, reject) => {
    extract.on('entry', (header, stream, next) => {
      const originalFileName = header.name
      const basename = path.basename(originalFileName)
      console?.log('🚀 ~ extract.on ~ basename:', basename)
      const fileName = `activitypub/${basename}`

      // Skip system-generated files
      if (basename.startsWith('.')) {
        console?.warn(`Skipping system-generated file: ${fileName}`)
        next()
        return
      }

      console?.log(`Processing file: ${fileName}`)
      let content = ''

      stream.on('data', (chunk) => {
        content += chunk.toString()
      })

      stream.on('end', () => {
        try {
          if (fileName.endsWith('.json')) {
            result[fileName] = JSON.parse(content)
            console?.log('Parsed JSON file successfully:', fileName)
          } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
            result[fileName] = YAML.parse(content)
          } else if (fileName.endsWith('.csv')) {
            result[fileName] = content
          } else {
            console?.warn(`Unsupported file type: ${fileName}, skipping...`)
          }
        } catch (error: any) {
          const errorMessage = `Error processing file ${fileName}: ${error.message}`
          if (onError) {
            onError(new Error(errorMessage), { fileName })
          } else {
            reject(new Error(errorMessage))
          }
        } finally {
          next() // Always continue
        }
      })

      stream.on('error', (error: any) => {
        const errorMessage = `Stream error on file ${fileName}: ${error.message}`
        if (onError) {
          onError(new Error(errorMessage), { fileName })
        } else {
          reject(new Error(errorMessage))
        }
        next() // Continue even on stream error
      })
    })

    extract.on('finish', () => {
      console?.log('All files processed successfully.')
      resolve(result)
    })

    extract.on('error', (error) => {
      const errorMessage = `Error during tar extraction: ${error.message}`
      if (onError) {
        onError(new Error(errorMessage), {})
      } else {
        reject(new Error(errorMessage))
      }
    })

    tarStream.on('error', (error) => {
      const errorMessage = `Error in tar stream: ${error.message}`
      if (onError) {
        onError(new Error(errorMessage), {})
      } else {
        reject(new Error(errorMessage))
      }
    })

    tarStream.pipe(extract)
  })
}

function addMediaFile(
  pack: Pack,
  manifest: any,
  fileName: string,
  buffer: ArrayBuffer,
  contentType: string
): void {
  pack.entry(
    {
      name: `media/${fileName}`,
      size: buffer.byteLength
    },
    Buffer.from(buffer)
  )

  // Add media metadata to the manifest
  manifest.contents.media.contents[fileName] = {
    type: contentType,
    size: buffer.byteLength,
    lastModified: new Date().toISOString()
  }
}

export * from './verify'
