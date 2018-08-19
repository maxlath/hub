const properties = require('./properties')
const errors = require('./errors')
const urlGetterPerType = require('./url_getter_per_type')

module.exports = (property, value, options = {}) => {
  const { type: propType } = properties[property]
  const getter = urlGetterPerType[propType]
  if (!getter) throw errors.new('unsupported property type', 400, { property })
  return getter(value, property, options)
}
