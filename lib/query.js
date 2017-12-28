const logger = require('./logger')

module.exports = (req, res) => {
  const { q } = req.query

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

  var query = queryParts.join('&')
  logger.log(`/${id}?${query}`, 'final URL')

  res.redirect(`/${id}?${query}`)
}
