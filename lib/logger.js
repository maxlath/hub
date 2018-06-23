const logger = require('inv-loggers')
const { inspect } = require('util')

logger.warn = (err, label) => {
  var obj
  if (err.headers) {
    const res = err
    const { headers, body, statusCode } = res
    obj = { headers, body, statusCode }
  } else {
    const { message, context } = err
    label = label || message
    const emitter = err.stack && err.stack.split('\n').slice(0, 5).map(trim)
    obj = { message, context, emitter }
  }
  logger.log(deepInspect(obj), label, 'yellow')
}

const trim = str => str.trim()
const deepInspect = obj => inspect(obj, null, 10)

module.exports = logger
