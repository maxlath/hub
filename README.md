# wikidata-hub

A small webservice to handle redirections from a Wikidata id to Wikimedia sites and beyond

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Dependencies](#dependencies)
- [Install](#install)
- [Redirections from a Wikidata id](#redirections-from-a-wikidata-id)
  - [default](#default)
  - [lang](#lang)
  - [site](#site)
  - [property](#property)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Dependencies
* [NodeJS](https://nodejs.org) `>v6.4.0` (recommanded way to install: [NVM](https://github.com/creationix/nvm))

## Install
```sh
git clone github.com/maxlath/wikidata-hub
cd wikidata-hub
npm install
# Starts the server on port 2580 and watch for files changes to restart
npm run watch
```

## Redirections from a Wikidata id

### default
Redirect to the default site, `wikipedia`, with the user language guessed from the request `accept-language` header, falling back to English if the language header can't be found or the Wikipedia page doesn't exist in this language.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226`                                  | https://en.wikipedia.org/wiki/Gilles_Deleuze         |

### lang
Pass a `lang` parameter to override the `accept-language` header. Pass several values to set the fallback chain.

|  request                                    | redirection                                          |
|:--------------------------------------------|:-----------------------------------------------------|
| `/Q184226?lang=fr`                          | https://fr.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?lang=als,oc,fr,en&site=wikiquote` | https://oc.wikipedia.org/wiki/Gilles_Deleuze         |

### site
Pass a `site` parameter to redirect to another site than `wikipedia`. Pass several values to set the fallback chain. When combined with a `lang` fallback chain, the site fallback has priority.

|  request                                                           | redirection                                          |
|:-------------------------------------------------------------------|:-----------------------------------------------------|
| `/Q184226?site=wikiquote`                                          | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage`                                         | https://en.wikipedia.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote`                               | https://en.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikiquote&lang=fr`                                  | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |
| `/Q184226?site=wikivoyage,wikiquote,wikipedia&lang=als,oc,fr,en`   | https://fr.wikiquote.org/wiki/Gilles_Deleuze         |

### property
Pass a `property` parameter to generate the redirection URL from the entity claims associated to the desired property. The following examples illustrate the different behaviors depending on the property type:

|  **request**                                | **redirection**                                      |
|---------------------------------------------|------------------------------------------------------|
|                                             |                                                      |
| **Url**                                     |                                                      |
| `/Q21980377?property=P856`                  | https://sci-hub.tw                                   |
| `/Q1103345?property=P953`                   | http://www.cluetrain.com/#manifesto                  |
| `/Q756100?property=P1324`                   | https://github.com/nodejs/node                       |
| `/Q132790?property=P4238`                   | http://www.biarritz.fr/webcam_2.html                 |
|                                             |                                                      |
| **ExternalId**                              |                                                      |
| `/Q34981?property=P1938`                    | https://www.gutenberg.org/ebooks/author/35316        |
| `/Q624023?property=P2002`                   | https://twitter.com/eff                              |
|                                             |                                                      |
| **WikibaseItem**                            |                                                      |
| `/Q155?property=P38`                        | https://en.wikipedia.org/wiki/Brazilian_real         |

### aliases
Alternatively to a Wikidata id, you can pass a key built from sitelinks as starting point:
|  request                                              | redirection                                                                             |
|:------------------------------------------------------|:----------------------------------------------------------------------------------------|
| `/frwikivoyage:Allemagne`                             | https://en.wikipedia.org/wiki/Germany                                                   |
| `/eswikinews:Categoría:Alemania`                      | https://en.wikipedia.org/wiki/Germany                                                   |
| `/ocwiki:Alemanha?lang=de`                            | https://de.wikipedia.org/wiki/Deutschland                                               |
| `/ocwiki:Alemanha?lang=el,fa&site=wikivoyage`         | https://el.wikivoyage.org/wiki/%CE%93%CE%B5%CF%81%CE%BC%CE%B1%CE%BD%CE%AF%CE%B1         |
