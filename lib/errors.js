const _ = require('./utils')
const logger = require('inv-loggers')

logger.warn = (err, label) => {
  const { message, context } = err
  const emitter = err.stack.split('\n').slice(0, 5)
  const obj = { message, context, emitter }
  logger.log(obj, label || message, 'yellow')
  return
}

const errors = module.exports = {
  new: (message, filter, context) => {
    const err = new Error(message)
    const attribute = _.isNumber(filter) ? 'statusCode' : 'type'
    err[attribute] = filter
    err.context = context
    return err
  },

  handle: (res, err) => {
    const status = err.statusCode || 500
    const loggerFn = status < 500 ? 'warn' : 'error'
    logger[loggerFn](err)
    res.status(status).json({ message: err.message, context: err.context })
  },

  bundle: (res, message, status=400, context) => {
    const err = errors.new(message, status, context)
    errors.handle(res, err)
  }
}

errors.Handle = res => errors.handle.bind(null, res)
