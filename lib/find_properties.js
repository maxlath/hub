const wdk = require('wikidata-sdk')
const _ = require('./utils')
const errors = require('./errors')
const properties = require('./properties')
const { bundles } = require('./property_bundles')

module.exports = str => _.flatten(str.split(',').map(findProperty))

const findProperty = str => {
  str = str.trim()
  if (wdk.isPropertyId(str)) {
    if (properties[str]) return str
    else throw errors.new('unknown property id', 400, { property: str })
  }
  return bundles[str] || findExternalIdsProperties(str)
}

const findExternalIdsProperties = str => {
  // Accept underscores in place of spaces to make it more reliable to pass
  // strings with spaces from the URL
  str = _.replaceUnderscoresBySpaces(str)
  const re = new RegExp(str, 'i')
  return externalIds
  .filter(prop => prop.label.match(re))
  .map(prop => prop.property)
}

const externalIds = []

for (let prop in properties) {
  let propData = properties[prop]
  if (propData.type === 'ExternalId') externalIds.push(propData)
}
