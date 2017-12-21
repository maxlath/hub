const logger = require('inv-loggers')

logger.warn = (err, label) => {
  var obj
  if (err.headers) {
    const res = err
    const { headers, body, statusCode } = res
    obj = { headers, body, statusCode }
  } else {
    const { message, context } = err
    label = label || message
    const emitter = err.stack && err.stack.split('\n').slice(0, 5)
    obj = { message, context, emitter }
  }
  logger.log(obj, label, 'yellow')
}

module.exports = logger
