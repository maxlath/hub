require('should')
const { get } = require('./lib/utils')

describe('hub:prop', () => {
  it('should redirect using the passed property', done => {
    get('/Q37033?prop=P856')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://www.w3.org/')
      done()
    })
    .catch(done)
  })
})
