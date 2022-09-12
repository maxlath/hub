const { identity, replaceSpacesByUnderscores } = require('./utils')
const properties = require('../assets/js/properties')

module.exports = {
  Url: identity,
  ExternalId: (value, property) => {
    const { urlFormat } = properties[property]
    if (urlFormat) return urlFormat.replace('$1', value)
  },
  WikibaseItem: id => 'redirect:' + id,
  GlobeCoordinate: value => {
    const [ lat, lon ] = value
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`
  },
  CommonsMedia: (value, property, options) => {
    const { width } = options
    value = replaceSpacesByUnderscores(value)
    let url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + value
    if (width) url += `?width=${width}`
    return url
  }

  // ## Not supported:
  // String,
  // Time,
  // Monolingualtext,
  // Quantity,
  // WikibaseProperty,
  // Math
}
