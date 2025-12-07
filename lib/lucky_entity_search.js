import wdk from 'wikibase-sdk/wikidata.org'
import { notFound } from './errors.js'
import { Info } from './logger.js'
import { get } from './request.js'

export default function (text, lang) {
  return get(wdk.searchEntities({
    search: text,
    language: lang,
    limit: 1,
  }))
  .then(res => res.parsedBody)
  .then(Info('lucky search'))
  .then(res => {
    const entity = res.search[0]
    if (entity != null) return entity.id
    else throw notFound({ text, lang })
  })
}
