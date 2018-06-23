require('should')
const { get, undesiredRes, undesiredErr } = require('./lib/utils')

describe('property', function () {
  this.timeout(10000)

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

  it('should accept properties a numeric id', done => {
    get('/Q100?p=18')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Boston_Montage.jpg')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should accept properties numeric ids', done => {
    get('/Q100?p=4840,18,94,242')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Boston_Montage.jpg')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should fallback', done => {
    get('/Q241?property=P18,P242,P94,P2002')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should support properties', done => {
    get('/P610?p=P1855')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Norway')
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
        res.headers.location.should.equal('https://www.wikidata.org/wiki/Q173117')
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
      get('/Q456?property=P625')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.openstreetmap.org/?mlat=45.758888888889&mlon=4.8413888888889')
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
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg')
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

  describe('bundles', () => {
    it("should accept an 'image' bundles", done => {
      get('/Q241?property=image')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cuba.svg')
        done()
      })
      .catch(undesiredErr(done))
    })

    it("should accept an 'social' bundles", done => {
      get('/Edward_Snowden?property=social')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://twitter.com/Snowden')
        done()
      })
      .catch(undesiredErr(done))
    })
    it("should make use of external id avatars in the 'avatar' bundle", done => {
      get('/Q4032?property=avatar&width=150')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://avatars.io/twitter/UnivLyon1/large')
        done()
      })
      .catch(undesiredErr(done))
    })
    it('should find properties with a matching label', done => {
      get('/Q34981?property=gutenberg')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://www.gutenberg.org/ebooks/author/35316')
        done()
      })
      .catch(undesiredErr(done))
    })
  })

  describe('multi properties', () => {
    it('should follow 2 properties', done => {
      // Example from https://twitter.com/salgo60/status/1010471186164277248
      get('/P3217:8143?property=P19|P5324')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://sok.riksarkivet.se/?postid=ArkisRef%20SE/SSA/6009')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should follow several properties', done => {
      get('/Q78491?property=P26|P20|P131|P421|P18')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.location.should.equal('https://commons.wikimedia.org/wiki/Special:FilePath/Timezones2008_UTC-5_gray.png')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should reject property values not found', done => {
      get('/Q78491?property=P26|P3966|P131')
      .then(undesiredRes(done))
      .catch(err => {
        err.statusCode.should.equal(404)
        done()
      })
    })

    it('should reject non-graph non-final properties', done => {
      get('/Q40463886?property=P3984|P31')
      .then(undesiredRes(done))
      .catch(err => {
        err.statusCode.should.equal(400)
        err.body.message.should.equal('invalid property chain')
        done()
      })
    })
  })
})
