import wdk from 'wikibase-sdk/wikidata.org'
import getPreferedSitelink from './get_prefered_sitelinks.js'
import getSortedSitelinks from './get_sorted_sitelinks.js'
import { info } from './logger.js'
import { expendSite } from './short_sites.js'
import {
  wikidataBasedSiteUrl,
  findFirstWikidataBasedSite,
  replaceWikidataBaseSiteByWikidata,
} from './wikidata_based_sites.js'

export function getSitelinkRedirectUrlFactory (siteStr, langStr, context) {
  return function getSitelinkRedirectUrl (entity) {
    let { id, sitelinks } = entity
    // Properties miss a 'sitelinks' object
    sitelinks = sitelinks || {}
    sitelinks.wikidata = { site: 'wikidatawiki', title: id }

    const langs = langStr.split(',').map(cleanStr)
    let sites = siteStr.split(',').map(cleanStr).map(expendSite)

    const firstWikidataBasedSite = findFirstWikidataBasedSite(sites)
    if (firstWikidataBasedSite) {
      info('firstWikidataBasedSite', firstWikidataBasedSite)
    }
    // Give the place to Wikidata to handle priorities
    // before re-substituing the site during getSitelinkUrl
    sites = sites.map(replaceWikidataBaseSiteByWikidata)

    // Cloning the langs and sites arrays to avoid having the fallback values
    // added hereafter
    context.destination.langs = langs.slice(0)
    context.destination.sites = sites.slice(0)

    // Always include English as a fallback language
    langs.push('en')
    // Always include Wikipedia as a fallback site
    sites.push('wikipedia')

    const preferedSitelink = getPreferedSitelink(sitelinks, sites, langs)
    info('preferedSitelink', preferedSitelink)
    context.destination.preferedSitelink = preferedSitelink
    if (preferedSitelink) {
      return getSitelinkUrl(preferedSitelink, firstWikidataBasedSite)
    }

    const sortedSitelinks = getSortedSitelinks(sitelinks, sites, langs)

    if (sortedSitelinks.length > 0) {
      const bestFallbackSitelink = sortedSitelinks[0]
      info('bestFallbackSitelink', bestFallbackSitelink)
      context.destination.bestFallbackSitelink = bestFallbackSitelink
      return getSitelinkUrl(bestFallbackSitelink, firstWikidataBasedSite)
    }
  }
}

const cleanStr = str => str.trim().toLowerCase()

function getSitelinkUrl (siteObj, wdBasedSite) {
  const { site, title } = siteObj
  if (site !== 'wikidatawiki' || wdBasedSite == null || wdBasedSite === 'wikidata') {
    return wdk.getSitelinkUrl(siteObj)
  }
  return wikidataBasedSiteUrl(wdBasedSite, title)
}
