const wdk = require('wikidata-sdk')
const properties = require('./properties')
const { identity, replaceSpacesByUnderscores } = require('./utils')
const errors = require('./errors')
const commonsBase = 'https://commons.wikimedia.org/wiki/'

module.exports = (property, query) => entity => {
  const { type: propType } = properties[property]
  const propClaims = entity.claims[property]
  if (!propClaims) return
  const value = wdk.simplify.propertyClaims(propClaims)[0]
  const getter = urlGetterPerType[propType]
  if (!getter) throw errors.new('unsupported property type', 400, { property })
  return getter(value, property, query)
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
    if (width) return `${commonsBase}Special:FilePath/${value}?width=${width}`
    return `${commonsBase}File:${value}`
  }

  // ## Not supported:
  // String,
  // Time,
  // Monolingualtext,
  // Quantity,
  // WikibaseProperty,
  // Math
}
