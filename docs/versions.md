# Updating Versions of Java and/or node

## Updating the Java version

When updating the version of Java used, the following places need to be adjusted:

* `pom.xml` file (`<java.version>`; also check that the versions of `jacoco-maven-plugin` and
  `pitest-maven` support the new Java version, since both read compiled class files)
* `.java-version` file (used by the Github Actions workflows in `ucsb-cs156/workflows`)
* `system.properties` file (`java.runtime.version`, used by the Heroku/Dokku Java buildpack)
* `Dockerfile` used for deploying on Dokku (the Java version in the base image tags of *both* stages:
  `maven:...-eclipse-temurin-NN-...` for the build and `eclipse-temurin:NN-jre-...` for the runtime)

## Updating the node version

Places that name the node version:

* `engines` section in `frontend/package.json` (also used by Github Actions: the shared workflows in
  `ucsb-cs156/workflows` and the Chromatic workflows call `actions/setup-node` with
  `node-version-file: frontend/package.json`, so no workflow edit is needed)
* `pom.xml`: the `app.frontend.nodeVersion` property, used by `frontend-maven-plugin` in the
  `integration` and `production` profiles (the `Dockerfile` gets node through that plugin, so it
  does not name a version itself)

Then check `grep -rIn "<old version>" --exclude-dir=node_modules --exclude-dir=target .` for anything else.

After changing the version, if a local `mvn` build fails in `npm ci` with
`Class extends value undefined is not a constructor or null`, delete `target/node` and
`target/node_modules` (stale npm from the previous node version left in the plugin's install dir).

### Updating frontend dependencies at the same time

Notes from the move to node 24.21.0 (issue #355), useful as a checklist:

* `npm audit`, `npm outdated` and `npm ci 2>&1 | grep deprecated` show what needs attention.
  Remove dependencies that are not imported anywhere (`nyc`, `webpack`, `web-vitals`, the unscoped
  `react-fontawesome`, `@babel/plugin-proposal-private-property-in-object` were unused here).
* If `npm install` fails with a confusing `ERESOLVE` after editing versions, regenerate:
  `rm -rf node_modules package-lock.json && npm install`.
* Verify with all of: `npm run lint`, `npm run check-format`, `npm test`, `npm run build`,
  `npm run build-storybook`, and a Stryker run on one file
  (`npx stryker run --mutate src/main/utils/sectionUtils.jsx`; expect 100%), and a `mvn -Pproduction`
  build. Unit tests alone do not catch Storybook or Stryker breakage.
* Breaking changes hit in this repo:
  * react-router-dom 7 adds `data-discover="true"` to `<Link>` anchors: update snapshots.
  * Storybook 10 + msw-storybook-addon 3: use `mswLoader` from `msw-storybook-addon/csf3`, call
    `mswLoader()`, drop `initialize()`, and list `msw-storybook-addon` in `addons`.
  * vite 8 (Rolldown) cannot load a CJS `vite.config.js` that imports the ESM-only
    `rollup-plugin-visualizer` 7: the config is now `vite.config.mjs` (update `stryker.config.mjs` and
    the `pom.xml` up-to-date check); use `import.meta.dirname` and `rolldownOptions`.
  * @testing-library/user-event 14 is async: `await` every call. Tests that asserted a transient
    state (e.g. "Loading...") after a click now need a delayed mock response, and `resetHistory()`
    must be called *before* the click.
  * @testing-library/jest-dom 6+ has no `extend-expect` entrypoint (setup file already imports it).
  * eslint-plugin-react-hooks 7: use `configs.flat.recommended`; two new React Compiler rules
    (`set-state-in-effect`, `incompatible-library`) are turned off in `eslint.config.mjs`.
  * recharts 3: the bar-rendering `waitFor` in `GradeHistoryGraph.test.jsx` needs a longer timeout.
* Held back on purpose:
  * `vitest`/`@vitest/coverage-v8` stay on 4.x: with vitest 5 Stryker maps no tests to mutants, so
    every mutant survives (score 4% instead of 100%).
  * `eslint`/`@eslint/js` stay on 9.x: `eslint-plugin-react` 7.37.5 crashes on ESLint 10.
  * `react`/`react-dom` stay on 18 and `react-query` on 3: react-query 3 does not support React 19;
    moving to `@tanstack/react-query` is a separate migration. `react-query` 3 is also the source of
    the remaining `inflight`/`rimraf@3`/`glob@7` deprecation warnings.
  * `@tanstack/react-table` stays on 8 (9 is a rewrite); `graphql` stays on 16 (`msw` needs 16).
