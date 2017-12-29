#!/usr/bin/env node
const { name, root, port: configPort } = require('config')
const port = process.env.PORT ? parseInt(process.env.PORT) : configPort
const logger = require('./lib/logger')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

const publicFileRoot = process.cwd() + '/public/'

const favicon = require('serve-favicon')(publicFileRoot + 'favicon.ico')
app.use(favicon)

app.use(`${root}/public`, express.static(publicFileRoot))
app.get(`${root}/query`, require('./lib/query'))
app.get(`${root}/`, require('./lib/home')(publicFileRoot))
app.get(`${root}/*`, require('./lib/hub'))

app.listen(port, err => {
  if (err) logger.error(err, 'startup error')
  else logger.info(`${name} started on port ${port}`)
})
