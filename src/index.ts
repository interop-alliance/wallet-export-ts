/*!
 * Copyright (c) 2024 Interop Alliance and Dmitri Zagidulin. All rights reserved.
 */
import * as tar from 'tar-stream'
import { type Pack } from 'tar-stream'
import YAML from 'yaml'
import { Readable } from 'stream'

export type ActorProfileOptions = {
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
    // CSV headers:
    // Account address, Show boosts, Notify on new posts, Languages
    manifest.contents.activitypub.contents['following_accounts.csv'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry(
      { name: 'activitypub/following_accounts.csv' },
      followingAccounts
    )
  }

  if (lists) {
    manifest.contents.activitypub.contents['lists.csv'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry({ name: 'activitypub/lists.csv' }, lists)
  }

  if (blockedAccounts) {
    manifest.contents.activitypub.contents['blocked_accounts.csv'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry({ name: 'activitypub/blocked_accounts.csv' }, blockedAccounts)
  }

  if (blockedDomains) {
    manifest.contents.activitypub.contents['blocked_domains.csv'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry({ name: 'activitypub/blocked_domains.csv' }, blockedDomains)
  }

  if (mutedAccounts) {
    manifest.contents.activitypub.contents['muted_accounts.csv'] = {
      url: 'https://docs.joinmastodon.org/user/moving/#export'
    }
    pack.entry({ name: 'activitypub/muted_accounts.csv' }, mutedAccounts)
  }

  pack.entry({ name: 'manifest.yaml' }, YAML.stringify(manifest))

  return pack
}

export async function importActorProfile(tarBuffer: Buffer): Promise<any> {
  const extract = tar.extract()
  const result: Record<string, any> = {}

  return new Promise((resolve, reject) => {
    extract.on('entry', (header, stream, next) => {
      let content = ''

      stream.on('data', (chunk) => {
        content += chunk.toString()
      })

      stream.on('end', () => {
        // Handle JSON files
        if (header.name.endsWith('.json')) {
          try {
            result[header.name] = JSON.parse(content)
          } catch (error) {
            console.error(`Error parsing JSON from ${header.name}:`, error)
          }
        }
        // Handle YAML files
        else if (
          header.name.endsWith('.yaml') ||
          header.name.endsWith('.yml')
        ) {
          try {
            result[header.name] = YAML.parse(content)
          } catch (error) {
            console.error(`Error parsing YAML from ${header.name}:`, error)
          }
        }
        // Handle CSV files
        else if (header.name.endsWith('.csv')) {
          result[header.name] = content // Return raw CSV as a string or implement CSV parsing here if needed
        }

        next() // Process the next file in the tar archive
      })

      stream.on('error', (error) => { reject(error); })
    })

    extract.on('finish', () => { resolve(result); })

    // Stream the buffer data into the tar extractor
    const stream = Readable.from(tarBuffer)
    stream.pipe(extract)
  })
}
