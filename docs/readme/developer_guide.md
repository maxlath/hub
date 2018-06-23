
## Developer Guide

* Wikimedia Toolforge: https://toolsadmin.wikimedia.org/tools/id/hub
* Source code: https://github.com/maxlath/hub

### Dependencies
* [NodeJS](https://nodejs.org) `>v6.4.0` (recommanded way to install: [NVM](https://github.com/creationix/nvm))

### Install
```sh
git clone https://github.com/maxlath/hub
cd hub
npm install
# Starts the server on port 2580 and watch for files changes to restart
npm run watch
```

### Deploy
The step followed to setup this tool on tools.wmflabs.org are documented here: [deploy](https://github.com/maxlath/hub/blob/master/docs/deploy.md)

### See also

* This tool is based on the [wikidata-sdk](https://github.com/maxlath/wikidata-sdk) JavaScript library
* Wikidata can be [queried by SPARQL](http://query.wikidata.org/)
* All Wikimedia wikis, e.g. Wikipedia, can be [queried by MediaWiki API](https://en.wikipedia.org/w/api.php)

## License
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)
