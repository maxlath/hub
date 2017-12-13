#!/usr/bin/env node
const { name, port } = require('config')
const logger = require('./lib/logger')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))

app.get('/:id', require('./lib/hub'))
app.get('/', require('./lib/hello'))

app.listen(port, err => {
  if (err) logger.error(err, 'startup error')
  else logger.info(`${name} started on port ${port}`)
})
