require('should')
const { port } = require('config')
const host = 'http://localhost:' + port
const breq = require('bluereq')

const get = (url, lang) => {
  return breq.get({
    url: host+url,
    headers: { 'accept-language': lang },
    followRedirect: false
  })
}

describe('hub', () => {
  it('should redirect to the English Wikipedia by default', done => {
    get('/Q184226')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(done)
  })

  it('should guess the language from the headers', done => {
    get('/Q184226', 'fr')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://fr.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(done)
  })

  it('should give priority to the language in the query', done => {
    get('/Q184226?lang=de', 'fr')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://de.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
    .catch(done)
  })
})
