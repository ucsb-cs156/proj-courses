#!/usr/bin/env sh
# Copy REACT_APP_ variables to a local .env

rm -rf .env
touch .env
grep -v '^#' ../.env | grep -v '^$' | grep '^REACT_APP' | while read -r line ; do
  echo "${line} " >> .env
done



