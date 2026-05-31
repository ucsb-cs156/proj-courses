# proj-courses

## Node.js version

Before running any frontend commands (`npm test`, `npm install`, `stryker`, etc.),
check `frontend/package.json` for the required Node.js version (look in the `engines.node` field)
and switch to that version with `nvm use <version>`.

For example, if `engines.node` is `^v22.18.0`, run:

```
nvm use 22.18.0
```

Running on the wrong Node version causes `ERR_REQUIRE_ESM` errors from `vite.config.js`.
