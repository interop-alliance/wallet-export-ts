/*!
 * Copyright (c) 2024 Interop Alliance and Dmitri Zagidulin. All rights reserved.
 */
import * as tar from 'tar-stream';
import { type Readable } from 'stream';
export interface ActorProfileOptions {
    actorProfile?: any;
    outbox?: any;
    followers?: any;
    followingAccounts?: any;
    lists?: any;
    bookmarks?: any;
    likes?: any;
    blockedAccounts?: any;
    blockedDomains?: any;
    mutedAccounts?: any;
}
export declare function exportActorProfile({ actorProfile, outbox, followers, followingAccounts, lists, bookmarks, likes, blockedAccounts, blockedDomains, mutedAccounts }: ActorProfileOptions & {
    media?: File[];
}): Promise<{
    addMediaFile: (fileName: string, buffer: ArrayBuffer, contentType: string) => void;
    finalize: () => tar.Pack;
}>;
/**
 * Imports an ActivityPub profile from a .tar archive stream.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @returns A promise that resolves to the parsed profile data.
 */
export declare function importActorProfile(tarStream: Readable): Promise<Record<string, any>>;
export * from './verify';
//# sourceMappingURL=index.d.ts.map