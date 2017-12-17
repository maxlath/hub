require('should')
const { get, undesiredRes, undesiredErr } = require('./lib/utils')

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

  it('should resolve sitelink aliases with special characters', done => {
    get('/eswikinews:Categoría:Alemania')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Germany')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should resolve sitelink aliases redirections', done => {
    get('/enwiki:DIY?site=wikidata')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://wikidata.org/wiki/Q26384')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should default to enwiki', done => {
    get('/DIY')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Do_it_yourself')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should reject an invalid sitelink', done => {
    get('/eswikinews:some_missing_article')
    .then(undesiredRes(done))
    .catch(err => {
      err.statusCode.should.equal(404)
      done()
    })
    .catch(undesiredErr(done))
  })
})
