#!/usr/bin/env node
import { createRequire } from 'node:module'

const requireJson = createRequire(import.meta.url)
const properties = requireJson('./assets/properties.json')

const index = {}
Object.keys(properties).forEach(prop => {
  index[prop] = properties[prop][0]
  index[prop].property = prop
})
console.log(JSON.stringify(index, null, 2))
