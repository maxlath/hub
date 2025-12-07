/* eslint-disable */

/*
This scripts uses Wikidata to add links related to the present article in the side bar
To use it on all Wikimedia sites, add the following line to https://meta.wikimedia.org/wiki/Special:MyPage/global.js
```
mw.loader.load("//meta.wikimedia.org/w/index.php?title=User:Maxlath/hub.js&action=raw&ctype=text/javascript");
```
Alternatively, you can add it per project by adding it to /wiki/Special:MyPage/common.js on that Wikimedia project

You can set a shortlist of links by preceding the line above with a config object:
```
window['hub:config'] = {
  shortlist: [ 'inventaire', 'scholia', 'P2002' ]
};
```

*/

(function (mw, $) {
  console.log('[hub] starting...')

  if (location.host === 'test.wikidata.org') {
    return console.log('[hub] blacklisted domain', location.host)
  }

  const entityId = mw.config.get('wgWikibaseItemId') || mw.config.get('wbEntityId')

  if (!entityId) {
    console.log('[hub] entity id not found')
    return
  } else {
    console.log('[hub] found entity id', entityId)
  }

  const portlet = 'p-hub'

  $('#mw-panel').append(`
    <div id='${portlet}' class='portal vector-menu-portal' role='navigation', aria-labelledby='${portlet}-label'>
      <h3 id='${portlet}-label' class='vector-menu-heading'>Hub</h3>
      <div class='vector-menu-content'><ul></ul></div>
    </div>`)

  const addLink = linkData => {
    const { url, label, icon } = linkData
    const id = `t-hub-${label.toLowerCase()}`
    const title = `See on ${label}`

    mw.util.addPortletLink(portlet, url, label, id, title)

    if (icon) addIcon(id, icon)
  }

  const addIcon = (id, icon) => {
    if (!window[id]) {
      console.warn('[hub] element not found', { id })
      return
    }
    const el = window[id].children[0]
    el.style.position = 'relative'
    el.style.left = '-18px'
    el.style['padding-left'] = '18px'
    el.style['background-image'] = `url(${icon})`
    el.style['background-repeat'] = 'no-repeat'
    el.style['background-position'] = 'left center'
  }

  let queryStr = ''
  const hubConfig = window['hub:config'] || {}
  const { shortlist } = hubConfig
  if (shortlist) queryStr = `?shortlist=${shortlist.join('|')}`

  console.log('[hub] fetching links...')

  fetch(`https://hub.toolforge.org/links/${entityId}${queryStr}`)
  .then(res => res.json())
  .then(links => {
    console.log('[hub] links', links)
    Object.values(links)
    .sort((a, b) => a.label.charCodeAt(0) - b.label.charCodeAt(0))
    .forEach(addLink)
    console.log('[hub] done!')
  })

  const wikidataIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Wikidata-logo-without-paddings.svg/16px-Wikidata-logo-without-paddings.svg.png'

  addIcon('t-wikibase', wikidataIcon)
}(mediaWiki, jQuery))
