#!/usr/bin/env node
const { name, root, port: configPort } = require('config')
const port = process.env.PORT ? parseInt(process.env.PORT) : configPort
const logger = require('./lib/logger')
const express = require('express')
const requestsLogger = require('./lib/requests_logger')

const app = express()
app.use(requestsLogger)

const publicFileRoot = process.cwd() + '/public/'

const favicon = require('serve-favicon')(publicFileRoot + 'favicon.ico')
app.use(favicon)

app.use(require('./lib/cors_headers'))

app.use(`${root}/public`, express.static(publicFileRoot))
app.get(`${root}/query`, require('./lib/query'))
app.get(`${root}/links/*`, require('./lib/links'))
app.get(`${root}/`, require('./lib/home')(publicFileRoot))
app.get(`${root}/*`, require('./lib/hub'))

app.listen(port, err => {
  if (err) logger.error(err, 'startup error')
  else logger.info(`${name} started on port ${port}`)
})

require('./lib/refresh_properties_once_a_day')()
