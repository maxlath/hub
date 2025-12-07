import wdk from 'wikibase-sdk/wikidata.org'
import properties from '../assets/js/properties.js'
import propertiesIndex from '../assets/js/properties_index.js'
import { newError } from './errors.js'
import { bundles } from './property_bundles.js'

export function findProperties (str) {
  return str.split(',').flatMap(findProperty)
}

function findProperty (str) {
  str = str.trim()

  // Accept numeric ids
  if (/^\d+$/.test(str)) str = 'P' + str

  if (isKnownPropertyId(str)) return str

  if (isChainedPropertiesString(str)) return str

  str = str.toLowerCase()
  return bundles[str] || propertiesIndex[str]
}

function isKnownPropertyId (str) {
  if (!wdk.isPropertyId(str)) return false

  if (properties[str]) return true
  else throw newError('unknown property id', 400, { property: str })
}

function isChainedPropertiesString (str) {
  if (!/^[P\d|]+$/.test(str)) return false
  for (const property of str.split('|')) {
    if (!isKnownPropertyId(property)) return false
  }
  return true
}
