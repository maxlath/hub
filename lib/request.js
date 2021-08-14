const fetch = require('node-fetch')
const userAgent = 'Hub (https://hub.toolforge.org)'
const { magenta } = require('tiny-chalk')
let requestId = 0

module.exports = {
  get: async (url, options = {}) => {
    options.headers = options.headers || {}
    options.headers['user-agent'] = userAgent
    const reqTimerKey = magenta(`GET ${url} [r${++requestId}]`)
    console.time(reqTimerKey)
    const res = await fetch(url, options)
    res.data = await parseBody(res)
    console.timeEnd(reqTimerKey)
    res.statusCode = res.status
    if (res.status < 400) {
      return res
    } else {
      throw requestError(res, url, options)
    }
  }
}

const parseBody = async res => {
  let body = await res.text()
  if (body[0] === '{') body = JSON.parse(body)
  return body
}

const requestError = (res, url, options) => {
  const { status, data: body } = res
  const err = new Error('request error')
  err.context = { url, body, options, status }
  err.stack += `\nContext: ${JSON.stringify(err.context)}`
  err.statusCode = err.status = status
  err.body = body
  return err
}
