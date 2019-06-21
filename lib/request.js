const breq = require('bluereq')
const headers = {
  'user-agent': 'Hub (https://tools.wmflabs.org/hub)'
}

module.exports = {
  get: url => {
    var followRedirect
    if (typeof url !== 'string') {
      followRedirect = url.followRedirect
      url = url.url
    }
    return breq.get({ url, headers, followRedirect })
    .catch(err => {
      console.error(err.message, err.statusCode, { url, headers, followRedirect })
      throw err
    })
  }
}
