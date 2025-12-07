#!/usr/bin/env node
import express from 'express'
import { name, root, port as configPort } from './config.js'
import { addCorsHeadersMiddleware } from './cors_headers.js'
import { faviconMiddlewareFactory } from './favicon.js'
import { homeControllerFactory } from './home.js'
import { hubController } from './hub.js'
import { linksController } from './links.js'
import { info, logError } from './logger.js'
import { queryController } from './query.js'
import { refreshPropertiesOnceADay } from './refresh_properties_once_a_day.js'
import { requestsLogger } from './requests_logger.js'

const port = process.env.PORT ? parseInt(process.env.PORT) : configPort

const app = express()
app.use(requestsLogger)

const publicFileRoot = process.cwd() + '/public/'

app.use(addCorsHeadersMiddleware)

app.use(`${root}/public`, express.static(publicFileRoot))
app.get(`${root}/favicon.ico`, faviconMiddlewareFactory(publicFileRoot))
app.get(`${root}/query`, queryController)
app.get(`${root}/links/*`, linksController)
app.get(`${root}/`, homeControllerFactory(publicFileRoot))
app.get(`${root}/*`, hubController)

app.listen(port, err => {
  if (err) logError('startup error', err)
  else info(`${name} started on port ${port}`)
})

refreshPropertiesOnceADay()
