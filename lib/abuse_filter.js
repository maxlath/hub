import { newError } from './errors.js'

const wikiPathPattern = /^w(iki)?\//

export function rejectAbuseQueries (req) {
  const path = req.params[0]
  if (isLikelyAbusivePath(path)) {
    throw newError('denied request', 403, { path })
  }
}

function isLikelyAbusivePath (path) {
  if (wikiPathPattern.test(path)) return true
  if (path.endsWith('.php')) return true
  return false
}
