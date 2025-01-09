// import { expect } from 'chai'
import * as fs from 'node:fs'
import * as path from 'path'
import { exportActorProfile, importActorProfile } from '../src'
import { outbox } from './fixtures/outbox'
import { actorProfile } from './fixtures/actorProfile'
import { expect } from 'chai'
import { Readable } from 'node:stream'

describe('exportActorProfile', () => {
  it('calls function', async () => {
    const filename = 'out/test-export-2024-01-01.tar'
    const tarball = fs.createWriteStream(filename)

    // Mock inputs for actor profile and outbox
    const actorProfile = { id: 'test-actor', type: 'Person' }
    const outbox = [{ id: 'post1', type: 'Note', content: 'Test content' }]

    // Initialize export stream
    const { finalize } = await exportActorProfile({ actorProfile, outbox })

    // Finalize the tarball
    const packStream = finalize()

    // Pipe the tarball to the file
    packStream.pipe(tarball)

    // Ensure the tarball finishes writing
    await new Promise((resolve, reject) => {
      tarball.on('finish', resolve)
      tarball.on('error', reject)
    })
  })
})

describe('importActorProfile', () => {
  it('extracts and verifies contents from account2.tar', async () => {
    // Load the tar file as a buffer
    const tarBuffer = fs.readFileSync(
      'test/fixtures/tarball-samples/valid-export.tar'
    )

    // Use the importActorProfile function to parse the tar contents
    const tarStream = Readable.from(tarBuffer)
    const importedData = await importActorProfile(tarStream)

    // Log or inspect the imported data structure
    // console.log('Imported Data:', importedData)

    // Example assertions to check specific files and content
    expect(importedData).to.have.property('activitypub/actor.json')
  })
})
