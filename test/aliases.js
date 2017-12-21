require('should')
const { get, undesiredRes, undesiredErr } = require('./lib/utils')

describe('aliases', function () {
  this.timeout(10000)

  describe('sitelinks', () => {
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
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q184226')
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
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q26384')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should default to enwiki sitelink key', done => {
      get('/DIY')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://en.wikipedia.org/wiki/Do_it_yourself')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should default to enwiki sitelink key (2)', done => {
      get('/Edward_Snowden')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://en.wikipedia.org/wiki/Edward_Snowden')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should default to wiki sitelink project', done => {
      get('/fr:COURLY')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://en.wikipedia.org/wiki/Lyon_Metropolis')
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

  describe('properties', () => {
    it('should resolve reverse claims', done => {
      get('/P2002:EFF?site=wikidata')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q624023')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should support multiple properties', done => {
      get('/P2002,P2003:EFF?site=wikidata')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q624023')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should guess possible properties from a string key', done => {
      get('/twitter:EFF?s=wd')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q624023')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should guess possible properties from a complex string key', done => {
      get('/DOI:10.1186/S13321-016-0161-3?s=wd')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q26899110')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should support multiple properties with a mix of properties and strings', done => {
      get('/P4033,twitter,P2003:EFF?site=wikidata')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q624023')
        done()
      })
      .catch(undesiredErr(done))
    })
  })
})
