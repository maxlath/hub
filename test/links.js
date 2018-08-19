require('should')
const { get } = require('./lib/utils')

describe('links', function () {
  this.timeout(10000)

  it('should return links associated to an entity', done => {
    get('/links/Q1972359')
    .then(res => {
      res.statusCode.should.equal(200)
      console.log('body:', res.body)
      res.body.P214.should.be.an.Object()
      res.body.P214.url.should.equal('https://viaf.org/viaf/101675162')
      res.body.inventaire.url.should.equal('https://inventaire.io/entity/wd:Q1972359')
      done()
    })
    .catch(done)
  })
})
