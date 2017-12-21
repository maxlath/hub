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

This can also include sites that can build URLs from Wikidata ids, such as [Scholia](https://tools.wmflabs.org/scholia) and [inventaire.io](https://inventaire.io)

|  request                                                           | redirection                                          |
|:-------------------------------------------------------------------|:-----------------------------------------------------|
| `/Q184226?site=scholia`                                            | https://tools.wmflabs.org/scholia/Q184226            |
| `/Q184226?site=inventaire`                                         | https://inventaire.io/entity/wd:Q184226              |


####### sites short names

You can use short versions of those sites names:

| long            | short            |
|-----------------|:-----------------|
| `wikidata `     | `wd`             |
| `wikipedia`     | `wp`             |
| `commons`       | `c`              |
| `wikisource`    | `ws`             |
| `wikiquote`     | `wq`             |
| `wiktionary`    | `wt`             |
| `wikivoyage`    | `wv`             |
| `wikiversity`   | `wy`             |
| `wikinews`      | `wn`             |
| `scholia`       | `sc`             |
| `inventaire`    | `inv`            |


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
The `image` and `avatar` bundles are designed to be a cheap way to give an image to an entity:
```html
<img src="/Q624023?property=image,avatar&width=256" />
```

|  **request**                                     | **redirection**                                                                                   |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/Q624023?property=image`                        | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg                                  |
| `/Q624023?property=avatar`                       | https://avatars.io/twitter/EFF/                                                                   |
| `/Q624023?property=social`                       | https://twitter.com/EFF                                                                           |
| `/Q604319?property=social`                       | https://tools.wmflabs.org/wikidata-externalid-url/?p=4033&id=LaQuadrature@mamot.fr                |
| `/Q624023?property=image,avatar&width=120`       | https://commons.wikimedia.org/wiki/Special:FilePath/EFF_Logo.svg?width=120                        |
| `/Q604319?property=avatar,image&width=256`       | https://avatars.io/twitter/laquadrature/large                                                     |
| `/Q241?p=P242&w=1000`                            | https://commons.wikimedia.org/wiki/Special:FilePath/Cuba_(orthographic_projection).svg?width=1000 |
