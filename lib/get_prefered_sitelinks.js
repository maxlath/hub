module.exports = (sitelinks, sites, langs) => {
  for (let site of sites) {
    if (site === 'wikipedia') site = 'wiki'
    for (const lang of langs) {
      const siteObj = sitelinks[`${lang}${site}`]
      if (siteObj) return siteObj
    }
  }
}
