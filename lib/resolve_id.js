const wdk = require('wikidata-sdk')
const breq = require('bluereq')
const _ = require('./utils')
const errors = require('./errors')

module.exports = id => {
  if (wdk.isEntityId(id)) return id

  const [ property, value ] = id.split(':')

  // Let ./get_redirect_url determine if it's anything useful:
  // we hereafter just want to deal with revers claims. ex: id=P2002:EFF
  if (!(wdk.isPropertyId(property) && _.isNonEmptyString(value))) return id

  const url = wdk.getReverseClaims(property, value, {
    caseInsensitive: true,
    keepProperties: true,
    limit: 1
  })

  return breq.get(url)
  .get('body')
  .then(wdk.simplifySparqlResults)
  .then(ids => {
    if (ids.length > 0) return ids[0]
    else throw errors.new('no id found', 400, { property, value })
  })
}
