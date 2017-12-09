const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('inv-loggers')
const errors = require('./errors')
const _ = require('./utils')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropRedirectUrl = require('./get_prop_redirect_url')
const parseLangHeader = require('./parse_lang_header')

module.exports = (req, res) => {
  const { params, headers, query } = req
  const { id } = params

  if (!wdk.isEntityId(id)) {
    return errors.bundle(res, 'invalid Wikidata entity id', 400, { id })
  }

  const { props, getRedirectUrl } = getReqData(query, headers)

  const entityUrl = wdk.getEntities({ ids: id, props })

  console.log('entityUrl', entityUrl)

  breq.get(entityUrl)
  .then(res => res.body.entities[id])
  .then(getRedirectUrl)
  .then(applyDefaultUrl(id))
  .then(logger.Log('URL'))
  .then(url => res.redirect(url))
  .catch(errors.Handle(res))
}

const getReqData = (query, headers) => {
  const { prop } = query
  if (prop) {
    logger.info(prop, 'prop')
    return {
      props: 'claims',
      getRedirectUrl: getPropRedirectUrl(prop)
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
