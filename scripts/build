#!/usr/bin/env bash
set -eu
mkdir -p public/images

npm run build-readme
npm run build-home

# CSS
cp ./node_modules/github-markdown-css/github-markdown.css public/github-markdown.css

# Images
cp assets/images/favicon-16x16.png public/images/favicon-16x16.png
cp assets/images/favicon-64x64.png public/images/favicon-64x64.png
cp assets/images/favicon.ico public/favicon.ico
cp assets/images/wizard_square_3.png public/wizard_square_3.png

# OpenSearch
cp assets/opensearch.xml public/opensearch.xml
URL_BASE=$(node -p "require('config').base()")
NAME=$(node -p "require('config').metadata.name")
TITLE=$(node -p "require('config').metadata.title")
DESCRIPTION=$(node -p "require('config').metadata.description")

substitute_strings(){
  # Using '@' as expressions separator
  sed -i "s@URL_BASE@${URL_BASE}@" $1
  sed -i "s@NAME@${NAME}@" $1
  sed -i "s@TITLE@${TITLE}@" $1
  sed -i "s@DESCRIPTION@${DESCRIPTION}@" $1
}

substitute_strings public/opensearch.xml
substitute_strings public/home.html
