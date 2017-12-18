const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const _ = require('./utils')
const logger = require('./logger')
const errors = require('./errors')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropertyRedirectUrl = require('./get_property_redirect_url')
const parseLangHeader = require('./parse_lang_header')
const properties = require('./properties')
const propertyBundles = require('./property_bundles')

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

  const { props, getRedirectUrl } = getReqData(query, headers)

  const entityUrl = getEntityUrl(id, props)

  logger.info(entityUrl, 'entityUrl')

  if (!entityUrl) {
    throw errors.new('invalid Wikidata entity id', 400, { id })
  }

  return breq.get(entityUrl)
  .then(res => {
    const entity = Object.values(res.body.entities)[0]
    if (entity.missing != null) throw errors.new('Not Found', 404, { id, query })
    return entity
  })
  .then(getRedirectUrl)
}

const extendQueryParameter = (query, short, long) => {
  if (_.isNonEmptyString(query[short])) query[long] = query[short]
}

const validateProperty = property => {
  // Ignore properties bundle keys
  if (propertyBundles.bundles[property]) return

  if (!wdk.isPropertyId(property)) {
    throw errors.new('invalid property id', 400, { property })
  }
  if (!properties[property]) {
    throw errors.new('unknown property id', 400, { property })
  }
}

const getEntityUrl = (id, props) => {
  if (!_.isNonEmptyString(id)) return
  if (wdk.isEntityId(id)) return wdk.getEntities({ ids: id, props })

  var [ aliasSite, ...aliasId ] = id.split(':')
  // Required for titles such as Categoría:Alemania
  aliasId = aliasId.join(':')

  const params = { props }

  // Make sitelink project default to 'wiki':
  // ex: pass 'fr' for short version of 'frwiki'
  // Only supporting 2 letters languages for now
  // to avoid false positives
  const possibleShortLang = aliasSite.length <= 3 && _.isNonEmptyString(aliasId)
  if (possibleShortLang && wdk.isSitelinkKey(aliasSite + 'wiki')) {
    aliasSite += 'wiki'
  }

  if (wdk.isSitelinkKey(aliasSite) && _.isNonEmptyString(aliasId)) {
    params.titles = aliasId
    params.sites = aliasSite
  } else {
    // Default to enwiki as alias site and what was passed as title
    params.titles = aliasSite
    params.sites = 'enwiki'
  }
  return wdk.getWikidataIdsFromSitelinks(params)
}

const getReqData = (query, headers) => {
  const { properties } = query
  if (properties) {
    return {
      props: 'claims',
      getRedirectUrl: getPropertyRedirectUrl(query)
    }
  }

  const site = query.site || 'wiki'
  const lang = query.lang || parseLangHeader(headers) || 'en'
  logger.info(site, 'site')
  logger.info(lang, 'lang')

  return {
    props: 'sitelinks',
    getRedirectUrl: getSitelinkRedirectUrl(site, lang)
  }
}
