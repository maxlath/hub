require('should')
const { get, undesiredErr } = require('./lib/utils')

describe('query', () => {
  it('should redirect to the hub separting params with spaces', done => {
    get('/query?q=Q3 s=wq l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect to the hub separting params with escaped spaces', done => {
    get('/query?q=Q3%20s=wq%20l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect to the hub separting params with &', done => {
    get('/query?q=Q3&s=wq&l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect correctly despite a key with spaces', done => {
    get('/query?q=fr:baden baden s=inv')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('/fr:baden%20baden?s=inv')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect empty query to the query documentation', done => {
    get('/query')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal('/?#query-the-hub-as-a-search-engine')
      done()
    })
    .catch(undesiredErr(done))
  })

  describe('with sitelink urls as id', () => {
    it('should redirect from sitelink urls', done => {
      get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.get('location').should.equal('/dewiki:The_Score_(2001)')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should deduce a lang', done => {
      get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 nl')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.get('location').should.equal('/dewiki:The_Score_(2001)?lang=nl')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should deduce a wikimedia site', done => {
      get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 frwikisource')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.get('location').should.equal('/dewiki:The_Score_(2001)?site=frwikisource')
        done()
      })
      .catch(undesiredErr(done))
    })

    it('should deduce a property', done => {
      get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 imdb')
      .then(res => {
        res.statusCode.should.equal(302)
        res.headers.get('location').should.equal('/dewiki:The_Score_(2001)?property=imdb')
        done()
      })
      .catch(undesiredErr(done))
    })
  })
})
