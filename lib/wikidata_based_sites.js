const wmflabs = 'https://tools.wmflabs.org'

const wikidataBasedSites = {
  crotos: {
    urlFormat: 'http://zone47.com/crotos/?q=$1'
  },
  inventaire: {
    urlFormat: 'https://inventaire.io/entity/wd:$1',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Inv-icon-16.png'
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
    urlFormat: wmflabs + '/scholia/$1'
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

const addWikidataBasedSitesLinksData = (data, id) => {
  Object.keys(wikidataBasedSites).forEach(site => {
    data[site] = {
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
