#!/usr/bin/env sh
marked ./README.md > ./assets/html/home.content.html
./scripts/assemble_home_parts.js > ./public/home.html
