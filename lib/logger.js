require('util').inspect.defaultOptions.depth = 10
const chalk = require('tiny-chalk')
const separator = chalk.grey('-------')

const log = (color, write) => (text, obj, ...rest) => {
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

const baseLoggers = {
  info: log('blue', console.log),
  success: log('green', console.log),
  warn: log('yellow', console.error),
  error: log('red', console.error)
}

const promiseChainLoggers = {
  Info: label => obj => {
    baseLoggers.info(label, obj)
    return obj
  },

  Error: label => err => {
    baseLoggers.error(label, err)
    throw err
  }
}

module.exports = Object.assign(baseLoggers, promiseChainLoggers)
