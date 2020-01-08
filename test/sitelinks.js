require('should')
const { get, undesiredErr } = require('./lib/utils')

describe('sitelinks', function () {
  this.timeout(10000)

  it('should redirect to the English Wikipedia by default', done => {
    get('/Q184226')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should guess the language from the headers', done => {
    get('/Q184226', 'fr')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://fr.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should give priority to the language in the query', done => {
    get('/Q184226?lang=de', 'fr')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://de.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should take the site from the query', done => {
    get('/Q184226?site=wikiquote')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikiquote.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should combine site and lang query parameters', done => {
    get('/Q184226?site=wikiquote&lang=fr')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://fr.wikiquote.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should return the site for the first matching lang in the fallback chain', done => {
    get('/Q184226?lang=als,nl,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://nl.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should return the site for the first matching lang in the fallback chain, even on the fallback site', done => {
    get('/Q184226?site=wikivoyage&lang=als,nl,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://nl.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should fallback in the same project', done => {
    get('/Q184226?site=wikiquote&lang=ja')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikiquote.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should fallback on the next project in the site chain', done => {
    get('/Q184226?site=wikivoyage,wikiquote,wikipedia&lang=als,oc,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://fr.wikiquote.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should be able to fallback on wikidata', done => {
    get('/Q184226?site=wikivoyage,wikidata,wikipedia&lang=als,oc,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should accept parameters short version', done => {
    get('/Q184226?s=wikivoyage,wikidata,wikipedia&l=als,oc,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should support projects short versions', done => {
    get('/Q184226?s=wv,wd,wp&l=als,oc,fr,en')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should support properties', done => {
    get('/P610')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Property:P610')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should support sites using Wikidata ids', done => {
    get('/Q4911143?site=scholia')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://tools.wmflabs.org/scholia/Q4911143')
      done()
    })
    .catch(undesiredErr(done))
  })
})
