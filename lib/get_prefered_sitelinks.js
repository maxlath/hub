export default function (sitelinks, sites, langs) {
  for (let site of sites) {
    if (site === 'wikipedia') site = 'wiki'
    for (const lang of langs) {
      let siteObj
      if (site === 'wikidata') siteObj = sitelinks.wikidata
      else if (site === 'commons') siteObj = sitelinks.commonswiki
      else siteObj = sitelinks[`${lang}${site}`]
      if (siteObj) return siteObj
    }
  }
}
