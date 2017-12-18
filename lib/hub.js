const logger = require('./logger')
const errors = require('./errors')
const getRedirectUrl = require('./get_redirect_url')

module.exports = (req, res) => {
  const { id } = req.params
  Promise.resolve()
  .then(() => getRedirectUrl(id, req.headers, req.query))
  .then(applyDefaultUrl(id, req))
  .then(logger.Log('final URL'))
  .then(url => res.redirect(url))
  .catch(errors.Handle(res))
}

const applyDefaultUrl = (id, req) => url => {
  if (!url) {
    logger.info('no redirection found')
    // Fallback on the Wikidata page if there is no sitelink
    return `https://www.wikidata.org/entity/${id}`
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
    return getRedirectUrl(newId, headers, query)
  }

  throw errors.new('invalid URL', 500)
}
