const wdk = require('wikidata-sdk')

module.exports = prop => entity => {
  const propClaims = entity.claims[prop]
  if (!propClaims) return
  return wdk.simplify.propertyClaims(propClaims)[0]
}
