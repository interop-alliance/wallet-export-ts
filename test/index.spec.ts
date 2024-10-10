// import { expect } from 'chai'
import * as fs from 'node:fs'

import { exportActorProfile } from '../src'
import { outbox } from './fixtures/outbox'
import { actorProfile } from './fixtures/actorProfile'

describe('exportActorProfile', () => {
  it('calls function', async () => {
    const filename = 'out/test-export-2024-01-01.tar'
    const tarball = fs.createWriteStream(filename)

    const packStream = exportActorProfile({ actorProfile, outbox })

    packStream.pipe(tarball)
  })
})

