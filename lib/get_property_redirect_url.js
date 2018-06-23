const wdk = require('wikidata-sdk')
const properties = require('./properties')
const { identity, replaceSpacesByUnderscores } = require('./utils')
const errors = require('./errors')
const propertyBundles = require('./property_bundles')

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

    let { type: propType } = properties[property]
    let getter = urlGetterPerType[propType]
    if (!getter) throw errors.new('unsupported property type', 400, { property })
    return getter(value, property, query)
  }
}

const urlGetterPerType = {
  Url: identity,
  ExternalId: (value, property) => {
    const { urlFormat } = properties[property]
    if (urlFormat) return urlFormat.replace('$1', value)
  },
  WikibaseItem: id => 'redirect:' + id,
  GlobeCoordinate: value => {
    const [ lat, lon ] = value
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`
  },
  CommonsMedia: (value, property, query) => {
    const { width } = query
    value = replaceSpacesByUnderscores(value)
    var url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + value
    if (width) url += `?width=${width}`
    return url
  }

  // ## Not supported:
  // String,
  // Time,
  // Monolingualtext,
  // Quantity,
  // WikibaseProperty,
  // Math
}
