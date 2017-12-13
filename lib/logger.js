const logger = require('inv-loggers')

logger.warn = (err, label) => {
  const { message, context } = err
  const emitter = err.stack.split('\n').slice(0, 5)
  const obj = { message, context, emitter }
  logger.log(obj, label || message, 'yellow')
  return
}

module.exports = logger
