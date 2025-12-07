export const identity = value => value

export const isNumber = num => typeof num === 'number' && !Number.isNaN(num)

export const isNonEmptyString = str => typeof str === 'string' && str.length > 0

// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
export function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
}

const encodeCharacter = char => '%' + char.charCodeAt(0).toString(16)

export const replaceSpacesByUnderscores = str => str.replace(/\s/g, '_')
export const replaceUnderscoresBySpaces = str => str.replace(/_/g, ' ')

export function flatten (values) {
  const array = []
  for (const value of values) {
    if (value instanceof Array) array.push(...value)
    else array.push(value)
  }
  return array
}

export function pick (obj, props) {
  const picked = {}
  if (!(props instanceof Array)) throw new Error(`expected array, got ${JSON.stringify(props)}`)
  props.forEach(prop => {
    picked[prop] = obj[prop]
  })
  return picked
}

export const compact = array => array.filter(value => value != null)

export const capitalize = str => str[0].toUpperCase() + str.substring(1)

export const uniq = array => Array.from(new Set(array))
