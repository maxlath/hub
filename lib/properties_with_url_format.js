const properties = require('./properties')

module.exports = Object.keys(properties)
  .reduce((list, prop) => {
    if (properties[prop].urlFormat != null) list.push(prop)
    return list
  }, [])
