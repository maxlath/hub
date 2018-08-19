const errors = require('./errors')
const resolveId = require('./resolve_id')
const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const pick = require('lodash.pick')
const properties = require('./properties')
const propertiesWithUrlFormat = require('./properties_with_url_format')
const getUrlFromClaim = require('./get_url_from_claim')

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
  return Object.keys(claims)
  .reduce((data, prop) => {
    const value = claims[prop][0]
    if (value) data[prop] = getLinkData(qid, prop, value)
    return data
  }, {})
}

const getLinkData = (qid, prop, value) => {
  var { label, logo } = properties[prop]
  label = label.replace(/ ID$/, '')
  const url = getUrlFromClaim(prop, value, { width: 16 })
  const data = { label, url }
  if (logo) {
    data.icon = `https://commons.wikimedia.org/wiki/Special:FilePath/${logo}?width=16`
  }
  return data
}
