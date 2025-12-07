import { inspect } from 'util'
import chalk from 'tiny-chalk'

inspect.defaultOptions.depth = 10

const separator = chalk.grey('-------')

function loggerFactory (color, write) {
  return function logger (text, obj, ...rest) {
    const coloredText = chalk[color](text)
    if (obj) {
      if (typeof obj === 'string') {
        write(coloredText, obj, ...rest)
      } else {
        write(`${separator} ${coloredText} ${separator}`)
        write(obj, ...rest)
        write(`${separator}${separator}`)
      }
    } else if (typeof text === 'string') {
      write(coloredText, ...rest)
    } else {
      write(text, ...rest)
    }
  }
}

export const info = loggerFactory('blue', console.log)
export const success = loggerFactory('green', console.log)
export const warn = loggerFactory('yellow', console.error)
export const logError = loggerFactory('red', console.error)

export function Info (label) {
  return function (obj) {
    info(label, obj)
    return obj
  }
}

export function LogError (label) {
  return function (err) {
    logError(label, err)
    throw err
  }
}
