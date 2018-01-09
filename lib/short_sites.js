const expendSite = str => shortSites[str] || str

const shortSites = {
  wd: 'wikidata',
  wp: 'wikipedia',
  c: 'commons',
  ws: 'wikisource',
  wq: 'wikiquote',
  wt: 'wiktionary',
  wv: 'wikivoyage',
  wy: 'wikiversity',
  wn: 'wikinews',
  inv: 'inventaire',
  re: 'reasonator',
  sc: 'scholia',
  sq: 'sqid'
}

module.exports = { expendSite }
