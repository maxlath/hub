import { port } from '../../lib/config.js'
import { warn } from '../../lib/logger.js'
import { get as getReq } from '../../lib/request.js'

const origin = 'http://localhost:' + port

export function get (url, lang) {
  const headers = {}
  if (lang) headers['accept-language'] = lang
  return getReq(origin + url, {
    headers,
    redirect: 'manual',
  })
}

// A function to quickly fail when a test gets an undesired positive answer
export function undesiredRes (done) {
  return function (res) {
    warn('undesired positive res', res)
    done(new Error('.then function was expected not to be called'))
  }
}

export function undesiredErr (done) {
  return function (err) {
    done(err)
    warn('undesired err body', err.body || err)
  }
}

export function shouldNotBeCalled (res) {
  warn('undesired positive res', res)
  const err = new Error('function was expected not to be called')
  // Give 'shouldNotBeCalled' more chance to appear in the red text of the failing test
  err.name = err.statusCode = 'shouldNotBeCalled'
  err.context = { res }
  throw err
}
