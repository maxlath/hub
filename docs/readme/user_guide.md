## User Guide

Every URL is built as **a bridge between two points, an origin and a destination**:
* the **origin** depends on **what you have at hand**: a Wikidata id? some string that might match an Wikipedia article title? in a precise language or in any language? an identifier in an external database?
* the **destination** depends on **where you would like to go**: would you just like to be show the most relevant associated Wikipedia article for this origin point, or do you have a more precise target language, project, external website?

The separation between the origin and the destination is expressed in the URL by the `?`: everything before the `?` aims to identify the origin, everything after identifies the destination.

Example:

* url: `/enwiki:Economy?lang=nl&site=wikinews`
* origin: the [`Economy` article in the English Wikipedia](https://en.wikipedia.org/wiki/Economy)
* destination: [the corresponding article in the Dutch Wikinews](https://nl.wikinews.org/wiki/Categorie:Economie)

### Origin

#### Wikidata id
As the real hub in this story is Wikidata, every request needs to first resolve to a Wikidata id, which can thus be considered the primary origin point:

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q1`                                       | https://en.wikipedia.org/wiki/Universe               |
| `/Q2`                                       | https://en.wikipedia.org/wiki/Earth                  |
| ...                                         |                                                      |
| `/Q1388426`                                 | https://en.wikipedia.org/wiki/Bo%C3%ABn-sur-Lignon   |

#### Wikipedia and other Wikimedia Project

Alternatively to a Wikidata id, you can pass a key built from sitelinks as starting point, defaulting to `enwiki`.

|  request                                         | redirection                                                                             |
|:-------------------------------------------------|:----------------------------------------------------------------------------------------|
| `/frwikivoyage:Allemagne`                        | https://en.wikipedia.org/wiki/Germany                                                   |
| `/eswikinews:Categoría:Alemania`                 | https://en.wikipedia.org/wiki/Germany                                                   |
| `/ocwiki:Alemanha?lang=de`                       | https://de.wikipedia.org/wiki/Deutschland                                               |
| `/ocwiki:Alemanha?lang=el,fa&site=wikivoyage`    | https://el.wikivoyage.org/wiki/%CE%93%CE%B5%CF%81%CE%BC%CE%B1%CE%BD%CE%AF%CE%B1         |
| `/enwiki:Edward_Snowden?property=P2002`          | https://twitter.com/Snowden                                                             |
| `/enwiki:DIY?site=wikidata`                      | https://www.wikidata.org/wiki/Q26384                                                    |
| `/DIY?site=wikidata`                             | https://www.wikidata.org/wiki/Q26384                                                    |

#### External Ids
|  request                                         | redirection                                                                             |
|:-------------------------------------------------|:----------------------------------------------------------------------------------------|
| `/P214:24597135`                                 | https://en.wikipedia.org/wiki/Isaac_Asimov                                              |
| `/viaf:24597135`                                 | https://en.wikipedia.org/wiki/Isaac_Asimov                                              |
| `/twitter:doctorow`                              | https://en.wikipedia.org/wiki/Cory_Doctorow                                             |

### Destination
#### Default
By default, the destination is Wikipedia in the user language, which is guessed from the request `accept-language` header, falling back to English if the language header can't be found or the Wikipedia page doesn't exist in this language.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226`                                  | https://en.wikipedia.org/wiki/Gilles_Deleuze         |

#### Wikimedia Projects
###### lang

Pass a `lang` parameter (or just `l`) to override the `accept-language` header. Pass several values to set the fallback chain.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226?lang=fr`                          | https://fr.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?lang=als,oc,fr,en&site=wikiquote` | https://oc.wikipedia.org/wiki/Gilles_Deleuze         |

###### site

Pass a `site` parameter (or just `s`) to redirect to another site than `wikipedia`. Pass several values to set the fallback chain. When combined with a `lang` fallback chain, the site fallback has priority.

|  request                                                           | redirection                                          |
|:-------------------------------------------------------------------|:-----------------------------------------------------|
| `/Q184226?site=wikiquote`                                          | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage`                                         | https://en.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote`                               | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikiquote&lang=fr`                                  | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote,wikipedia&lang=als,oc,fr,en`   | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |

This can also include sites that can build URLs from Wikidata ids:

|  request                                                           | redirection                                          |
|:-------------------------------------------------------------------|:-----------------------------------------------------|
| `/Q23936146?site=crotos`                                           | http://zone47.com/crotos/?q=Q23936146                |
| `/Q184226?site=inventaire`                                         | https://inventaire.io/entity/wd:Q184226              |
| `/Q638519?site=monumental`                                         | https://tools.wmflabs.org/monumental/#/object/Q638519|
| `/Q184226?site=portal`                                             | https://tools.wmflabs.org/portal/Q184226             |
| `/Q184226?site=reasonator`                                         | https://tools.wmflabs.org/reasonator/?q=Q184226      |
| `/Q184226?site=scholia`                                            | https://tools.wmflabs.org/scholia/Q184226            |
| `/Q184226?site=sqid`                                               | https://tools.wmflabs.org//sqid/#/view?id=Q184226    |

**short site names**

You can use short versions of those sites names:

| long            | short            |
|-----------------|:-----------------|
| `wikidata `     | `wd`             |
| `wikipedia`     | `wp`             |
| `commons`       | `c`, 'wc'        |
| `wikisource`    | `ws`             |
| `wikiquote`     | `wq`             |
| `wiktionary`    | `wt`             |
| `wikivoyage`    | `wv`             |
| `wikiversity`   | `wy`             |
| `wikinews`      | `wn`             |
| `inventaire`    | `inv`            |
| `portal`        | `po`             |
| `reasonator`    | `re`             |
| `scholia`       | `sc`             |
| `sqid`          | `sq`             |

Example: `/Q184226?s=wq,wp,inv,wd&l=fr,en,de`

#### Following a claim

Pass a `property` parameter (or just `p`) to get the destination from the entity claims associated to the desired property. The following examples illustrate the different behaviors depending on the property type:

|  **request**                                      | **redirection**                                                                                   |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------|
|                                                   |                                                                                                   |
| **Url**                                           |                                                                                                   |
| `/Q21980377?property=P856`                        | https://sci-hub.tw                                                                                |
| `/Q1103345?property=P953`                         | http://www.cluetrain.com/#manifesto                                                               |
| `/Q756100?property=P1324`                         | https://github.com/nodejs/node                                                                    |
| `/Q132790?property=P4238,P856`                    | http://www.biarritz.fr/webcam_2.html                                                              |
|                                                   |                                                                                                   |
| **ExternalId**                                    |                                                                                                   |
| `/Q34981?property=P1938`                          | https://www.gutenberg.org/ebooks/author/35316                                                     |
| `/Q624023?property=P2002,P2003`                   | https://twitter.com/EFF                                                                           |
|                                                   |                                                                                                   |
| **WikibaseItem**                                  |                                                                                                   |
| `/Q155?property=P38`                              | https://en.wikipedia.org/wiki/Brazilian_real                                                      |
|                                                   |                                                                                                   |
| **CommonsMedia**                                  |                                                                                                   |
| `/Q241?property=P242`                             | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg            |
| `/Q241?property=P242&width=1000`                  | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000 |
|                                                   |                                                                                                   |
| **GlobeCoordinate**                               |                                                                                                   |
| `/Q25373?property=P625`                           | https://www.openstreetmap.org/?mlat=35.2542&mlon=-24.2585                                         |
|                                                   |                                                                                                   |

Not supported: `String`, `Time`, `Monolingualtext`, `Quantity`, `WikibaseProperty`, `Math`

A `w` can be used for short for `width`.

###### properties bundles

Instead of a list of properties, you can use special bundle keys, that behave like a list of properties.
The `image` property is a bundles designed to be an easy way to give an image to an entity:
```html
<img src="/Q624023?property=image&width=256" />
```

|  **request**                                     | **redirection**                                                                                   |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/Q624023?property=image`                        | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg                                  |
| `/Q624023?property=social`                       | https://twitter.com/EFF                                                                           |
| `/Q604319?property=social`                       | https://tools.wmflabs.org/wikidata-externalid-url/?p=4033&id=LaQuadrature@mamot.fr                |
| `/Q624023?property=image&width=120`              | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg?width=120                        |
| `/Q241?p=P242&w=1000`                            | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000 |

###### multiple properties

Did you ever wish to link to Stephan Zweig's (Q78491) spouse's (P26) place of death (P20) administrative territory (P131) time zone (P421) image (P18)? Now you can:

|  **request**                                     | **redirection**                                                                                   |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/Q78491?property=P26\|P20\|P131\|P421\|P18`         | https://commons.wikimedia.org/wiki/Special:FilePath/Timezones2008_UTC-5_gray.png                  |


### JSON
You can get a JSON response (status code `200`) instead of a redirection (status code `302`) by adding the query parameter `format=json`. Ex: `/Q184226?lang=fr&format=json`
This can be useful for debugging, or to use the internal resolver as a JSON API.

|  **request**                           | **response**                                     |
|----------------------------------------|--------------------------------------------------|
| `/Q184226?lang=fr&format=json`         | `{ origin: [Object], destination: [Object] }`    |
| `/Q184226?l=fr&f=j`                    | `{ origin: [Object], destination: [Object] }`    |

### Query the Hub as a search engine
Building Hub URLs from the URL bar requires a few steps:
- go to your browser URL bar (shortcut: `Ctrl+L` or `Alt+D`)
- enter some keys to make your history suggest one of your previous `https://hub.toolforge.org/` URLs
- edit the URL as you please. Example: https://hub.toolforge.org/Q1?l=fr

But we could be even more lazy by adding Hub as a search engine to your browser (see tutorials hereafter for [firefox](#firefox) and [chrome](#chrome)). The steps can now be as follow (assuming you set `hub` as search engine keyword):
- go to your browser URL bar (shortcut: `Ctrl+L` or `Alt+D`)
- enter the URL elements as you would do if you where editing the `https://hub.toolforge.org/` URL, separating elements with spaces. Example: `hub Q1 l=fr`

#### Firefox
- Follow this tutorial to add the Hub to your search engines list: [Add a search engine](https://support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox#w_add-a-search-engine)
- In [about:preferences#search](about:preferences#search), on the Hub search engine line:
   -  double click the **keyword** column to edit it
   -  enter a keyword (we will hereafter assume that you set it to `hub`)
- Try it:
  -  go to your browser address bar (shortcut: `Ctrl+L` or `Alt+D`)
  -  type `hub Q1 l=fr`, that should bring you to https://fr.wikipedia.org/wiki/Univers

#### Chrome
- go to [chrome://settings/searchEngines](chrome://settings/searchEngines)
- in the **Other search engines** section, click **Add**, and fill as follow:
  - **Search Engine**: Hub
  - **Keyword**: hub
  - **URL with %s instead of the request**: https://hub.toolforge.org/query?q=%s
- Try it:
  -  go to your browser address bar (shortcut: `Ctrl+L`)
  -  type `hub`, press `Tab`: the address bar should now display `Search on Hub`
  -  you can now type your query, and press `Enter` (ex: `Q1 l=fr` will bring you to https://fr.wikipedia.org/wiki/Univers)
