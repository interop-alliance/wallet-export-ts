import { expect } from 'chai'
import { readFileSync } from 'fs'
import { validateExportStream } from '../dist'
import { Readable } from 'stream'

describe('validateExportStream', () => {
  it('should validate a valid tarball', async () => {
    // Load a valid tarball (e.g., exported-profile-valid.tar)
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/valid-export.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)
    console.log('🚀 ~ it ~ valid result:', result)

    expect(result.valid).to.be.true
    expect(result.errors).to.be.an('array').that.is.empty
  })

  it('should fail if manifest.yaml is missing', async () => {
    // Load a tarball with missing manifest.yaml
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/missing-manifest.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)
    console.log('🚀 ~ it ~ miss mani result:', result)

    expect(result.valid).to.be.false
  })

  it('should fail if actor.json is missing', async () => {
    // Load a tarball with missing actor.json
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/missing-actor.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)

    expect(result.valid).to.be.false
    console.log(JSON.stringify(result.errors))
  })

  it('should fail if outbox.json is missing', async () => {
    // Load a tarball with missing outbox.json
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/missing-outbox.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)

    expect(result.valid).to.be.false
  })

  it('should fail if actor.json contains invalid JSON', async () => {
    // Load a tarball with invalid JSON in actor.json
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/invalid-actor.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)

    expect(result.valid).to.be.false
  })

  it('should fail if manifest.yaml is invalid', async () => {
    // Load a tarball with invalid manifest.yaml
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/invalid-manifest.tar'
    )
    const tarStream = Readable.from(tarBuffer)
    const result = await validateExportStream(tarStream)

    expect(result.valid).to.be.false
  })
})
