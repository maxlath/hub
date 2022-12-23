const commons = 'https://commons.wikimedia.org/w/index.php'
const request = require('./request')
const { capitalize } = require('./utils')

module.exports = {
  isUrlifyableProperty: propertyData => {
    const { type: propType, urlFormat } = propertyData
    if (propType === 'Url' || propType === 'GlobeCoordinate') return true
    if (propType === 'ExternalId' && urlFormat != null) return true
    return false
  },

  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  formatLabel: label => {
    return capitalize(label)
      .replace(/ \(\w+\)$/, '')
      .replace(/ ID$/, '')
      .replace(/ artist$/, '')
      .replace(/ person$/, '')
      .replace(/ channel$/, '')
      .replace(/ topic$/, '')
      .replace(/ username$/, '')
      .replace(/ authority$/, '')
      .replace(/ authorities$/, '')
      .replace(/ reference number$/, '')
      .trim()
  },

  getIconUrl: commonsFile => {
    if (!commonsFile) return
    const url = `${commons}?title=Special:Redirect/file/${commonsFile}&width=16`
    return request.get(url, { redirect: 'manual' })
    .then(res => res.headers.get('location'))
    .catch(err => {
      if (err.statusCode !== 404) throw err
    })
  }
}
