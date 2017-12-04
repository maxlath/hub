const breq = require('bluereq')
const wdk = require('wikidata-sdk')
const logger = require('inv-loggers')
const errors = require('./errors')
const _ = require('./utils')
const props = [ 'sitelinks' ]
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  const { id } = req.params

  if (!wdk.isEntityId(id)) {
    return errors.bundle(res, 'invalid Wikidata entity id', 400, { id })
  }

  var { site, lang } = req.query
  site = site || 'wiki'
  lang = lang || 'en'

  const entityUrl = wdk.getEntities({ ids: id, props })

  breq.get(entityUrl)
  .then(getEntity(id))
  .then(getRedirectUrl(site, lang))
  .then(logger.Log('URL'))
  .then(url => res.redirect(url))
  .catch(errors.Handle(res))
}

const getEntity = id => res => res.body.entities[id]
