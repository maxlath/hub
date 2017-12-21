const logger = require('./logger')
const wdk = require('wikidata-sdk')
const getSortedSitelinks = require('./get_sorted_sitelinks')
const getPreferedSitelink = require('./get_prefered_sitelinks')
const { wikidataBasedSites, findFirstWikidataBasedSite, replaceWikidataBaseSiteByWikidata } = require('./wikidata_based_sites')
const { expendSite } = require('./short_sites')

module.exports = (siteStr, langStr) => entity => {
  var { id, sitelinks } = entity
  // Properties miss a 'sitelinks' object
  sitelinks = sitelinks || {}
  sitelinks.wikidata = { site: 'wikidata', title: id }

  const langs = langStr.split(',').map(cleanStr)
  var sites = siteStr.split(',').map(cleanStr).map(expendSite)

  const firstWikidataBasedSite = findFirstWikidataBasedSite(sites)
  // Give the place to Wikidata to handle priorities
  // before re-substituing the site during getSitelinkUrl
  sites = sites.map(replaceWikidataBaseSiteByWikidata)

  // Always include English as a fallback language
  langs.push('en')
  // Always include Wikipedia as a fallback site
  sites.push('wikipedia')

  const preferedSitelink = getPreferedSitelink(sitelinks, sites, langs)
  logger.info(preferedSitelink, 'preferedSitelink')
  if (preferedSitelink) {
    return getSitelinkUrl(preferedSitelink, firstWikidataBasedSite)
  }

  const sortedSitelink = getSortedSitelinks(sitelinks, sites, langs)

  if (sortedSitelink.length > 0) {
    const bestFallbackSitelink = sortedSitelink[0]
    logger.info(bestFallbackSitelink, 'bestFallbackSitelink')
    return getSitelinkUrl(bestFallbackSitelink, firstWikidataBasedSite)
  }
}

const cleanStr = str => str.trim().toLowerCase()

const getSitelinkUrl = (siteObj, wdBasedSite) => {
  const { site, title } = siteObj
  if (site !== 'wikidata' || wdBasedSite == null || wdBasedSite === 'wikidata') {
    return wdk.getSitelinkUrl(siteObj)
  }
  return wikidataBasedSites[wdBasedSite].replace('$1', title)
}
