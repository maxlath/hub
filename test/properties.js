require('should')
const { get, undesiredRes, undesiredErr } = require('./lib/utils')

describe('property', () => {
  it('should reject invalid properties', done => {
    get('/Q37033?property=bla')
    .then(undesiredRes(done))
    .catch(err => {
      err.statusCode.should.equal(400)
      err.body.message.should.equal('invalid property id')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should reject unknown properties', done => {
    get('/Q37033?property=P8561241251')
    .then(undesiredRes(done))
    .catch(err => {
      err.statusCode.should.equal(400)
      err.body.message.should.equal('unknown property id')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should reject unsupported properties', done => {
    get('/Q47598?property=P1922')
    .then(undesiredRes(done))
    .catch(err => {
      err.statusCode.should.equal(400)
      err.body.message.should.equal('unsupported property type')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should accept parameters short version', done => {
    get('/Q241?p=P242&w=1000')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should fallback', done => {
    get('/Q241?property=P18,P242,P94,P2002')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://commons.wikimedia.org/wiki/File:Cuba_(orthographic_projection).svg')
      done()
    })
    .catch(undesiredErr(done))
  })

  describe('Url', () => {
    it('should support properties of type Url', done => {
      get('/Q37033?property=P856')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.w3.org/')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('ExternalId', () => {
    it('should support properties of type ExternalId', done => {
      get('/Q34981?property=P1938')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.gutenberg.org/ebooks/author/35316')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('WikibaseItem', () => {
    it('should treat properties of type WikibaseItem as redirections', done => {
      get('/Q155?property=P38')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://en.wikipedia.org/wiki/Brazilian_real')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should pass the site parameters to the sub redirection', done => {
      get('/Q155?property=P38&site=wikidata')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://wikidata.org/wiki/Q173117')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should pass the lang parameters to the sub redirection', done => {
      get('/Q155?property=P38&lang=nl')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://nl.wikipedia.org/wiki/Braziliaanse_real')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('GlobeCoordinate', () => {
    it('should support properties of type GlobeCoordinate', done => {
      get('/Q25373?property=P625')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.openstreetmap.org/?mlat=35.2542&mlon=-24.2585')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('CommonsMedia', () => {
    it('should support properties of type CommonsMedia', done => {
      get('/Q241?property=P242')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/File:Cuba_(orthographic_projection).svg')
        done()
      })
      .catch(undesiredErr(done))
    })
    it('should accept a width parameters', done => {
      get('/Q241?property=P242&width=1000')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('domains', () => {
    it("should accept an 'image' domains", done => {
      get('/Q241?property=image')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/File:Flag_of_Cuba.svg')
        done()
      })
      .catch(undesiredErr(done))
    })

    it("should accept an 'social' domains", done => {
      get('/Edward_Snowden?property=social')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://twitter.com/Snowden')
        done()
      })
      .catch(undesiredErr(done))
    })
  })
})
