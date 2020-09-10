// The goal of this module is to update the two following objects once a day
// It relies on NodeJS module caching system: updating those objects here
// will also update those objects in other modules
const properties = require('./properties')
const propertiesIndex = require('./properties_index')

const oneDay = 24 * 60 * 60 * 1000
const logger = require('./logger')
const { promisify } = require('util')
const { exec } = require('child_process')
const execAsync = promisify(exec)

const refreshProperties = async () => {
  logger.info('Starting to refresh properties objects')
  try {
    const { stdout, stderr } = await execAsync('npm run update-properties')
    logger.success('done updating properties', stdout, stderr)
    refreshObject('lib/properties.js', properties)
    refreshObject('lib/properties_index.js', propertiesIndex)
    logger.success('properties object refreshed')
  } catch (err) {
    logger.error('refreshProperties err', err)
  }
}

const refreshObject = (path, obj) => {
  const filePath = require('path').join(process.cwd(), path)
  // Bust require cache
  // See https://nodejs.org/docs/latest/api/modules.html#modules_require_cache
  delete require.cache[filePath]
  const refreshedObj = require(filePath)
  Object.assign(obj, refreshedObj)
}

module.exports = () => {
  setInterval(refreshProperties, oneDay)
  logger.info(`Set to refresh properties every ${oneDay} ms`)
}
