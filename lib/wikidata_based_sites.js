const wikidataBasedSites = {
  scholia: 'https://tools.wmflabs.org/scholia/$1',
  inventaire: 'https://inventaire.io/entity/wd:$1'
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
  wikidataBasedSites,
  findFirstWikidataBasedSite,
  replaceWikidataBaseSiteByWikidata
}
