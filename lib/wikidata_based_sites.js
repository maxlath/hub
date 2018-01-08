const wmflabs = 'https://tools.wmflabs.org'

const wikidataBasedSites = {
  crotos: 'http://zone47.com/crotos/?q=$1',
  inventaire: 'https://inventaire.io/entity/wd:$1',
  reasonator: wmflabs + '/reasonator/?q=$1',
  scholia: wmflabs + '/scholia/$1',
  skid: wmflabs + '/sqid/#/view?id=$1'
}

const wikidataBasedSiteUrl = (wdBasedSite, id) => {
  return wikidataBasedSites[wdBasedSite].replace('$1', id)
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

module.exports = {
  wikidataBasedSiteUrl,
  findFirstWikidataBasedSite,
  replaceWikidataBaseSiteByWikidata
}
