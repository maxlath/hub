import { getPropertyRedirectUrlFactory } from './get_property_redirect_url.js'
import { getSitelinkRedirectUrlFactory } from './get_sitelink_redirect_url.js'
import { info } from './logger.js'
import parseLangHeader from './parse_lang_header.js'

export default function (query, headers, context) {
  const { properties } = query
  if (properties) {
    return {
      props: 'claims',
      getRedirectUrl: getPropertyRedirectUrlFactory(query),
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

  info('site', site)
  info('lang', lang)

  // Pass the parsed value
  query.lang = lang

  return {
    props: 'sitelinks',
    getRedirectUrl: getSitelinkRedirectUrlFactory(site, lang, context),
  }
}
