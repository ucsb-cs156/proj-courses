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

* `Versions` section of the README.md
* `engines` section in `frontend/package.json` (this is used by Github Actions scripts)
* `Dockerfile` used for deploying on Dokku
* `pom.xml` in the configuration of `frontend-maven-plugin` (adjust both the node and npm versions)

