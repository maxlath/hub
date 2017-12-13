const logger = require('./logger')
const wdk = require('wikidata-sdk')

module.exports = (siteStr, langStr) => entity => {
  const { sitelinks } = entity

  const langs = langStr.split(',').map(cleanStr)
  const sites = siteStr.split(',').map(cleanStr)

  // Always include English as a fallback language
  langs.push('en')
  // Always include Wikipedia as a fallback site
  sites.push('wikipedia')

  const preferedSitelink = getPreferedSitelink(sitelinks, sites, langs)
  logger.info(preferedSitelink, 'preferedSitelink')
  if (preferedSitelink) return wdk.getSitelinkUrl(preferedSitelink)

  const sortedSitelink = getSortedSitelinks(sitelinks, sites, langs)

  if (sortedSitelink.length > 0) {
    logger.info(sortedSitelink, 'sortedSitelink')
    const bestFallbackSitelink = sortedSitelink[0]
    logger.info(bestFallbackSitelink, 'bestFallbackSitelink')
    return wdk.getSitelinkUrl(bestFallbackSitelink)
  }
}

const getPreferedSitelink = (sitelinks, sites, langs) => {
  for (let site of sites) {
    for (let lang of langs) {
      let siteObj = sitelinks[`${lang}${site}`]
      if (siteObj) return siteObj
    }
  }
}

const getSortedSitelinks = (sitelinks, sites, langs) => {
  return Object.values(sitelinks)
  .map(addData(sites, langs))
  .sort(byScore)
}

const addData = (sites, langs) => siteObj => {
  var score = 0
  const url = wdk.getSitelinkUrl(siteObj)
  const [ siteLang, project ] = url.replace('https://', '').split('.')

  const siteRank = sites.indexOf(project) + 1
  const langRank = langs.indexOf(siteLang) + 1

  // Give a bigger and bigger bonus, the further at the begining of the lists
  if (siteRank > 0) score += ((sites.length - siteRank) / sites.length) + 10
  if (langRank > 0) score += (langs.length - langRank) / langs.length

  siteObj.url = url
  siteObj.score = score
  return siteObj
}

const byScore = (a, b) => b.score - a.score

const cleanStr = str => str.trim().toLowerCase()
