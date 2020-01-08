const { port } = require('config')
const host = 'http://localhost:' + port
const logger = require('../../lib/logger')
const { get } = require('../../lib/request')

module.exports = {
  get: (url, lang) => {
    const headers = {}
    if (lang) headers['accept-language'] = lang
    return get(host + url, {
      headers,
      redirect: 'manual'
    })
  },
  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    logger.warn(res, 'undesired positive res')
    done(new Error('.then function was expected not to be called'))
  },
  undesiredErr: done => err => {
    done(err)
    logger.warn(err.body || err, 'undesired err body')
  }
}
