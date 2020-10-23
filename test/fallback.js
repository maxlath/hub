require('should')
const { get, undesiredRes } = require('./lib/utils')

describe('fallback', () => {
  it('should fallback with a 404 when requested', done => {
    get('/Q32689091?property=image&fallback=404')
    .then(undesiredRes(done))
    .catch(err => {
      err.statusCode.should.equal(404)
      done()
    })
    .catch(done)
  })

  it('should fallback with an image when requested', done => {
    const fallbackUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Wikimedia_error_404.png'
    const encodedFallbackUrl = encodeURIComponent(fallbackUrl)
    get(`/Q32689091?property=image&fallback=${encodedFallbackUrl}`)
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.get('location').should.equal(fallbackUrl)
      done()
    })
    .catch(done)
  })
})
