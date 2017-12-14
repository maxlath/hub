require('should')
const { get, undesiredErr } = require('./lib/utils')

describe('aliases', () => {
  it('should resolve sitelink aliases', done => {
    get('/frwiki:Gilles_Deleuze')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })
  it('should resolve sitelink aliases with custom site', done => {
    get('/dewiki:Gilles_Deleuze?site=wikidata')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://wikidata.org/wiki/Q184226')
      done()
    })
    .catch(undesiredErr(done))
  })
  it('should resolve sitelink aliases with custom lang', done => {
    get('/eswikiquote:Gilles_Deleuze?lang=de')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://de.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })
})
