import wdk from 'wikibase-sdk/wikidata.org'
import propertiesLinksData from '../assets/js/properties_links_data.js'
import { handleError } from './errors.js'
import getUrlFromClaim from './get_url_from_claim.js'
import { get } from './request.js'
import { resolveId } from './resolve_id.js'
import { pick } from './utils.js'
import { addWikidataBasedSitesLinksData } from './wikidata_based_sites.js'

const propertiesWithUrlFormat = Object.keys(propertiesLinksData)

export async function linksController (req, res) {
  let { shortlist } = req.query
  if (shortlist) shortlist = shortlist.split('|')

  const context = { shortlist }

  try {
    const id = await resolveId(req.params[0], context)
    const results = await getEntityLinks(id, shortlist)
    res.json(results)
  } catch (err) {
    handleError(err)
  }
}

async function getEntityLinks (id, shortlist) {
  const res = await get(wdk.getEntities({ ids: id }))
  let { claims } = res.parsedBody.entities[id]
  if (shortlist) claims = pick(claims, shortlist)
  const urlifyableClaims = pick(claims, propertiesWithUrlFormat)
  const simplifiedUrlifyableClaims = wdk.simplify.claims(urlifyableClaims)
  return getLinksData(id, simplifiedUrlifyableClaims, shortlist)
}

function getLinksData (qid, claims, shortlist) {
  const data = {}
  Object.keys(claims).forEach(property => {
    const value = claims[property][0]
    if (value) data[property] = getLinkData(qid, property, value)
  })
  return addWikidataBasedSitesLinksData(data, qid, shortlist)
}

function getLinkData (qid, property, value) {
  const { label, icon } = propertiesLinksData[property]
  const url = getUrlFromClaim(property, value, { width: 16 })
  return { property, label, url, icon }
}
