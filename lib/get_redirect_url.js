const request = require('./request')
const { compact, pick, isNonEmptyString } = require('./utils')
const logger = require('./logger')
const errors = require('./errors')
const getEntityUrl = require('./get_entity_url')
const getRequestData = require('./get_request_data')
const findProperties = require('./find_properties')
const luckyEntitySearch = require('./lucky_entity_search')
const wdk = require('wikidata-sdk')

module.exports = (id, headers, query, context) => {
  // Accept both short or long versions
  extendQueryParameter(query, 's', 'site')
  extendQueryParameter(query, 'l', 'lang')
  extendQueryParameter(query, 'p', 'property')
  extendQueryParameter(query, 'w', 'width')

  var { property } = query

  if (property) {
    query.properties = compact(findProperties(property))
    logger.info('destination properties', query.properties)
  }

  const { props, getRedirectUrl } = getRequestData(query, headers, context)

  // sites and langs are added in ./get_sitelink_redirect_url
  context.destination = pick(query, [ 'properties', 'width' ])
  if (query.rawProperty) context.destination.properties = query.rawProperty

  return getUrlData(id, props, getRedirectUrl, query)
}

const extendQueryParameter = (query, short, long) => {
  if (isNonEmptyString(query[short])) query[long] = query[short]
  delete query[short]
}

const getUrlData = (id, props, getRedirectUrl, query) => {
  const entityUrl = getEntityUrl(id, props, query.lang)

  if (!entityUrl) {
    throw errors.new('invalid Wikidata entity id', 400, { id })
  }

  return request.get(entityUrl)
  .then(res => {
    const entity = Object.values(res.data.entities)[0]

    if (entity.missing == null) {
      const url = getRedirectUrl(entity)
      return { url, entity }
    }

    if (wdk.isEntityId(id)) throw errors.notFound({ id, query })

    return luckyEntitySearch(id, query.lang)
    .then(searchId => getUrlData(searchId, props, getRedirectUrl, query))
  })
}
