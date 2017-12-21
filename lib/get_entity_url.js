const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = (id, props) => {
  if (!_.isNonEmptyString(id)) return
  if (wdk.isEntityId(id)) return wdk.getEntities({ ids: id, props })

  var [ aliasSite, ...aliasId ] = id.split(':')
  // Required for titles such as Categoría:Alemania
  aliasId = aliasId.join(':')

  const params = { props }

  // Make sitelink project default to 'wiki':
  // ex: pass 'fr' for short version of 'frwiki'
  if (wdk.isSitelinkKey(aliasSite + 'wiki')) aliasSite += 'wiki'

  if (wdk.isSitelinkKey(aliasSite) && _.isNonEmptyString(aliasId)) {
    params.titles = aliasId
    params.sites = aliasSite
  } else {
    // Default to enwiki as alias site and what was passed as title
    params.titles = aliasSite
    params.sites = 'enwiki'
  }
  return wdk.getWikidataIdsFromSitelinks(params)
}
