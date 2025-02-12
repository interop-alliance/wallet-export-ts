import { type Readable } from 'stream';
/**
 * Validates the structure and content of an exported ActivityPub tarball.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @returns A promise that resolves to an object with `valid` (boolean) and `errors` (string[]).
 */
export declare function validateExportStream(tarStream: Readable): Promise<{
    valid: boolean;
    errors: string[];
}>;
//# sourceMappingURL=verify.d.ts.map