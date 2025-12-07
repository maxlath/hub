// The goal of this module is to update the two following objects once a day
// It relies on NodeJS module caching system: updating those objects here
// will also update those objects in other modules
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import properties from '../assets/js/properties.js'
import propertiesIndex from '../assets/js/properties_index.js'
import { info, success, logError } from './logger.js'

const oneDay = 24 * 60 * 60 * 1000

const execAsync = promisify(exec)

async function refreshProperties () {
  info('Starting to refresh properties objects')
  try {
    const { stdout, stderr } = await execAsync('npm run update-properties')
    success('done updating properties', stdout, stderr)
    refreshObject('assets/js/properties.js', properties)
    refreshObject('assets/js/properties_index.js', propertiesIndex)
    success('properties object refreshed')
  } catch (err) {
    logError('refreshProperties err', err)
  }
}

function refreshObject (path, obj) {
  const filePath = require('path').join(process.cwd(), path)
  // Bust require cache
  // See https://nodejs.org/docs/latest/api/modules.html#modules_require_cache
  delete require.cache[filePath]
  const refreshedObj = require(filePath)
  Object.assign(obj, refreshedObj)
}

export function refreshPropertiesOnceADay () {
  setInterval(refreshProperties, oneDay)
  info(`Set to refresh properties every ${oneDay} ms`)
}
