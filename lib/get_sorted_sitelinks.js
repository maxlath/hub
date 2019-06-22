const wdk = require('wikidata-sdk')
const values = require('lodash.values')

module.exports = (sitelinks, sites, langs) => {
  return values(sitelinks)
  .map(addScore(sites, langs))
  .sort(byScore)
}

const addScore = (sites, langs) => siteObj => {
  var score = 0
  try {
    var { lang, project } = wdk.getSitelinkData(siteObj.site)
  } catch (err) {
    console.error(err)
    siteObj.score = 0
    return siteObj
  }

  const siteRank = sites.indexOf(project) + 1
  const langRank = langs.indexOf(lang) + 1

  var langScore = 0
  var siteScore = 0

  // - Give a bigger and bigger bonus, the further at the begining of the lists
  // - Give a bigger bonus to sites with matching projects
  if (siteRank > 0) siteScore = ((sites.length - siteRank) / sites.length) * 10
  if (langRank > 0) langScore = (langs.length - langRank) / langs.length

  score += langScore + siteScore

  siteObj.score = score

  return siteObj
}

const byScore = (a, b) => b.score - a.score
