module.exports = (sitelinks, sites, langs) => {
  for (const site of sites) {
    for (const lang of langs) {
      const siteObj = sitelinks[`${lang}${site}`]
      if (siteObj) return siteObj
    }
  }
}
