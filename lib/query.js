import { getSitelinkData, isSitelinkKey } from 'wikibase-sdk'
import wdLang from 'wikidata-lang'
import { root } from './config.js'
import { info } from './logger.js'

export function queryController (req, res) {
  const { q } = req.query

  if (!q || q.length === 0) {
    return res.redirect(`${root}/?#query-the-hub-as-a-search-engine`)
  }

  // If parameters were separated by spaces, they will be all in 'q'
  const parts = q.split(' ')

  let paramsStarted = false
  const idParts = parts
    .filter(str => {
      if (paramsStarted) return false
      if (str.match('=')) {
        paramsStarted = true
        return false
      } else {
        return true
      }
    })

  let id = idParts.join(' ').trim()
  const queryParts = parts.slice(idParts.length)

  // If parameters where separated by a '&', they will have their own query key
  Object.keys(req.query).forEach(key => {
    if (key === 'q') return
    const value = req.query[key]
    queryParts.push(`${key}=${value}`)
  })

  let query = queryParts.join('&')

  let sitelinkUrl, directionArg
  if (id.startsWith('http')) {
    // URL are assumed to have encoded spaces
    // the rest can thus be used to recover query parameters
    [ sitelinkUrl, directionArg ] = id.split(/[+\s]/)
    const { key, title } = getSitelinkData(sitelinkUrl)
    id = `${key}:${title}`
  }

  if (query === '' && directionArg != null) {
    if (isLang(directionArg)) query = `lang=${directionArg}`
    else if (isSitelinkKey(directionArg)) query = `site=${directionArg}`
    else query = `property=${directionArg}`
  }

  let url = `${root}/${id}`
  if (query) url += `?${query}`

  info('final URL', url)

  res.redirect(url)
}

const isLang = str => wdLang.byCode[str] != null
