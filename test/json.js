require('should')
const { get } = require('./lib/utils')

describe('json', () => {
  it('should return as json', async () => {
    const res = await get('/Q184226?format=json')
    res.statusCode.should.equal(200)
    res.data.origin.id.should.equal('Q184226')
    res.data.destination.url.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
  })
})
