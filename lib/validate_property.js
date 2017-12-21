const wdk = require('wikidata-sdk')
const properties = require('./properties')
const propertyBundles = require('./property_bundles')
const errors = require('./errors')

module.exports = property => {
  // Ignore properties bundle keys
  if (propertyBundles.bundles[property]) return

  if (!wdk.isPropertyId(property)) {
    throw errors.new('invalid property id', 400, { property })
  }
  if (!properties[property]) {
    throw errors.new('unknown property id', 400, { property })
  }
}
