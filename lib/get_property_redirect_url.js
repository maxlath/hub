const wdk = require('wikidata-sdk')
const propertyBundles = require('./property_bundles')
const getUrlFromClaim = require('./get_url_from_claim')

module.exports = query => entity => {
  for (let property of query.properties) {
    const rawProperty = property

    const [ realPropertyId, bundleKey ] = property.split('~~~')
    if (bundleKey) property = realPropertyId

    let nextProperties
    [ property, ...nextProperties ] = property.split('|')

    if (nextProperties) {
      query.rawProperty = query.rawProperty || rawProperty
      query.nextProperties = nextProperties
    }

    let propClaims = entity.claims[property]
    if (!propClaims) continue

    const simplifiedTruthyPropClaims = wdk.simplify.propertyClaims(propClaims)
    let value = simplifiedTruthyPropClaims[0]

    if (bundleKey) {
      return propertyBundles.customUrl[bundleKey][property](value, query)
    }

    return getUrlFromClaim(property, value, query)
  }
}
