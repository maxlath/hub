const logger = require('./logger')

module.exports = (req, res) => {
  const { q } = req.query

  logger.info(q, 'query')

  // If parameters where separated by spaces, they will be all in 'q'
  var parts = q.split(' ')
  const id = parts[0]

  // If parameters where separated by a '&', they will have their own query key
  Object.keys(req.query).forEach(key => {
    if (key === 'q') return
    const value = req.query[key]
    parts.push(`${key}=${value}`)
  })

  var query = parts.slice(1).join('&')

  res.redirect(`/${id}?${query}`)
}
