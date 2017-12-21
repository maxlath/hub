const breq = require('bluereq')
const _ = require('./utils')
const logger = require('./logger')
const errors = require('./errors')
const propertyBundles = require('./property_bundles')
const values = require('lodash.values')
const getEntityUrl = require('./get_entity_url')
const getRequestData = require('./get_request_data')
const validateProperty = require('./validate_property')

module.exports = (id, headers, query) => {
  // Accept both short or long versions
  extendQueryParameter(query, 's', 'site')
  extendQueryParameter(query, 'l', 'lang')
  extendQueryParameter(query, 'p', 'property')
  extendQueryParameter(query, 'w', 'width')

  var { property } = query

  if (property) {
    var properties = property.split(',')
    properties.forEach(validateProperty)
    query.properties = propertyBundles.replace(properties)
  }

  const { props, getRedirectUrl } = getRequestData(query, headers)

  const entityUrl = getEntityUrl(id, props)

  logger.info(entityUrl, 'entityUrl')

  if (!entityUrl) {
    throw errors.new('invalid Wikidata entity id', 400, { id })
  }

  return breq.get(entityUrl)
  .then(res => {
    const entity = values(res.body.entities)[0]
    if (entity.missing != null) throw errors.new('Not Found', 404, { id, query })
    const url = getRedirectUrl(entity)
    return { url, entity }
  })
}

const extendQueryParameter = (query, short, long) => {
  if (_.isNonEmptyString(query[short])) query[long] = query[short]
}
