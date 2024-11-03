// import { expect } from 'chai'
import * as fs from 'node:fs'
import * as path from 'path'
import { exportActorProfile, importActorProfile } from '../src'
import { outbox } from './fixtures/outbox'
import { actorProfile } from './fixtures/actorProfile'
import { expect } from 'chai'

describe('exportActorProfile', () => {
  it('calls function', async () => {
    const filename = 'out/test-export-2024-01-01.tar'
    const tarball = fs.createWriteStream(filename)
    const packStream = exportActorProfile({ actorProfile, outbox })

    packStream.pipe(tarball)
  })
})

describe('importActorProfile', () => {
  it('extracts and verifies contents from account2.tar', async () => {
    // Load the tar file as a buffer
    const tarBuffer = fs.readFileSync('test/fixtures/account2.tar')

    // Use the importActorProfile function to parse the tar contents
    const importedData = await importActorProfile(tarBuffer)

    // Log or inspect the imported data structure
    console.log('Imported Data:', importedData)

    // Example assertions to check specific files and content
    expect(importedData).to.have.property('activitypub/actor.json')
  })
})
