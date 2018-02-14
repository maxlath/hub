const logger = require('./logger')
const errors = require('./errors')
const resolveId = require('./resolve_id')
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  const context = {}
  const format = req.query.format || req.query.f
  Promise.resolve()
  .then(() => resolveId(req.params[0], context))
  .then(id => getRedirectUrl(id, req.headers, req.query, context))
  .then(applyDefaultUrl(req, context))
  .then(logger.Log('final URL'))
  .then(redirect(res, format, context))
  .catch(errors.Handle(res))
}

const redirect = (res, format, context) => url => {
  if (format === 'json' || format === 'j') {
    context.destination.url = url
    res.json(context)
  } else {
    res.redirect(url)
  }
}

const applyDefaultUrl = (req, context) => ({ url, entity }) => {
  if (!url) {
    logger.info('no redirection found')
    // Fallback on the Wikidata page if there is no sitelink
    return `https://www.wikidata.org/wiki/${entity.id}`
  }

  if (url.startsWith('http')) return url

  if (url.startsWith('redirect:')) {
    const newId = url.split(':')[1]
    var { headers, query } = req
    // Clone the query object
    query = Object.assign({}, query)
    // Prevent re-redirecting following the property
    delete query.p
    delete query.property
    delete query.properties
    return getRedirectUrl(newId, headers, query, context).get('url')
  }

  throw errors.new('invalid URL', 500)
}
