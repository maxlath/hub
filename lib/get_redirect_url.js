const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('./logger')
const errors = require('./errors')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropertyRedirectUrl = require('./get_property_redirect_url')
const parseLangHeader = require('./parse_lang_header')
const properties = require('./properties')
const _ = require('./utils')

module.exports = (id, headers, query) => {
  const { property } = query

  if (property) {
    if (!wdk.isPropertyId(property)) {
      throw errors.new('invalid property id', 400, { property })
    }
    if (!properties[property]) {
      throw errors.new('unknown property id', 400, { property })
    }
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

const getEntityUrl = (id, props) => {
  if (!_.isNonEmptyString(id)) return
  if (wdk.isEntityId(id)) return wdk.getEntities({ ids: id, props })

  var [ aliasSite, ...aliasId ] = id.split(':')
  // Required for titles such as Categoría:Alemania
  aliasId = aliasId.join(':')
  if (wdk.isSitelinkKey(aliasSite) && _.isNonEmptyString(aliasId)) {
    const params = { titles: aliasId, sites: aliasSite, props }
    return wdk.getWikidataIdsFromSitelinks(params)
  }
}

const getReqData = (query, headers) => {
  const { property } = query
  if (property) {
    logger.info(property, 'property')
    return {
      props: 'claims',
      getRedirectUrl: getPropertyRedirectUrl(property)
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
