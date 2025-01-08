import { expect } from 'chai'
import { readFileSync } from 'fs'
import { validateExportStream } from '../src/verify'

describe('validateExportStream', () => {
  it('should validate a valid tarball', async () => {
    // Load a valid tarball (e.g., exported-profile-valid.tar)
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/valid-export.tar'
    )
    const result = await validateExportStream(tarBuffer)

    expect(result.valid).to.be.true
    expect(result.errors).to.be.an('array').that.is.empty
  })

  it('should fail if manifest.yaml is missing', async () => {
    // Load a tarball with missing manifest.yaml
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/missing-manifest.tar'
    )
    const result = await validateExportStream(tarBuffer)

    expect(result.valid).to.be.false
  })

  it('should fail if actor.json is missing', async () => {
    // Load a tarball with missing actor.json
    const tarBuffer = readFileSync(
      'test/fixtures/tarball-samples/missing-actor.tar'
    )
    const result = await validateExportStream(tarBuffer)

    expect(result.valid).to.be.false
    console.log(JSON.stringify(result.errors))
  })

  // it('should fail if outbox.json is missing', async () => {
  //   // Load a tarball with missing outbox.json
  //   const tarBuffer = readFileSync(
  //     'test/fixtures/exported-profile-missing-outbox.tar'
  //   )
  //   const result = await validateExportStream(tarBuffer)

  //   expect(result.valid).to.be.false
  //   expect(result.errors).to.include(
  //     'Missing required file: activitypub/outbox.json'
  //   )
  // })

  // it('should fail if actor.json contains invalid JSON', async () => {
  //   // Load a tarball with invalid JSON in actor.json
  //   const tarBuffer = readFileSync(
  //     'test/fixtures/exported-profile-invalid-actor-json.tar'
  //   )
  //   const result = await validateExportStream(tarBuffer)

  //   expect(result.valid).to.be.false
  //   expect(result.errors).to.include(
  //     'Error processing file activitypub/actor.json: Unexpected token } in JSON at position 42'
  //   )
  // })

  // it('should fail if manifest.yaml is invalid', async () => {
  //   // Load a tarball with invalid manifest.yaml
  //   const tarBuffer = readFileSync(
  //     'test/fixtures/exported-profile-invalid-manifest.tar'
  //   )
  //   const result = await validateExportStream(tarBuffer)

  //   expect(result.valid).to.be.false
  //   expect(result.errors).to.include(
  //     'Manifest is missing required field: ubc-version'
  //   )
  // })
})
