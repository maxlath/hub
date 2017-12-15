const wdk = require('wikidata-sdk')
const properties = require('./properties')
const { identity } = require('./utils')
const errors = require('./errors')

module.exports = property => entity => {
  const { type: propType } = properties[property]
  const propClaims = entity.claims[property]
  if (!propClaims) return
  const value = wdk.simplify.propertyClaims(propClaims)[0]
  const getter = urlGetterPerType[propType]
  if (!getter) throw errors.new('unsupported property type', 400, { property })
  return getter(value, property)
}

const urlGetterPerType = {
  Url: identity,
  ExternalId: (value, property) => {
    const { urlFormat } = properties[property]
    if (urlFormat) return urlFormat.replace('$1', value)
  },
  WikibaseItem: id => 'redirect:' + id

  // ## Not supported:
  // String,
  // Time,
  // Monolingualtext,
  // Quantity,
  // WikibaseProperty
}
