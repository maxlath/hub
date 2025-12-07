import { logError, warn } from './logger.js'

export function newError (message, filter, context) {
  const err = new Error(message)
  const attribute = typeof filter === 'number' ? 'statusCode' : 'type'
  err[attribute] = filter
  err.context = context
  return err
}

export function handleError (res, err) {
  const status = err.statusCode || 500
  if (status < 500) {
    warn(err)
  } else {
    logError(err)
  }
  res.status(status).json({ message: err.message, context: err.context })
}

export function notFound (context) {
  return newError('Not Found', 404, context)
}

export function HandleError (res) {
  return handleError.bind(null, res)
}
