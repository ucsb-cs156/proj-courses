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

## Accessing Mongo Command on dokku

If you want to list records in the mongo collections, you can access a mongo command 
line on dokku with the following command (substitute the name of your mongo db database in place of `courses-m`:

```
dokku mongo:connect courses-m
```

That gives you something like the following:

```
pconrad@dokku-00:~$ dokku mongo:connect courses-m
Current Mongosh Log ID:	69768804b279b310cf0bbacc
Connecting to:		mongodb://<credentials>@127.0.0.1:27017/courses_m?directConnection=true&serverSelectionTimeoutMS=2000&authSource=courses_m&appName=mongosh+1.10.1
Using MongoDB:		6.0.7
Using Mongosh:		1.10.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

courses_m>
```

Some useful commands:

| Command | Explanation |
|-|-|
| `show collections` | Show the names of all of the collections in the database |
| `db.courses.find().limit(5)` | Show the first 5 documents in the `courses` collection |

