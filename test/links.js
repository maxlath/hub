import should from 'should'
import { get } from './lib/utils.js'

describe('links', function () {
  this.timeout(10000)

  it.only('should return links associated to an entity', async () => {
    const res = await get('/links/Q1972359')
    res.statusCode.should.equal(200)
    res.parsedBody.P214.should.be.an.Object()
    removeTrailingSlash(res.parsedBody.P214.url).should.equal('https://viaf.org/viaf/101675162')
    res.parsedBody.inventaire.url.should.equal('https://inventaire.io/entity/wd:Q1972359')
  })

  it.only('should return a shortlist when requested', async () => {
    const res = await get('/links/Q1972359?shortlist=inventaire|P214')
    res.statusCode.should.equal(200)
    res.parsedBody.P214.should.be.an.Object()
    removeTrailingSlash(res.parsedBody.P214.url).should.equal('https://viaf.org/viaf/101675162')
    should(res.parsedBody.P227).not.be.ok()
    res.parsedBody.inventaire.url.should.equal('https://inventaire.io/entity/wd:Q1972359')
    should(res.parsedBody.scholia).not.be.ok()
  })
})

const removeTrailingSlash = str => str.replace(/\/$/, '')
