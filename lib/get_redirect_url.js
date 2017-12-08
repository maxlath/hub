const logger = require('inv-loggers')
const _ = require('./utils')
const wdk = require('wikidata-sdk')

module.exports = (site, lang) => entity => {
  const { id, sitelinks } = entity

  const langs = lang.split(',')

  // Always include English as a fallback language
  langs.push('en')

  const preferedSitelink = langs
    .map(getLangSitelink(sitelinks, site))
    .filter(_.exists)[0]

  logger.info(preferedSitelink, 'preferedSitelink')
  if (preferedSitelink) return wdk.getSitelinkUrl(preferedSitelink)

  const sortedSitelink = getSortedSitelink(sitelinks, site, langs)

  if (sortedSitelink.length > 0) {
    logger.info(sortedSitelink, 'sortedSitelink')
    const bestFallbackSitelink = sortedSitelink[0]
    logger.info(bestFallbackSitelink, 'bestFallbackSitelink')
    return wdk.getSitelinkUrl(bestFallbackSitelink)
  }

  logger.info('no sitelink found')
  // Fallback on the Wikidata page if there is no sitelink
  return `https://wikidata.org/entity/${id}`
}

const getLangSitelink = (sitelinks, site) => lang => {
  const preferedSitelinkKey = `${lang}${site}`
  return sitelinks[preferedSitelinkKey]
}

const getSortedSitelink = (sitelinks, site, langs) => {
  return Object.values(sitelinks)
  .map(addData(site, langs))
  .filter(siteObj => siteObj.score > 0)
  .sort(byScore)
}

const getValues = sitelinks => key => sitelinks[key]

const addData = (site, langs) => siteObj => {
  var score = 0
  const url = wdk.getSitelinkUrl(siteObj)
  const [ siteLang, project ] = url.replace('https://', '').split('.')
  const siteMatch = site.match(project) != null
  if (siteMatch) score += 10
  const langRank = langs.indexOf(siteLang) + 1
  // Give a bigger and bigger bonus, the further at the begining of the list
  // a language is
  if (langRank > 0) score += (langs.length - langRank) / langs.length
  siteObj.url = url
  siteObj.score = score
  return siteObj
}

const byScore = (a, b) => b.score - a.score
