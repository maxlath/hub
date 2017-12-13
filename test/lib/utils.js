const { port } = require('config')
const host = 'http://localhost:' + port
const breq = require('bluereq')
const logger = require('../../lib/logger')

module.exports = {
  get: (url, lang) => {
    return breq.get({
      url: host + url,
      headers: { 'accept-language': lang },
      followRedirect: false
    })
  },
  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    done(new Error(".then function was expected not to be called"))
    logger.warn(res, 'undesired positive res')
  },
  undesiredErr: done => err => {
    done(err)
    logger.warn(err.body || err, 'undesired err body')
  }
}
