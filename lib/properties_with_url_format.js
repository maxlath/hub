const properties = require('./properties')

module.exports = Object.keys(properties)
  .reduce((list, property) => {
    const { type: propType, urlFormat } = properties[property]
    if (propType === 'Url' ||
        propType === 'GlobeCoordinate' ||
        (propType === 'ExternalId' && urlFormat != null)
        ) list.push(property)
    return list
  }, [])
