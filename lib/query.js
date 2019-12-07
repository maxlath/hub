const base = require('config').base()
const logger = require('./logger')
const { getSitelinkData } = require('wikidata-sdk')

module.exports = (req, res) => {
  const { q } = req.query

  if (!q || q.length === 0) {
    return res.redirect(`${base}/?#query-the-hub-as-a-search-engine`)
  }

  // If parameters were separated by spaces, they will be all in 'q'
  var parts = q.split(' ')

  var paramsStarted = false
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

  const query = queryParts.join('&')

  if (id.startsWith('http')) {
    const { key, title } = getSitelinkData(id)
    id = `${key}:${title}`
  }

  const url = `${base}/${id}?${query}`
  logger.log(url, 'final URL')

  res.redirect(url)
}
