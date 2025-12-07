#!/usr/bin/env bash
marked ./README.md > ./assets/html/home.content.html
./scripts/assemble_home_parts.js > ./public/home.html
