#!/bin/bash
if [ -n "$DOKKU_POSTGRES_AQUA_URL" ]; then
DATABASE_URL="$DOKKU_POSTGRES_AQUA_URL"
fi

export JDBC_DATABASE_PASSWORD=$(echo "$DATABASE_URL" | cut --delimiter=: -f3 | cut --delimiter=\@ -f1)

export JDBC_DATABASE_URL=jdbc:postgresql://$(echo "$DATABASE_URL" | cut --delimiter=\@ -f2)

export JDBC_DATABASE_USERNAME=postgres

java -jar $1
