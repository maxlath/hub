#!/usr/bin/env node
const { name, root, port: configPort } = require('config')
const port = process.env.PORT ? parseInt(process.env.PORT) : configPort
const logger = require('./logger')
const express = require('express')
const requestsLogger = require('./requests_logger')

const app = express()
app.use(requestsLogger)

const publicFileRoot = process.cwd() + '/public/'

app.use(require('./cors_headers'))

app.use(`${root}/public`, express.static(publicFileRoot))
app.get(`${root}/favicon.ico`, require('./favicon')(publicFileRoot))
app.get(`${root}/query`, require('./query'))
app.get(`${root}/links/*`, require('./links'))
app.get(`${root}/`, require('./home')(publicFileRoot))
app.get(`${root}/*`, require('./hub'))

app.listen(port, err => {
  if (err) logger.error(err, 'startup error')
  else logger.info(`${name} started on port ${port}`)
})

require('./refresh_properties_once_a_day')()
