require('should')
const { get, undesiredErr } = require('./lib/utils')

describe('query', () => {
  it('should redirect to the hub separting params with spaces', done => {
    get('/query?q=Q3 s=wq l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect to the hub separting params with escpaed spaces', done => {
    get('/query?q=Q3%20s=wq%20l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })

  it('should redirect to the hub separting params with &', done => {
    get('/query?q=Q3&s=wq&l=es')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('/Q3?s=wq&l=es')
      done()
    })
    .catch(undesiredErr(done))
  })
})
