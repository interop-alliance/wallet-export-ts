#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_fs_1 = __importDefault(require("node:fs"));
const verify_js_1 = require("./verify.js");
// Parse command-line arguments
const { values, positionals } = (0, node_util_1.parseArgs)({
    options: {
        output: {
            type: 'string',
            short: 'o'
        }
    },
    allowPositionals: true
});
const [command, filePath] = positionals;
if (command !== 'validate') {
    console.error('Usage: wallet-export validate <path-to-export.tsr>');
    process.exit(1);
}
// Handle stdin (e.g., `cat file.tar | wallet-export validate /dev/stdin`)
const inputStream = filePath === '/dev/stdin' ? process.stdin : node_fs_1.default.createReadStream(filePath);
// Validate the archive
(0, verify_js_1.validateExportStream)(inputStream)
    .then(({ valid, errors }) => {
    if (values.output === 'json') {
        // Output errors as JSON
        console.log(JSON.stringify({ valid, errors }, null, 2));
    }
    else {
        // Output errors to stdio
        if (valid) {
            console.log('✅ Export is valid.');
        }
        else {
            console.error('❌ Export is invalid:');
            errors.forEach((error) => {
                console.error(`- ${error}`);
            });
        }
    }
    // Exit with appropriate code
    if (!valid) {
        process.exit(1);
    }
})
    .catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map