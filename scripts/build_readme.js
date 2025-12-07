#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'

const contentUrl = 'https://raw.githubusercontent.com/maxlath/hub/master'
const hubBase = 'https://hub.toolforge.org'

let text = `
<!-- this file is built by ./scripts/build_readme
Make your edits in docs/readme -->

`

function addFile (filename) {
  text += readFileSync(`./docs/readme/${filename}.md`)
    .toString()
    // Having those links directly  would make way too long lines
    // to be workable with all those tables
    .replace(/`(\/[^`]*)`/g, `[$1](${hubBase}$1)`)
    .replace(/\(\//g, `(${hubBase}/`)
    .replace(/assets\/images/g, `${contentUrl}/assets/images`)

  text += '\n'
}

addFile('base')
addFile('user_guide')
addFile('developer_guide')

writeFileSync('./README.md', text)
