 # Configuring for MongoDB

On localhost, you do not need to do any special configuration for MongoDB; it uses
an in-memory instance of MongoDB similar to how H2 is an in-memory instance of
an SQL database.

On dokku, you set up the MongoDB database in a similar way to how we setup the
Postgres database, with these commands.

Note that `appname` should be replaced with the name of your app, e.g. `courses`, `courses-qa`, `courses-dev-cgaucho`, etc.

Append `-m-db` to distinguish this from the app itself.

```
dokku mongo:create appname-m-db
dokku mongo:link appname-m-db appname --no-restart
```

For example, for a `courses-dev-cgaucho` app, you'd use:

```
dokku mongo:create courses-dev-cgaucho-m-db
dokku mongo:link courses-dev-cgaucho-m-db courses-dev-cgaucho --no-restart
```
