const logger = require('./logger')
const getSitelinkRedirectUrl = require('./get_sitelink_redirect_url')
const getPropertyRedirectUrl = require('./get_property_redirect_url')
const parseLangHeader = require('./parse_lang_header')

module.exports = (query, headers) => {
  const { properties } = query
  if (properties) {
    return {
      props: 'claims',
      getRedirectUrl: getPropertyRedirectUrl(query)
    }
  }

  const site = query.site || 'wiki'
  const lang = query.lang || parseLangHeader(headers) || 'en'
  logger.info(site, 'site')
  logger.info(lang, 'lang')

  // Pass the parsed value
  query.lang = lang

  return {
    props: 'sitelinks',
    getRedirectUrl: getSitelinkRedirectUrl(site, lang)
  }
}
