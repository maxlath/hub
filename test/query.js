import 'should'
import { base } from '../lib/config.js'
import { get } from './lib/utils.js'

const parseLocation = res => res.headers.get('location').replace(base, '')

describe('query', () => {
  it('should redirect to the hub separting params with spaces', async () => {
    const res = await get('/query?q=Q3 s=wq l=es')
    res.statusCode.should.equal(302)
    parseLocation(res).should.equal('/Q3?s=wq&l=es')
  })

  it('should redirect to the hub separting params with escaped spaces', async () => {
    const res = await get('/query?q=Q3%20s=wq%20l=es')
    res.statusCode.should.equal(302)
    parseLocation(res).should.equal('/Q3?s=wq&l=es')
  })

  it('should redirect to the hub separting params with &', async () => {
    const res = await get('/query?q=Q3&s=wq&l=es')
    res.statusCode.should.equal(302)
    parseLocation(res).should.equal('/Q3?s=wq&l=es')
  })

  it('should redirect correctly despite a key with spaces', async () => {
    const res = await get('/query?q=fr:baden baden s=inv')
    res.statusCode.should.equal(302)
    parseLocation(res).should.equal('/fr:baden%20baden?s=inv')
  })

  it('should redirect empty query to the query documentation', async () => {
    const res = await get('/query')
    res.statusCode.should.equal(302)
    parseLocation(res).should.equal('/?#query-the-hub-as-a-search-engine')
  })

  describe('with sitelink urls as id', () => {
    it('should redirect from sitelink urls', async () => {
      const res = await get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29')
      res.statusCode.should.equal(302)
      parseLocation(res).should.equal('/dewiki:The_Score_(2001)')
    })

    it('should deduce a lang', async () => {
      const res = await get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 nl')
      res.statusCode.should.equal(302)
      parseLocation(res).should.equal('/dewiki:The_Score_(2001)?lang=nl')
    })

    it('should deduce a wikimedia site', async () => {
      const res = await get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 frwikisource')
      res.statusCode.should.equal(302)
      parseLocation(res).should.equal('/dewiki:The_Score_(2001)?site=frwikisource')
    })

    it('should deduce a property', async () => {
      const res = await get('/query?q=https%3A%2F%2Fde.wikipedia.org%2Fwiki%2FThe_Score_%282001%29 imdb')
      res.statusCode.should.equal(302)
      parseLocation(res).should.equal('/dewiki:The_Score_(2001)?property=imdb')
    })
  })
})
