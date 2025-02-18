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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExportStream = validateExportStream;
const tar = __importStar(require("tar-stream"));
const yaml_1 = __importDefault(require("yaml"));
const path_1 = __importDefault(require("path"));
/**
 * Validates the structure and content of an exported ActivityPub tarball.
 * @param tarStream - A ReadableStream containing the .tar archive.
 * @returns A promise that resolves to an object with `valid` (boolean) and `errors` (string[]).
 */
async function validateExportStream(tarStream) {
    console.log('Validating export stream...');
    const extract = tar.extract();
    const errors = [];
    const requiredFiles = [
        'manifest.yaml', // or 'manifest.yml'
        'activitypub/actor.json',
        'activitypub/outbox.json'
    ].map((file) => file.toLowerCase()); // Normalize to lowercase for consistent comparison
    const foundFiles = new Set();
    return await new Promise((resolve) => {
        extract.on('entry', (header, stream, next) => {
            const originalFileName = header.name;
            const basename = path_1.default.basename(originalFileName);
            const fileName = basename === 'manifest.yaml'
                ? 'manifest.yaml'
                : `activitypub/${basename}`;
            // Skip system-generated files
            if (basename.startsWith('.')) {
                console?.warn(`Skipping system-generated file: ${fileName}`);
                next();
                return;
            }
            foundFiles.add(fileName);
            let content = '';
            stream.on('data', (chunk) => {
                content += chunk.toString();
            });
            stream.on('end', () => {
                try {
                    // Validate JSON files
                    if (fileName.endsWith('.json')) {
                        JSON.parse(content); // Throws an error if content is not valid JSON
                    }
                    // Validate manifest file
                    if (fileName === 'manifest.yaml' || fileName === 'manifest.yml') {
                        const manifest = yaml_1.default.parse(content);
                        if (!manifest['ubc-version']) {
                            errors.push('Manifest is missing required field: ubc-version');
                        }
                        if (!manifest.contents?.activitypub) {
                            errors.push('Manifest is missing required field: contents.activitypub');
                        }
                    }
                }
                catch (error) {
                    errors.push(`Error processing file ${fileName}: ${error.message}`);
                }
                next();
            });
            stream.on('error', (error) => {
                errors.push(`Stream error on file ${fileName}: ${error.message}`);
                next();
            });
        });
        extract.on('finish', () => {
            // Check if all required files are present
            for (const file of requiredFiles) {
                if (!foundFiles.has(file)) {
                    errors.push(`Missing required file: ${file}`);
                }
            }
            resolve({
                valid: errors.length === 0,
                errors
            });
        });
        extract.on('error', (error) => {
            errors.push(`Error during extraction: ${error.message}`);
            resolve({
                valid: false,
                errors
            });
        });
        // Pipe the ReadableStream into the extractor
        tarStream.pipe(extract);
    });
}
//# sourceMappingURL=verify.js.map