const logger = require('inv-loggers')
const _ = require('./utils')
const wdk = require('wikidata-sdk')

module.exports = (site, lang) => entity => {
  const { id, sitelinks } = entity

  const preferedSitelinkKey = `${lang}${site}`
  const prefered = sitelinks[preferedSitelinkKey]
  logger.info(prefered, 'prefered')
  if (prefered) return wdk.getSitelinkUrl(prefered)

  const sortedSitelink = getSortedSitelink(sitelinks, site, lang)

  if (sortedSitelink.length > 0) {
    const bestFallbackSitelink = sortedSitelink[0]
    logger.info(bestFallbackSitelink, 'bestFallbackSitelink')
    return wdk.getSitelinkUrl(bestFallbackSitelink)
  }

  logger.info('no sitelink found')
  // Fallback on the Wikidata page if there is no sitelink
  return `https://wikidata.org/entity/${id}`
}

const getSortedSitelink = (sitelinks, site, lang) => {
  return Object.values(sitelinks)
  .map(addData(site, lang))
  .sort(byScore)
}

const getValues = sitelinks => key => sitelinks[key]

const addData = (site, lang) => siteObj => {
  var score = 0
  const url = wdk.getSitelinkUrl(siteObj)
  const [ siteLang, project ] = url.replace('https://', '').split('.')
  const siteMatch = site.match(project) != null
  if (siteMatch) score += 10
  if (siteLang === lang) score += 1
  siteObj.url = url
  siteObj.score = score
  return siteObj
}

const byScore = (a, b) => b.score - a.score
