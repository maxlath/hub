const wdk = require('wikidata-sdk')
const _ = require('./utils')
const errors = require('./errors')
const properties = require('./properties')
const propertiesIndex = require('./properties_index')
const { bundles } = require('./property_bundles')

module.exports = str => _.flatten(str.split(',').map(findProperty))

const findProperty = str => {
  str = str.trim()

  // Accept numeric ids
  if (/^\d+$/.test(str)) str = 'P' + str

  if (isKnownPropertyId(str)) return str

  if (isChainedPropertiesString(str)) return str

  str = str.toLowerCase()
  return bundles[str] || propertiesIndex[str]
}

const isKnownPropertyId = str => {
  if (!wdk.isPropertyId(str)) return false

  if (properties[str]) return true
  else throw errors.new('unknown property id', 400, { property: str })
}

const isChainedPropertiesString = str => {
  if (!/^[P\d>]+$/.test(str)) return false
  for (let property of str.split('>')) {
    if (!isKnownPropertyId(property)) return false
  }
  return true
}
