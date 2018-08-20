const errors = require('./errors')
const resolveId = require('./resolve_id')
const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const pick = require('lodash.pick')
const properties = require('./properties')
const propertiesWithUrlFormat = require('./properties_with_url_format')
const getUrlFromClaim = require('./get_url_from_claim')
const { addWikidataBasedSitesLinksData } = require('./wikidata_based_sites')

module.exports = (req, res) => {
  const context = {}
  Promise.resolve()
  .then(() => resolveId(req.params[0], context))
  .then(getEntityLinks)
  .then(res.json.bind(res))
  .catch(errors.Handle(res))
}

const getEntityLinks = id => {
  return breq.get(wdk.getEntities(id))
  .then(res => {
    const entity = res.body.entities[id]
    const urlifyableClaims = pick(entity.claims, propertiesWithUrlFormat)
    const simplifiedUrlifyableClaims = wdk.simplify.claims(urlifyableClaims)
    return getLinksData(id, simplifiedUrlifyableClaims)
  })
}

const getLinksData = (qid, claims) => {
  const data = {}
  Object.keys(claims).forEach(property => {
    const value = claims[property][0]
    if (value) data[property] = getLinkData(qid, property, value)
  })
  addWikidataBasedSitesLinksData(data, qid)
  return data
}

const getLinkData = (qid, property, value) => {
  var { label, logo } = properties[property]
  label = label.replace(/ ID$/, '')
  const url = getUrlFromClaim(property, value, { width: 16 })
  const data = { label, url, property }
  if (logo) {
    data.icon = `https://commons.wikimedia.org/wiki/Special:FilePath/${logo}?width=16`
  }
  return data
}
