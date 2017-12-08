require('should')
const { port } = require('config')
const host = 'http://localhost:' + port
const breq = require('bluereq')

const get = url => breq.get({ url: host+url, followRedirect: false })

describe('hub', () => {
  it('should redirect to Wikipedia by default', done => {
    get('/Q184226')
    .then(res => {
      res.statusCode.should.equal(302)
      res.headers.location.should.equal('https://en.wikipedia.org/wiki/Gilles_Deleuze')
      done()
    })
  })
})
