import { Pack } from 'tar-stream'
import { Buffer } from 'buffer'

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

/**
 * Exports an actor profile and associated data as a tarball.
 * @param options - The options for the actor profile.
 * @returns A tar-stream Pack object containing the exported data.
 */
export function exportActorProfile(options: ActorProfileOptions): Pack

/**
 * Imports an actor profile from a tarball buffer.
 * @param tarBuffer - The tarball buffer containing the actor profile.
 * @returns A promise resolving to the imported actor profile data.
 */
export function importActorProfile(tarBuffer: Buffer): Promise<any>
