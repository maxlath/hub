module.exports = (sitelinks, sites, langs) => {
  for (let site of sites) {
    for (let lang of langs) {
      let siteObj = sitelinks[`${lang}${site}`]
      if (siteObj) return siteObj
    }
  }
}
