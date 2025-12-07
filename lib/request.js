import fetch from 'node-fetch'
import { magenta } from 'tiny-chalk'
import { newError } from './errors.js'

const userAgent = 'Hub (https://hub.toolforge.org)'

let requestId = 0

const verbose = process.env.HUB_VERBOSE_REQUESTS !== 'false'

export async function get (url, options = {}) {
  options.headers = options.headers || {}
  options.headers['user-agent'] = userAgent
  const reqTimerKey = magenta(`GET ${url} [r${++requestId}]`)
  if (verbose) console.time(reqTimerKey)
  const res = await fetch(url, options)
  res.parsedBody = await parseBody(res)
  if (verbose) console.timeEnd(reqTimerKey)
  res.statusCode = res.status
  if (res.status < 400) {
    return res
  } else {
    throw requestError(res, url, options)
  }
}

async function parseBody (res) {
  let body = await res.text()
  if (body[0] === '{') body = JSON.parse(body)
  return body
}

function requestError (res, url, options) {
  const { status, parsedBody } = res
  const err = newError('request error')
  err.context = { url, body: parsedBody, options, status }
  err.stack += `\nContext: ${JSON.stringify(err.context)}`
  err.statusCode = err.status = status
  err.body = parsedBody
  return err
}
