const should = require('should')
const { get } = require('./lib/utils')

describe('links', function () {
  this.timeout(10000)

  it('should return links associated to an entity', async () => {
    const res = await get('/links/Q1972359')
    res.statusCode.should.equal(200)
    res.data.P214.should.be.an.Object()
    removeTrailingSlash(res.data.P214.url).should.equal('https://viaf.org/viaf/101675162')
    res.data.inventaire.url.should.equal('https://inventaire.io/entity/wd:Q1972359')
  })

  it('should return a shortlist when requested', async () => {
    const res = await get('/links/Q1972359?shortlist=inventaire|P214')
    res.statusCode.should.equal(200)
    res.data.P214.should.be.an.Object()
    removeTrailingSlash(res.data.P214.url).should.equal('https://viaf.org/viaf/101675162')
    should(res.data.P227).not.be.ok()
    res.data.inventaire.url.should.equal('https://inventaire.io/entity/wd:Q1972359')
    should(res.data.scholia).not.be.ok()
  })
})

const removeTrailingSlash = str => str.replace(/\/$/, '')
