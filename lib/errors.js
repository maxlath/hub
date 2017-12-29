const _ = require('./utils')
const logger = require('./logger')

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

  bundle: (res, message, status = 400, context) => {
    const err = errors.new(message, status, context)
    errors.handle(res, err)
  },

  notFound: context => errors.new('Not Found', 404, context)
}

errors.Handle = res => errors.handle.bind(null, res)
