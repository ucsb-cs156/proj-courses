# Special notes for Docker

When running on Docker, you'll need to define the environment
variables from `.env` using `dokku config:set appname VARNAME=VALUE`

For the variables that start with `REACT_APP_...` you also need to do this
(just once) so that the variables are exposed during the build phase.

```sh
dokku docker-options:add courses build '--build-arg REACT_APP_SOURCE_REPO'
dokku docker-options:add courses build '--build-arg REACT_APP_START_QTR'
dokku docker-options:add courses build '--build-arg REACT_APP_END_QTR'
```

If setting up a qa version or a private dev version, use `courses-qa` or `courses-dev-cgaucho` for example, instead of `courses`:
