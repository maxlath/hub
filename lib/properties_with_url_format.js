const properties = require('./properties')
const urlGetterPerType = require('./url_getter_per_type')

module.exports = Object.keys(properties)
  .reduce((list, property) => {
    const { type: propType, urlFormat } = properties[property]
    if (urlGetterPerType[propType] == null) return list
    if (propType === 'ExternalId' && urlFormat == null) return list
    list.push(property)
    return list
  }, [])
