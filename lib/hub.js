const logger = require('./logger')
const errors = require('./errors')
const resolveId = require('./resolve_id')
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  Promise.resolve()
  .then(() => resolveId(req.params.id))
  .then(id => getRedirectUrl(id, req.headers, req.query))
  .then(applyDefaultUrl(req))
  .then(logger.Log('final URL'))
  .then(res.redirect.bind(res))
  .catch(errors.Handle(res))
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
