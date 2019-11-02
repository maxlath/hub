// Adapted from https://github.com/expressjs/morgan 1.1.1
module.exports = (req, res, next) => {
  req._startAt = process.hrtime()

  const logRequest = () => {
    res.removeListener('finish', logRequest)
    res.removeListener('close', logRequest)
    const line = format(req, res)
    if (line == null) return
    process.stdout.write(line + '\n')
  }

  res.on('finish', logRequest)
  res.on('close', logRequest)

  next()
}

const format = (req, res) => {
  const { method, originalUrl: url } = req
  const { statusCode: status } = res

  var color = 32 // green
  if (status >= 500) color = 31 // red
  else if (status >= 400) color = 33 // yellow
  else if (status >= 300) color = 36 // cyan

  const responseTime = getResponseTime(req, res)

  return `\x1b[90m${method} ${url} \x1b[${color}m${status} \x1b[90m${responseTime}ms\x1b[0m`
}

const getResponseTime = (req, res) => {
  if (res._header == null || req._startAt == null) return ''
  const [ seconds, nanoseconds ] = process.hrtime(req._startAt)
  const ms = seconds * 1000 + nanoseconds / 1000000
  return ms.toFixed(3)
}
