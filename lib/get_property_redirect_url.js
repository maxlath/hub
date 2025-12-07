import wdk from 'wikibase-sdk/wikidata.org'
import getUrlFromClaim from './get_url_from_claim.js'

export function getPropertyRedirectUrlFactory (query) {
  return function getPropertyRedirectUrl (entity) {
    for (let property of query.properties) {
      const rawProperty = property

      let nextProperties
      [ property, ...nextProperties ] = property.split('|')

      if (nextProperties) {
        query.rawProperty = query.rawProperty || rawProperty
        query.nextProperties = nextProperties
      }

      const propClaims = entity.claims[property]
      if (!propClaims) continue

      const simplifiedTruthyPropClaims = wdk.simplify.propertyClaims(propClaims)
      const value = simplifiedTruthyPropClaims[0]

      return getUrlFromClaim(property, value, query)
    }
  }
}
