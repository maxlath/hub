import { URL } from 'url'
import wdk from 'wikibase-sdk/wikidata.org'
import { rejectAbuseQueries } from './abuse_filter.js'
import { handleError, newError, notFound } from './errors.js'
import getRedirectUrl from './get_redirect_url.js'
import { info } from './logger.js'
import { resolveId } from './resolve_id.js'

export async function hubController (req, res) {
  const context = {}
  const format = req.query.format || req.query.f
  try {
    const id = await resolveId(req.params[0], context)
    const redirectionData = await getRedirectRecursively(id, req, context)
    const finalUrl = await applyDefaultUrl(req, context, redirectionData)
    info('final URL', finalUrl)
    redirect(res, format, context, finalUrl)
  } catch (err) {
    handleError(res, err)
  }
}

async function getRedirectRecursively (id, req, context) {
  rejectAbuseQueries(req)
  const { headers, query } = req
  const { url, entity } = await getRedirectUrl(id, headers, query, context)

  if (!query.nextProperties || query.nextProperties.length === 0) {
    return { url, entity }
  }

  if (!url) {
    const entityId = entity.id
    const property = query.property.split('|')[0]
    context.destination.notFound = { entity: entityId, property }
    throw notFound(context)
  }

  const [ keyword, redirectId ] = url.split(':')

  if (keyword === 'redirect' && wdk.isEntityId(redirectId)) {
    query.property = query.nextProperties.join('|')
    return getRedirectRecursively(redirectId, req, context)
  } else {
    throw newError('invalid property chain', 400, { propertyChain: req.query.rawProperty })
  }
}

async function applyDefaultUrl (req, context, { url, entity }) {
  if (!url) {
    info('no redirection found')
    const { fallback } = req.query
    if (fallback === '404') {
      throw newError('not found', 404, req.query)
    } else if (fallback && fallback.startsWith('http')) {
      // Validate url
      try {
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

  throw newError('invalid URL', 500)
}

function redirect (res, format, context, url) {
  if (format === 'json' || format === 'j') {
    context.destination.url = url
    res.json(context)
  } else {
    res.redirect(url)
  }
}
