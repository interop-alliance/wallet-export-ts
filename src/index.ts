/*!
 * Copyright (c) 2024 Interop Alliance and Dmitri Zagidulin. All rights reserved.
 */
import * as tar from 'tar-stream'
import { type Pack } from 'tar-stream'
import YAML from 'yaml'
import { Readable } from 'stream'
import { ActorProfileOptions } from './index.d'

export function exportActorProfile({
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
}: ActorProfileOptions): tar.Pack {
  const pack: Pack = tar.pack() // pack is a stream

  const manifest: any = {
    // Universal Backup Container spec version
    'ubc-version': '0.1',
    meta: {
      createdBy: {
        client: {
          // URL to the client that generated this export file
          url: 'https://github.com/interop-alliance/wallet-export-ts'
        }
      }
    },
    contents: {
      'manifest.yml': {
        url: 'https://w3id.org/fep/6fcd#manifest-file'
      },
      // Directory with ActivityPub-relevant exports
      activitypub: {
        contents: {}
      }
    }
  }

  pack.entry({ name: 'activitypub', type: 'directory' })

  if (actorProfile) {
    // Serialized ActivityPub Actor profile
    manifest.contents.activitypub.contents['actor.json'] = {
      url: 'https://www.w3.org/TR/activitypub/#actor-objects'
    }
    pack.entry(
      { name: 'activitypub/actor.json' },
      JSON.stringify(actorProfile, null, 2)
    )
  }

  if (outbox) {
    // ActivityStreams OrderedCollection representing the contents of the actor's Outbox
    manifest.contents.activitypub.contents['outbox.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/outbox.json' },
      JSON.stringify(outbox, null, 2)
    )
  }

  if (followers) {
    // ActivityStreams OrderedCollection representing the actor's Followers
    manifest.contents.activitypub.contents['followers.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/followers.json' },
      JSON.stringify(followers, null, 2)
    )
  }

  if (likes) {
    // ActivityStreams OrderedCollection representing Activities and Objects the actor liked
    manifest.contents.activitypub.contents['likes.json'] = {
      url: 'https://www.w3.org/TR/activitystreams-core/#collections'
    }
    pack.entry(
      { name: 'activitypub/likes.json' },
      JSON.stringify(likes, null, 2)
    )
  }

  if (bookmarks) {
    // ActivityStreams OrderedCollection representing the actor's Bookmarks
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

  pack.entry({ name: 'manifest.yaml' }, YAML.stringify(manifest))
  pack.finalize()

  return pack
}

export async function importActorProfile(tarBuffer: Buffer): Promise<any> {
  const extract = tar.extract()
  const result: Record<string, any> = {}

  return await new Promise((resolve, reject) => {
    extract.on('entry', (header, stream, next) => {
      let content = ''
      console.log(`Extracting file: ${header.name}`)

      stream.on('data', (chunk) => {
        content += chunk.toString()
      })

      stream.on('end', () => {
        try {
          if (header.name.endsWith('.json')) {
            result[header.name] = JSON.parse(content)
          } else if (
            header.name.endsWith('.yaml') ||
            header.name.endsWith('.yml')
          ) {
            result[header.name] = YAML.parse(content)
          } else if (header.name.endsWith('.csv')) {
            result[header.name] = content
          }
          console.log(`Successfully parsed: ${header.name}`)
        } catch (error) {
          console.error(`Error processing file ${header.name}:`, error)
          reject(error)
        }
        next()
      })

      stream.on('error', (error) => {
        console.error(`Stream error on file ${header.name}:`, error)
        reject(error)
      })
    })

    extract.on('finish', () => {
      console.log('Extraction complete', result)
      resolve(result)
    })

    extract.on('error', (error) => {
      console.error('Error during extraction:', error)
      reject(error)
    })

    const stream = Readable.from(tarBuffer)
    stream.pipe(extract)
  })
}
