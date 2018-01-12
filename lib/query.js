const { root } = require('config')
const logger = require('./logger')

module.exports = (req, res) => {
  const { q } = req.query

  if (!q || q.length === 0) {
    return res.redirect(`${root}/?#query-the-hub-as-a-search-engine`)
  }

  // If parameters where separated by spaces, they will be all in 'q'
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

  const id = idParts.join(' ')
  const queryParts = parts.slice(idParts.length)

  // If parameters where separated by a '&', they will have their own query key
  Object.keys(req.query).forEach(key => {
    if (key === 'q') return
    const value = req.query[key]
    queryParts.push(`${key}=${value}`)
  })

  const query = queryParts.join('&')
  const url = `${root}/${id}?${query}`
  logger.log(url, 'final URL')

  res.redirect(url)
}
