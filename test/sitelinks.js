require('should')
const { get } = require('./lib/utils')

describe('sitelinks', function () {
  this.timeout(10000)

  it('should redirect to the English Wikipedia by default', async () => {
    const res = await get('/Q184226')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should guess the language from the headers', async () => {
    const res = await get('/Q184226', 'fr')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://fr.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should give priority to the language in the query', async () => {
    const res = await get('/Q184226?lang=de', 'fr')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://de.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should use the header in auto mode', async () => {
    const res = await get('/Q184226?lang=auto,de,fr', 'es')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://es.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should take the site from the query', async () => {
    const res = await get('/Q184226?site=wikiquote')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://en.wikiquote.org/wiki/Gilles_Deleuze')
  })

  it('should take site=wikidata from the query', async () => {
    const res = await get('/Q184226?site=wikidata')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
  })

  it('should take site=commons from the query', async () => {
    const res = await get('/Q15572052?site=commons')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Category:Xanthium%20orientale')
  })

  it('should combine site and lang query parameters', async () => {
    const res = await get('/Q184226?site=wikiquote&lang=fr')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://fr.wikiquote.org/wiki/Gilles_Deleuze')
  })

  it('should return the site for the first matching lang in the fallback chain', async () => {
    const res = await get('/Q184226?lang=als,nl,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://nl.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should return the site for the first matching lang in the fallback chain, even on the fallback site', async () => {
    const res = await get('/Q184226?site=wikivoyage&lang=als,nl,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://nl.wikipedia.org/wiki/Gilles_Deleuze')
  })

  it('should fallback in the same project', async () => {
    const res = await get('/Q184226?site=wikiquote&lang=ja')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://en.wikiquote.org/wiki/Gilles_Deleuze')
  })

  it('should fallback on the next project in the site chain', async () => {
    const res = await get('/Q184226?site=wikivoyage,wikiquote,wikipedia&lang=als,oc,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://fr.wikiquote.org/wiki/Gilles_Deleuze')
  })

  it('should be able to fallback on wikidata', async () => {
    const res = await get('/Q184226?site=wikivoyage,wikidata,wikipedia&lang=als,oc,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
  })

  it('should accept parameters short version', async () => {
    const res = await get('/Q184226?s=wikivoyage,wikidata,wikipedia&l=als,oc,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
  })

  it('should support projects short versions', async () => {
    const res = await get('/Q184226?s=wv,wd,wp&l=als,oc,fr,en')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
  })

  it('should support properties', async () => {
    const res = await get('/P610')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Property:P610')
  })

  it('should support sites using Wikidata ids', async () => {
    const res = await get('/Q4911143?site=scholia')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://scholia.toolforge.org/Q4911143')
  })
})
