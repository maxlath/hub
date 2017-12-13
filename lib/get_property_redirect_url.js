const wdk = require('wikidata-sdk')
const properties = require('./properties')
const { identity } = require('./utils')

module.exports = property => entity => {
  const { type: propType } = properties[property]
  const propClaims = entity.claims[property]
  if (!propClaims) return
  const value = wdk.simplify.propertyClaims(propClaims)[0]
  const getter = urlGetterPerType[propType]
  if (!getter) return
  return getter(value, property)
}

const urlGetterPerType = {
  Url: identity,
  ExternalId: (value, property) => {
    const { urlFormat } = properties[property]
    if (urlFormat) return urlFormat.replace('$1', value)
  }
}
