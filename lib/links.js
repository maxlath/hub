const errors = require('./errors')
const resolveId = require('./resolve_id')
const request = require('./request')
const wdk = require('wikidata-sdk')
const { pick } = require('./utils')
const propertiesLinksData = require('./properties_links_data')
const propertiesWithUrlFormat = Object.keys(propertiesLinksData)
const getUrlFromClaim = require('./get_url_from_claim')
const { addWikidataBasedSitesLinksData } = require('./wikidata_based_sites')

module.exports = (req, res) => {
  var { shortlist } = req.query
  if (shortlist) shortlist = shortlist.split('|')

  const context = { shortlist }

  Promise.resolve()
  .then(() => resolveId(req.params[0], context))
  .then(getEntityLinks(shortlist))
  .then(res.json.bind(res))
  .catch(errors.Handle(res))
}

const getEntityLinks = shortlist => id => {
  return request.get(wdk.getEntities(id))
  .then(res => {
    var { claims } = res.data.entities[id]
    if (shortlist) claims = pick(claims, shortlist)
    const urlifyableClaims = pick(claims, propertiesWithUrlFormat)
    const simplifiedUrlifyableClaims = wdk.simplify.claims(urlifyableClaims)
    return getLinksData(id, simplifiedUrlifyableClaims, shortlist)
  })
}

const getLinksData = (qid, claims, shortlist) => {
  const data = {}
  Object.keys(claims).forEach(property => {
    const value = claims[property][0]
    if (value) data[property] = getLinkData(qid, property, value)
  })
  return addWikidataBasedSitesLinksData(data, qid, shortlist)
}

const getLinkData = (qid, property, value) => {
  var { label, icon } = propertiesLinksData[property]
  const url = getUrlFromClaim(property, value, { width: 16 })
  return { property, label, url, icon }
}
