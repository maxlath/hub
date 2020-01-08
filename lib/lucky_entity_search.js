const request = require('./request')
const wdk = require('wikidata-sdk')
const logger = require('./logger')
const errors = require('./errors')

module.exports = (text, lang) => {
  return request.get(wdk.searchEntities({
    search: text,
    language: lang,
    limit: 1
  }))
  .then(res => res.data)
  .then(logger.Info('lucky search'))
  .then(res => {
    const entity = res.search[0]
    if (entity != null) return entity.id
    else throw errors.notFound({ text, lang })
  })
}
