import 'should'
import { get } from './lib/utils.js'

describe('json', () => {
  it('should return as json', async () => {
    const res = await get('/Q184226?format=json')
    res.statusCode.should.equal(200)
    res.parsedBody.origin.id.should.equal('Q184226')
    res.parsedBody.destination.url.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
  })
})
