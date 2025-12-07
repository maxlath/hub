#!/usr/bin/env bash
npm run update-properties
npm run build

echo -e "\e[0;32msetup githooks\e[0m"
# Make git hooks trackable (see https://stackoverflow.com/a/4457124/3324977)
rm -rf .git/hooks
# Symbolic link is relative to the .git directory, thus the path starting with ".."
ln -s ../scripts/githooks .git/hooks
echo -e "\e[0;32msetup githooks: done\e[0m"
