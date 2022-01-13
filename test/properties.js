require('should')
const { get, shouldNotBeCalled } = require('./lib/utils')

describe('property', function () {
  this.timeout(10000)

  it('should reject unknown properties', async () => {
    await get('/Q37033?property=P8561241251')
    .then(shouldNotBeCalled)
    .catch(err => {
      err.statusCode.should.equal(400)
      err.body.message.should.equal('unknown property id')
    })
  })

  it('should reject unsupported properties', async () => {
    await get('/Q47598?property=P1922')
    .then(shouldNotBeCalled)
    .catch(err => {
      err.statusCode.should.equal(400)
      err.body.message.should.equal('unsupported property type')
    })
  })

  it('should accept parameters short version', async () => {
    const res = await get('/Q241?p=P242&w=1000')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000')
  })

  it('should accept properties a numeric id', async () => {
    const res = await get('/Q1396889?p=18')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Animal_Farm_-_1st_edition.jpg')
  })

  it('should accept properties numeric ids', async () => {
    const res = await get('/Q1396889?p=4840,18,94,242')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Animal_Farm_-_1st_edition.jpg')
  })

  it('should fallback', async () => {
    const res = await get('/Q241?property=P18,P242,P94,P2002')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg')
  })

  it('should support properties', async () => {
    const res = await get('/P610?p=P3254')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Wikidata:Property_proposal/Archive/8#P610')
  })

  describe('Url', () => {
    it('should support properties of type Url', async () => {
      const res = await get('/Q37033?property=P856')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.w3.org/')
    })
  })

  describe('ExternalId', () => {
    it('should support properties of type ExternalId', async () => {
      const res = await get('/Q34981?property=P1938')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.gutenberg.org/ebooks/author/35316')
    })
  })

  describe('WikibaseItem', () => {
    it('should treat properties of type WikibaseItem as redirections', async () => {
      const res = await get('/Q155?property=P38')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://en.wikipedia.org/wiki/Brazilian_real')
    })

    it('should pass the site parameters to the sub redirection', async () => {
      const res = await get('/Q155?property=P38&site=wikidata')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q173117')
    })

    it('should pass the lang parameters to the sub redirection', async () => {
      const res = await get('/Q155?property=P38&lang=nl')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://nl.wikipedia.org/wiki/Braziliaanse_real')
    })
  })

  describe('GlobeCoordinate', () => {
    it('should support properties of type GlobeCoordinate', async () => {
      const res = await get('/Q456?property=P625')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.openstreetmap.org/?mlat=45.758888888889&mlon=4.8413888888889')
    })
  })

  describe('CommonsMedia', () => {
    it('should support properties of type CommonsMedia', async () => {
      const res = await get('/Q241?property=P242')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg')
    })
    it('should accept a width parameters', async () => {
      const res = await get('/Q241?property=P242&width=1000')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000')
    })
  })

  describe('bundles', () => {
    it("should accept an 'image' bundles", async () => {
      const res = await get('/Q241?property=image')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cuba.svg')
    })

    it("should accept an 'social' bundles", async () => {
      const res = await get('/Edward_Snowden?property=social')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://twitter.com/Snowden')
    })

    // not implemented yet
    xit("should make use of external id avatars in the 'avatar' bundle", async () => {
      const res = await get('/Q4032?property=avatar&width=150')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://unavatar.now.sh/twitter/UnivLyon1')
    })

    it('should find properties with a matching label', async () => {
      const res = await get('/Q34981?property=gutenberg')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://www.gutenberg.org/ebooks/author/35316')
    })
  })

  describe('multi properties', () => {
    it('should follow 2 properties', async () => {
      // Inspired by https://twitter.com/salgo60/status/1010471186164277248
      const res = await get('/P3217:15780?property=P19|P856')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.startWith('http')
      res.headers.get('location').should.containEql('stockholm')
    })

    it('should follow several properties', async () => {
      const res = await get('/Q78491?property=P26|P20|P131|P421|P18')
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Timezones2008_UTC-5_gray.png')
    })

    it('should reject property values not found', async () => {
      await get('/Q78491?property=P26|P3966|P131')
      .then(shouldNotBeCalled)
      .catch(err => {
        err.statusCode.should.equal(404)
      })
    })

    it('should reject non-graph non-final properties', async () => {
      await get('/Q40463886?property=P3984|P31')
      .then(shouldNotBeCalled)
      .catch(err => {
        err.statusCode.should.equal(400)
        err.body.message.should.equal('invalid property chain')
      })
    })
  })
})
