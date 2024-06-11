const tar = require('tar-stream')
const pack = tar.pack() // pack is a stream

pack.entry({ name: 'app', type: 'directory' })
pack.entry({ name: 'keys', type: 'directory' })
pack.entry({ name: 'manifest.yaml' }, '---\nubc-version: 0.1\n')

// pipe the pack stream somewhere
pack.pipe(process.stdout)
