const logger = require('./logger')
const errors = require('./errors')
const resolveId = require('./resolve_id')
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  const context = {}
  Promise.resolve()
  .then(() => resolveId(req.params[0], context))
  .then(id => getRedirectUrl(id, req.headers, req.query, context))
  .then(applyDefaultUrl(req))
  .then(logger.Log('final URL'))
  .then(redirect(req, res, context))
  .catch(errors.Handle(res))
}

const redirect = (req, res, context) => url => {
  if (req.query.format === 'json') {
    context.destination.url = url
    res.json(context)
  } else {
    res.redirect(url)
  }
}

const applyDefaultUrl = req => ({ url, entity }) => {
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
    return getRedirectUrl(newId, headers, query).get('url')
  }

  throw errors.new('invalid URL', 500)
}
