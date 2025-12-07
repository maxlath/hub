import wdk from 'wikibase-sdk/wikidata.org'
import { newError, notFound } from './errors.js'
import { findProperties } from './find_properties.js'
import getEntityUrl from './get_entity_url.js'
import getRequestData from './get_request_data.js'
import { info } from './logger.js'
import luckyEntitySearch from './lucky_entity_search.js'
import { get } from './request.js'
import { compact, pick, isNonEmptyString } from './utils.js'

export default function (id, headers, query, context) {
  // Accept both short or long versions
  extendQueryParameter(query, 's', 'site')
  extendQueryParameter(query, 'l', 'lang')
  extendQueryParameter(query, 'p', 'property')
  extendQueryParameter(query, 'w', 'width')

  const { property } = query

  if (property) {
    query.properties = compact(findProperties(property))
    info('destination properties', query.properties)
  }

  const { props, getRedirectUrl } = getRequestData(query, headers, context)

  // sites and langs are added in ./get_sitelink_redirect_url
  context.destination = pick(query, [ 'properties', 'width' ])
  if (query.rawProperty) context.destination.properties = query.rawProperty

  return getUrlData(id, props, getRedirectUrl, query)
}

function extendQueryParameter (query, short, long) {
  if (isNonEmptyString(query[short])) query[long] = query[short]
  delete query[short]
}

async function getUrlData (id, props, getRedirectUrl, query) {
  const entityUrl = getEntityUrl(id, props, query.lang)

  if (!entityUrl) {
    throw newError('invalid Wikidata entity id', 400, { id })
  }

  const { parsedBody } = await get(entityUrl)
  const entity = Object.values(parsedBody.entities)[0]

  if (entity.missing == null) {
    const url = getRedirectUrl(entity)
    return { url, entity }
  }

  if (wdk.isEntityId(id)) throw notFound({ id, query })

  const searchId = await luckyEntitySearch(id, query.lang)

  return getUrlData(searchId, props, getRedirectUrl, query)
}
