require('should')
const { get, undesiredErr } = require('./lib/utils')

describe('json', function () {
  it('should return as json', done => {
    get('/Q184226?format=json')
    .then(res => {
      res.statusCode.should.equal(200)
      res.data.origin.id.should.equal('Q184226')
      res.data.destination.url.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })
})
