const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('./logger')
const errors = require('./errors')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropertyRedirectUrl = require('./get_property_redirect_url')
const parseLangHeader = require('./parse_lang_header')
const properties = require('./properties')

module.exports = (req, res) => {
  const { params, headers, query } = req
  const { id } = params

  if (!wdk.isEntityId(id)) {
    return errors.bundle(res, 'invalid Wikidata entity id', 400, { id })
  }

  const { property } = query

  if (property && !properties[property]) {
    return errors.bundle(res, 'invalid property id', 400, { property })
  }

  const { props, getRedirectUrl } = getReqData(query, headers)

  const entityUrl = wdk.getEntities({ ids: id, props })

  breq.get(entityUrl)
  .then(res => res.body.entities[id])
  .then(getRedirectUrl)
  .then(applyDefaultUrl(id))
  .then(logger.Log('URL'))
  .then(url => res.redirect(url))
  .catch(errors.Handle(res))
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

const applyDefaultUrl = id => url => {
  if (url) return url
  logger.info('no redirection found')
  // Fallback on the Wikidata page if there is no sitelink
  return `https://wikidata.org/entity/${id}`
}
