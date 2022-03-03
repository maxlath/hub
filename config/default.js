module.exports = {
  host: 'http://localhost:2580',
  name: 'hub',
  port: 2580,
  root: '',
  base: function () {
    return this.host + this.root
  },
  metadata: {
    name: 'Hub',
    title: 'Hub - a web hub based on Wikidata',
    description: "A Web hub: it let's you craft URLs to go from an origin to a destination on the web, at the condition that you provide enough information on those points to be identified within Wikidata. It works primarily around Wikimedia sites, but given the amount Wikidata knows about the web at large, it can get you pretty far! And if you don't where you want to go, that's ok too: this will just bring you to the closest Wikipedia article."
  }
}
