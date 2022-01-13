const logger = require('./logger')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropertyRedirectUrl = require('./get_property_redirect_url')
const parseLangHeader = require('./parse_lang_header')

module.exports = (query, headers, context) => {
  const { properties } = query
  if (properties) {
    return {
      props: 'claims',
      getRedirectUrl: getPropertyRedirectUrl(query, context)
    }
  }

  const site = query.site || 'wiki'

  const langHeader = parseLangHeader(headers)

  let lang
  if (query.lang) {
    lang = query.lang
      .split(',')
      .map(l => l === 'auto' ? langHeader : l)
      .join(',')
  } else {
    lang = langHeader || 'en'
  }

  logger.info('site', site)
  logger.info('lang', lang)

  // Pass the parsed value
  query.lang = lang

  return {
    props: 'sitelinks',
    getRedirectUrl: getSitelinkRedirectUrl(site, lang, context)
  }
}
