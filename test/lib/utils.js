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
    logger.warn('undesired positive res', res)
    done(new Error('.then function was expected not to be called'))
  },
  undesiredErr: done => err => {
    done(err)
    logger.warn('undesired err body', err.body || err)
  },

  shouldNotBeCalled: res => {
    logger.warn('undesired positive res', res)
    const err = new Error('function was expected not to be called')
    // Give 'shouldNotBeCalled' more chance to appear in the red text of the failing test
    err.name = err.statusCode = 'shouldNotBeCalled'
    err.context = { res }
    throw err
  },
}
