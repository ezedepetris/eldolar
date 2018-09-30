import Nacion from '../../../src/services/fetchers/nacion'
import BankOptions from '../../../src/services/bankInterfaces'
import { expect } from 'chai'
import * as nock from 'nock'
import * as fs from 'fs'

describe('fetchers/nacion', () => {
  beforeEach( () => {
    const fetcher = new Nacion()
    const page = fs.readFileSync('test/services/data/nacion.html')
    
    nock(fetcher.url)
    .get('')
    .reply(200, page, { 'content-type': 'text/html' })
  })
  
  it ('should return something', async () => {
    const fetcher = new Nacion()
    const result : BankOptions = await fetcher.run()
  
    expect(result.name).to.equal('Nación')
    expect(result.buy).to.equal(46.3)
    expect(result.sell).to.equal(48.1)
  })
})
