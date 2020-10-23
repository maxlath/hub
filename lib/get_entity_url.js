const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = (id, props, lang) => {
  if (!_.isNonEmptyString(id)) return
  if (wdk.isEntityId(id)) return wdk.getEntities({ ids: id, props })

  let [ aliasSite, ...aliasId ] = id.split(':')
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
    params.titles = aliasSite
    if (wdk.isSitelinkKey(lang + 'wiki')) {
      // Default to Wikipedia in the user language
      params.sites = lang + 'wiki'
    } else {
      // Or the Wikipedia in English if no sitelink can't be built
      // from the language
      params.sites = 'enwiki'
    }
  }

  return wdk.getEntitiesFromSitelinks(params)
}
