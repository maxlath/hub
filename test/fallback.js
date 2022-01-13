require('should')
const { get, shouldNotBeCalled } = require('./lib/utils')

describe('fallback', () => {
  it('should fallback to the Wikidata entity by default', async () => {
    const res = await get('/Q83232347?property=image')
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal('https://www.wikidata.org/wiki/Q83232347')
  })

  it('should fallback with a 404 when requested', async () => {
    await get('/Q83232347?property=image&fallback=404')
    .then(shouldNotBeCalled)
    .catch(err => {
      err.statusCode.should.equal(404)
    })
  })

  it('should fallback with an image when requested', async () => {
    const fallbackUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Wikimedia_error_404.png'
    const encodedFallbackUrl = encodeURIComponent(fallbackUrl)
    const res = await get(`/Q83232347?property=image&fallback=${encodedFallbackUrl}`)
    res.statusCode.should.equal(302)
    res.headers.get('location').should.equal(fallbackUrl)
  })
})
