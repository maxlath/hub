const { port } = require('config')
const host = 'http://localhost:' + port
const breq = require('bluereq')

module.exports = {
  get: (url, lang) => {
    return breq.get({
      url: host+url,
      headers: { 'accept-language': lang },
      followRedirect: false
    })
  }
}
