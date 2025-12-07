import properties from '../assets/js/properties.js'
import { newError } from './errors.js'
import urlGetterPerType from './url_getter_per_type.js'

export default function (property, value, options = {}) {
  const { type: propType } = properties[property]
  const getter = urlGetterPerType[propType]
  if (!getter) throw newError('unsupported property type', 400, { property })
  return getter(value, property, options)
}
