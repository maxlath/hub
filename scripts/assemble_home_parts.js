#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const base = readFileSync('./assets/html/home.base.html').toString()
const content = readFileSync('./assets/html/home.content.html').toString()
const html = base.replace('CONTENT', content)
console.log(html)
