const wdk = require('wikidata-sdk')
const properties = require('./properties')
const { identity } = require('./utils')

module.exports = prop => entity => {
  const { type: propType } = properties[prop]
  const propClaims = entity.claims[prop]
  if (!propClaims) return
  const value = wdk.simplify.propertyClaims(propClaims)[0]
  const getter = urlGetterPerType[propType]
  if (!getter) return
  return getter(value, prop)
}

const urlGetterPerType = {
  Url: identity,
  ExternalId: (value, property) => {
    const { urlFormat } = properties[property]
    if (urlFormat) return urlFormat.replace('$1', value)
  }
}
