const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('inv-loggers')
const errors = require('./errors')
const _ = require('./utils')
const props = [ 'sitelinks' ]
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  const { params, headers, query } = req
  const { id } = params

  if (!wdk.isEntityId(id)) {
    return errors.bundle(res, 'invalid Wikidata entity id', 400, { id })
  }

  const site = query.site || 'wiki'
  const lang = query.lang || parseLangHeader(headers) || 'en'
  logger.info(site, 'site')
  logger.info(lang, 'lang')

  const entityUrl = wdk.getEntities({ ids: id, props })

  breq.get(entityUrl)
  .then(getEntity(id))
  .then(getRedirectUrl(site, lang))
  .then(logger.Log('URL'))
  .then(url => res.redirect(url))
  .catch(errors.Handle(res))
}

const getEntity = id => res => res.body.entities[id]

const parseLangHeader = headers => {
  return (headers['accept-language'] || '')
  .split(',')[0]
  .trim()
  .split('-')[0]
  .trim()
  .toLowerCase()
}
