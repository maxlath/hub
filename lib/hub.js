const logger = require('./logger')
const errors = require('./errors')
const resolveId = require('./resolve_id')
const getRedirectUrl = require('./get_redirect_url')
const wdk = require('wikidata-sdk')
const { URL } = require('url')

module.exports = async (req, res) => {
  const context = {}
  const format = req.query.format || req.query.f
  try {
    const id = await resolveId(req.params[0], context)
    const redirectionData = await getRedirectRecursively(id, req, context)
    const finalUrl = await applyDefaultUrl(req, context, redirectionData)
    logger.info('final URL', finalUrl)
    redirect(res, format, context, finalUrl)
  } catch (err) {
    errors.handle(res, err)
  }
}

const getRedirectRecursively = async (id, req, context) => {
  const { headers, query } = req
  const { url, entity } = await getRedirectUrl(id, headers, query, context)

  if (!query.nextProperties || query.nextProperties.length === 0) {
    return { url, entity }
  }

  if (!url) {
    const entityId = entity.id
    const property = query.property.split('|')[0]
    context.destination.notFound = { entity: entityId, property }
    throw errors.notFound(context)
  }

  const [ keyword, redirectId ] = url.split(':')

  if (keyword === 'redirect' && wdk.isEntityId(redirectId)) {
    query.property = query.nextProperties.join('|')
    return getRedirectRecursively(redirectId, req, context)
  } else {
    throw errors.new('invalid property chain', 400, { propertyChain: req.query.rawProperty })
  }
}

const applyDefaultUrl = async (req, context, { url, entity }) => {
  if (!url) {
    logger.info('no redirection found')
    const { fallback } = req.query
    if (fallback === '404') {
      throw errors.new('not found', 404, req.query)
    } else if (fallback.startsWith('http')) {
      // Validate url
      try {
        // eslint-disable-next-line no-new
        new URL(fallback)
      } catch (err) {
        if (err.code === 'ERR_INVALID_URL') {
          err.statusCode = 400
          err.message = `invalid fallback url: ${fallback}`
        }
        throw err
      }
      return fallback
    } else {
      // Fallback on the Wikidata page if there is no sitelink
      return `https://www.wikidata.org/wiki/${entity.id}`
    }
  }

  if (url.startsWith('http')) return url

  if (url.startsWith('redirect:')) {
    const newId = url.split(':')[1]
    let { headers, query } = req
    // Clone the query object
    query = Object.assign({}, query)
    // Prevent re-redirecting following the property
    delete query.p
    delete query.property
    delete query.properties
    const { url: redirectUrl } = await getRedirectUrl(newId, headers, query, context)
    return redirectUrl
  }

  throw errors.new('invalid URL', 500)
}

const redirect = (res, format, context, url) => {
  if (format === 'json' || format === 'j') {
    context.destination.url = url
    res.json(context)
  } else {
    res.redirect(url)
  }
}
