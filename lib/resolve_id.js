const wdk = require('wikidata-sdk')
const request = require('./request')
const errors = require('./errors')
const logger = require('./logger')
const findProperties = require('./find_properties')

module.exports = async (id, context) => {
  context.origin = { id }
  if (wdk.isEntityId(id)) return id

  let [ properties, ...value ] = id.split(':')
  context.origin.value = value = value.join(':')

  // It can't be a reverse claim, let ./get_redirect_url deal with it
  if (properties.length < 2 || value === '') return id
  // Let ./get_redirect_url handle sitelink alias ids
  if (wdk.isSitelinkKey(properties)) return id
  // including in Wikipedia short version
  if (wdk.isSitelinkKey(properties + 'wiki')) return id

  context.origin.properties = properties = findProperties(properties)

  logger.info('origin properties', properties)
  logger.info('origin value', value)

  // In both cases, there doesn't seem to be a clear associated property
  // Let's consider that the intent was to look for a sitelink title
  if (properties.length === 0) return id
  if (properties.length > 10) return id

  const url = wdk.getReverseClaims(properties, value, {
    // TODO: re-enable caseInsensitive parameter for cases where
    // there aren't too many occurences of the property
    // caseInsensitive: true,
    keepProperties: true,
    limit: 1
  })

  const { data } = await request.get(url)
  const results = wdk.simplify.sparqlResults(data)
  const ids = results.map(result => result.subject)
  if (ids.length > 0) {
    context.origin.qid = ids[0]
    return ids[0]
  } else {
    throw errors.new('no id found', 400, { properties, value })
  }
}
