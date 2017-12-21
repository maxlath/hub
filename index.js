#!/usr/bin/env node
const { name, root, port: configPort } = require('config')
const port = process.env.PORT ? parseInt(process.env.PORT) : configPort
const logger = require('./lib/logger')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

app.get(`${root}/*`, require('./lib/hub'))
app.get(`${root}/`, require('./lib/hello'))

app.listen(port, err => {
  if (err) logger.error(err, 'startup error')
  else logger.info(`${name} started on port ${port}`)
})
