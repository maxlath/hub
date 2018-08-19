const errors = require('./errors')
const resolveId = require('./resolve_id')
const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const pick = require('lodash.pick')
const properties = require('./properties')
const propertiesWithUrlFormat = require('./properties_with_url_format')

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
    return buildUrls(id, simplifiedUrlifyableClaims)
  })
}

const buildUrls = (qid, claims) => {
  return Object.keys(claims)
  .reduce((data, prop) => {
    const externalId = claims[prop][0]
    if (externalId) data[prop] = buildUrl(qid, prop, externalId)
    return data
  }, {})
}

const buildUrl = (qid, prop, externalId) => {
  var { label, urlFormat } = properties[prop]
  label = label.replace(/ ID$/, '')
  const url = urlFormat.replace('$1', externalId)
  return { label, url }
}
