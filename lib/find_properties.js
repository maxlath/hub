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

  if (wdk.isPropertyId(str)) {
    if (properties[str]) return str
    else throw errors.new('unknown property id', 400, { property: str })
  }

  str = str.toLowerCase()
  return bundles[str] || propertiesIndex[str]
}
