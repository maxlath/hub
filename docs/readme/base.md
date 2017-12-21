# Hub

This is a **Web hub**: it let's you craft URLs to go from an **origin** to a **destination** on the web, at the condition that you provide enough information on those points to be identified within [Wikidata](https://wikidata.org). It works primarly around Wikimedia sites, but given the amount Wikidata knows about the web at large, it can get you pretty far! And if you don't where you want to go, that's ok too: this will just bring you to the closest Wikipedia article.

**Target audience**:
- Wikidata-centered tools developers
- URL craftmen: people who like to browse the web by tweaking URLs

**A few examples to catch your interest**:

we can now link to Wikipedia articles about a concept in the user's favorite language:
- from a Wikidata id: `/Q3`
- from an article title from the English Wikipedia: `/Lyon`
- or another Wikipedia: `/zh:阿根廷`
- or any Wikimedia project: `/frwikivoyage:Allemagne`
- or any external id known by Wikidata: `/twitter:doctorow`

but, after choosing your starting point, you can also customize your destination:
- here we go from one Wikipedia to the other: `/en:Economy?lang=de`
- here from Wikidata to Wikiquote: `/Q184226?site=wikiquote`
- between any external ids known by Wikidata: `/viaf:24597135?property=P1938`

for your next prototype, illustrate your concepts the lazy way:

<!-- Using local images as Github messes with the raw URLs -->
|  image                                           | src                                         |
|:-------------------------------------------------|:--------------------------------------------|
| ![avatar example](assets/images/esa.jpeg)        | `/Q42262?property=avatar&width=128`         |
| ![image example](assets/images/laniakea.jpg)     | `/frwiki:Laniakea?property=image&width=256` |

## Summary

<!-- START doctoc -->
<!-- END doctoc -->
