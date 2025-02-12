"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportActorProfile = exportActorProfile;
exports.importActorProfile = importActorProfile;
/*!
 * Copyright (c) 2024 Interop Alliance and Dmitri Zagidulin. All rights reserved.
 */
const tar = __importStar(require("tar-stream"));
const yaml_1 = __importDefault(require("yaml"));
const path_1 = __importDefault(require("path"));
async function exportActorProfile({ actorProfile, outbox, followers, followingAccounts, lists, bookmarks, likes, blockedAccounts, blockedDomains, mutedAccounts }) {
    const pack = tar.pack();
    const manifest = {
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
    };
    pack.entry({ name: 'activitypub', type: 'directory' });
    pack.entry({ name: 'media', type: 'directory' });
    if (actorProfile) {
        manifest.contents.activitypub.contents['actor.json'] = {
            url: 'https://www.w3.org/TR/activitypub/#actor-objects'
        };
        pack.entry({ name: 'activitypub/actor.json' }, JSON.stringify(actorProfile, null, 2));
    }
    if (outbox) {
        manifest.contents.activitypub.contents['outbox.json'] = {
            url: 'https://www.w3.org/TR/activitystreams-core/#collections'
        };
        pack.entry({ name: 'activitypub/outbox.json' }, JSON.stringify(outbox, null, 2));
    }
    if (followers) {
        manifest.contents.activitypub.contents['followers.json'] = {
            url: 'https://www.w3.org/TR/activitystreams-core/#collections'
        };
        pack.entry({ name: 'activitypub/followers.json' }, JSON.stringify(followers, null, 2));
    }
    if (likes) {
        manifest.contents.activitypub.contents['likes.json'] = {
            url: 'https://www.w3.org/TR/activitystreams-core/#collections'
        };
        pack.entry({ name: 'activitypub/likes.json' }, JSON.stringify(likes, null, 2));
    }
    if (bookmarks) {
        manifest.contents.activitypub.contents['bookmarks.json'] = {
            url: 'https://www.w3.org/TR/activitystreams-core/#collections'
        };
        pack.entry({ name: 'activitypub/bookmarks.json' }, JSON.stringify(bookmarks, null, 2));
    }
    if (followingAccounts) {
        manifest.contents.activitypub.contents['following.json'] = {
            url: 'https://docs.joinmastodon.org/user/moving/#export'
        };
        pack.entry({ name: 'activitypub/following.json' }, JSON.stringify(followers, null, 2));
    }
    if (lists) {
        manifest.contents.activitypub.contents['lists.json'] = {
            url: 'https://docs.joinmastodon.org/user/moving/#export'
        };
        pack.entry({ name: 'activitypub/lists.json' }, JSON.stringify(lists, null, 2));
    }
    if (blockedAccounts) {
        manifest.contents.activitypub.contents['blocked_accounts.json'] = {
            url: 'https://docs.joinmastodon.org/user/moving/#export'
        };
        pack.entry({ name: 'activitypub/blocked_accounts.json' }, JSON.stringify(blockedAccounts, null, 2));
    }
    if (blockedDomains) {
        manifest.contents.activitypub.contents['blocked_domains.json'] = {
            url: 'https://docs.joinmastodon.org/user/moving/#export'
        };
        pack.entry({ name: 'activitypub/blocked_domains.csv' }, JSON.stringify(blockedDomains, null, 2));
    }
    if (mutedAccounts) {
        manifest.contents.activitypub.contents['muted_accounts.json'] = {
            url: 'https://docs.joinmastodon.org/user/moving/#export'
        };
        pack.entry({ name: 'activitypub/muted_accounts.json' }, JSON.stringify(mutedAccounts, null, 2));
    }
    return {
        addMediaFile(fileName, buffer, contentType) {
            addMediaFile(pack, manifest, fileName, buffer, contentType);
        },
        finalize() {
            pack.entry({ name: 'manifest.yaml' }, yaml_1.default.stringify(manifest));
            pack.finalize();
            return pack;
        }
    };
}
/**
 * Imports an ActivityPub profile from a .tar archive stream.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @returns A promise that resolves to the parsed profile data.
 */
async function importActorProfile(tarStream) {
    console.log('🚀 Starting to process tar stream...');
    const extract = tar.extract();
    const result = {};
    return await new Promise((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            // Normalize fileName to include only `activitypub/filename`
            const originalFileName = header.name;
            const fileName = `activitypub/${path_1.default.basename(originalFileName)}`;
            // Skip system-generated files
            if (fileName.startsWith('activitypub/._') ||
                fileName.endsWith('.DS_Store')) {
                console.warn(`Skipping system-generated file: ${fileName}`);
                next();
            }
            console.log(`Processing file: ${fileName}`);
            let content = '';
            stream.on('data', (chunk) => {
                content += chunk.toString();
            });
            stream.on('end', () => {
                try {
                    if (fileName.endsWith('.json')) {
                        result[fileName] = JSON.parse(content);
                        console.log('Parsed JSON file successfully:', fileName);
                    }
                    else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
                        result[fileName] = yaml_1.default.parse(content);
                    }
                    else if (fileName.endsWith('.csv')) {
                        result[fileName] = content;
                    }
                    else {
                        console.warn(`Unsupported file type: ${fileName}, skipping...`);
                    }
                }
                catch (error) {
                    console.error(`Error processing file ${fileName}:`, error.message);
                }
                finally {
                    next(); // Always continue
                }
            });
            stream.on('error', (error) => {
                console.error(`Stream error on file ${fileName}:`, error.message);
                next(); // Continue even on stream error
            });
        });
        extract.on('finish', () => {
            console.log('All files processed successfully.');
            resolve(result);
        });
        extract.on('error', (error) => {
            console.error('Error during tar extraction:', error.message);
            reject(new Error('Failed to extract tar file.'));
        });
        tarStream.on('error', (error) => {
            console.error('Error in tar stream:', error.message);
            reject(new Error('Failed to process tar stream.'));
        });
        tarStream.pipe(extract);
    });
}
function addMediaFile(pack, manifest, fileName, buffer, contentType) {
    pack.entry({
        name: `media/${fileName}`,
        size: buffer.byteLength
    }, Buffer.from(buffer));
    // Add media metadata to the manifest
    manifest.contents.media.contents[fileName] = {
        type: contentType,
        size: buffer.byteLength,
        lastModified: new Date().toISOString()
    };
}
__exportStar(require("./verify"), exports);
//# sourceMappingURL=index.js.map