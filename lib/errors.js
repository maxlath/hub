const _ = require('./utils')
const logger = require('inv-loggers')

const errors = module.exports = {
  new: (message, filter, context) => {
    const err = new Error(message)
    const attribute = _.isNumber(filter) ? 'statusCode' : 'type'
    err[attribute] = filter
    return err
  },

  handle: (res, err) => {
    const status = err.statusCode || 500
    logger.error(err)
    res.status(status).json({ message: err.message, context: err.context })
  },

  bundle: (res, message, status=400, context) => {
    const err = errors.new(message, status, context)
    errors.handle(res, err)
  }
}

errors.Handle = res => errors.handle.bind(null, res)
