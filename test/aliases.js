import 'should'
import { get, shouldNotBeCalled } from './lib/utils.js'

describe('aliases', function () {
  this.timeout(10000)

  describe('sitelinks', () => {
    it('should resolve sitelink aliases', async () => {
      const res = await get('/frwiki:Gilles_Deleuze')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
    })

    it('should resolve sitelink aliases with custom site', async () => {
      const res = await get('/dewiki:Gilles_Deleuze?site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q184226')
    })

    it('should resolve sitelink aliases with custom lang', async () => {
      const res = await get('/eswikiquote:Gilles_Deleuze?lang=de')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://de.wikipedia.org/wiki/Gilles_Deleuze')
    })

    it('should resolve sitelink aliases with special characters', async () => {
      const res = await get('/eswikinews:Categoría:Alemania')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Germany')
    })

    it('should resolve sitelink aliases redirections', async () => {
      const res = await get('/enwiki:DIY?site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q26384')
    })

    it('should default to enwiki sitelink key', async () => {
      const res = await get('/Edward_Snowden')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Edward_Snowden')
    })

    it('should default to the wiki in the user language', async () => {
      const res = await get('/velo', 'fr')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://fr.wikipedia.org/wiki/V%C3%A9lo')
    })

    it('should fallback on the first search result when no entity can be found from sitelinks', async () => {
      const res = await get('/la mulatière', 'fr')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://fr.wikipedia.org/wiki/La_Mulati%C3%A8re')
    })

    it('should default to wiki sitelink project', async () => {
      const res = await get('/fr:COURLY')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Metropolis_of_Lyon')
    })

    it('should reject an invalid sitelink', async () => {
      await get('/eswikinews:some_missing_article')
      .then(shouldNotBeCalled)
      .catch(err => {
        err.statusCode.should.equal(404)
      })
    })
  })

  describe('properties', () => {
    it('should resolve reverse claims', async () => {
      const res = await get('/P2002:EFF?site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q624023')
    })

    it('should support multiple properties', async () => {
      const res = await get('/P2002,P2003:EFF?site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q624023')
    })

    it('should guess possible properties from a string key matching properties labels', async () => {
      const res = await get('/instagram:efforg?s=wd')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q624023')
    })

    it('should guess possible properties from a string key matching properties aliases', async () => {
      const res = await get('/hdl:10462/eadarc/7154?s=wd')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q15664389')
    })

    it('should guess possible properties from a complex string key', async () => {
      const res = await get('/DOI:10.1186/S13321-016-0161-3?s=wd')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q26899110')
    })

    it('should support multiple properties with a mix of properties and strings', async () => {
      const res = await get('/P4033,linkedin,P2003:efforg?site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q624023')
    })

    it('should support lexems', async () => {
      const res = await get('/P10041:19380')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Lexeme:L746325')
    })
  })
})
