const logger = require('./logger')
const wdk = require('wikidata-sdk')

module.exports = (siteStr, langStr) => entity => {
  const { id, sitelinks } = entity
  sitelinks.wikidata = { site: 'wikidata', title: id }

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
  .map(addScore(sites, langs))
  .sort(byScore)
}

const addScore = (sites, langs) => siteObj => {
  var score = 0
  const { lang, project } = wdk.getSitelinkData(siteObj.site)

  const siteRank = sites.indexOf(project) + 1
  const langRank = langs.indexOf(lang) + 1

  var langScore = 0
  var siteScore = 0

  // - Give a bigger and bigger bonus, the further at the begining of the lists
  // - Give a bigger bonus to sites with matching projects
  if (siteRank > 0) siteScore = ((sites.length - siteRank) / sites.length) * 10
  if (langRank > 0) langScore = (langs.length - langRank) / langs.length

  score += langScore + siteScore

  siteObj.score = score

  return siteObj
}

const byScore = (a, b) => b.score - a.score

const cleanStr = str => str.trim().toLowerCase()
