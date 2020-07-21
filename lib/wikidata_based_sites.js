const wmflabs = 'https://tools.wmflabs.org'
const { capitalize } = require('./utils')

const wikidataBasedSites = {
  crotos: {
    urlFormat: 'http://zone47.com/crotos/?q=$1'
  },
  inventaire: {
    urlFormat: 'https://inventaire.io/entity/wd:$1',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Inv-icon-192.png/16px-Inv-icon-192.png'
  },
  monumental: {
    urlFormat: wmflabs + '/monumental/#/object/$1'
  },
  portal: {
    urlFormat: wmflabs + '/portal/$1'
  },
  reasonator: {
    urlFormat: wmflabs + '/reasonator/?q=$1'
  },
  scholia: {
    urlFormat: 'https://scholia.toolforge.org/$1'
  },
  sqid: {
    urlFormat: wmflabs + '/sqid/#/view?id=$1'
  }
}

const wikidataBasedSiteUrl = (wdBasedSite, id) => {
  return wikidataBasedSites[wdBasedSite].urlFormat.replace('$1', id)
}

const findFirstWikidataBasedSite = sites => {
  for (let site of sites) {
    if (site === 'wikidata' || wikidataBasedSites[site]) return site
  }
}

const replaceWikidataBaseSiteByWikidata = site => {
  if (wikidataBasedSites[site] != null) return 'wikidata'
  return site
}

const addWikidataBasedSitesLinksData = (data, id, shortlist) => {
  Object.keys(wikidataBasedSites).forEach(site => {
    if (shortlist && !shortlist.includes(site)) return
    data[site] = {
      label: capitalize(site),
      url: wikidataBasedSiteUrl(site, id),
      icon: wikidataBasedSites[site].icon
    }
  })
  return data
}

module.exports = {
  wikidataBasedSiteUrl,
  findFirstWikidataBasedSite,
  replaceWikidataBaseSiteByWikidata,
  addWikidataBasedSitesLinksData
}
