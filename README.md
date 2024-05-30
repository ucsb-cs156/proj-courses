# proj-courses

This repo contains the code for the CMPSC 156 legacy code project "Courses Search".

The project provides a web application where users can search for UCSB courses in various ways.

Users with a Google Account can also store past, current or future schedules of courses for particular quarters.

# Deployments

| Type | Link                                       |
| ---- | ------------------------------------------ |
| prod | <https://courses.dokku-00.cs.ucsb.edu/>    |
| qa   | <https://courses-qa.dokku-00.cs.ucsb.edu/> |

# W24 Production Deployments

| Team      | Link                                    |
| --------- | --------------------------------------- |
| w24-5pm-1 | <https://courses.dokku-05.cs.ucsb.edu/> |
| w24-5pm-2 | <https://courses.dokku-06.cs.ucsb.edu/> |
| w24-5pm-3 | <https://courses.dokku-07.cs.ucsb.edu/> |
| w24-5pm-4 | <https://courses.dokku-08.cs.ucsb.edu/> |

# W24 QA Deployments

| Team      | Link                                       |
| --------- | ------------------------------------------ |
| w24-5pm-1 | <https://courses-qa.dokku-05.cs.ucsb.edu/> |
| w24-5pm-2 | <https://courses-qa.dokku-06.cs.ucsb.edu/> |
| w24-5pm-3 | <https://courses-qa.dokku-07.cs.ucsb.edu/> |
| w24-5pm-4 | <https://courses-qa.dokku-08.cs.ucsb.edu/> |

# Setup before running application

Before running the application for the first time,
you need to do the steps documented in [`docs/oauth.md`](docs/oauth.md).

Otherwise, when you try to login for the first time, you
will likely see an error such as:

<img src="https://user-images.githubusercontent.com/1119017/149858436-c9baa238-a4f7-4c52-b995-0ed8bee97487.png" alt="Authorization Error; Error 401: invalid_client; The OAuth client was not found." width="400"/>

# Getting Started on localhost

- Open _two separate terminal windows_
- In the first window, start up the backend with:
  ```
  mvn spring-boot:run
  ```
- In the second window:
  ```
  cd frontend
  npm install  # only on first run or when dependencies change
  npm start
  ```

Then, the app should be available on <http://localhost:8080>

If it doesn't work at first, e.g. you have a blank page on <http://localhost:8080>, give it a minute and a few page refreshes. Sometimes it takes a moment for everything to settle in.

If you see the following on localhost, make sure that you also have the frontend code running in a separate window.

```
Failed to connect to the frontend server... On Dokku, be sure that PRODUCTION is defined.  On localhost, open a second terminal window, cd into frontend and type: npm install; npm start";
```

# Getting Started on Dokku

On Heroku, you'll need to set the following configuration variable:

- Using the Dokku CLI:
  ```
  dokku config:set <dokku app name> PRODUCTION=true
  ```

You'll also need to follow the OAuth set up instructions here: [`docs/oauth.md`](docs/oauth.md).

If you get the following message on Dokku, it probably means that you failed to setup the `PRODUCTION` environment variable.

```
Failed to connect to the frontend server... On Dokku, be sure that PRODUCTION is defined.  On localhost, open a second terminal window, cd into frontend and type: npm install; npm start";
```

Additional environment variables that are needed may be found in `.env.SAMPLE`

In particular, you will need a value for the `UCSB_API_KEY`. This is documented in `docs/ucsb_api_key.md`

# Accessing swagger

To access the swagger API endpoints, use:

- <http://localhost:8080/swagger-ui/index.html>

# To run React Storybook

- cd into frontend
- use: npm run storybook
- This should put the storybook on http://localhost:6006
- Additional stories are added under frontend/src/stories

- For documentation on React Storybook, see: https://storybook.js.org/

# Accessing Database Console

- On localhost only: <http://localhost:8080/h2-console> See also: [docs/h2-console.md](docs/h2-console.md)
- On Dokku: see: <https://ucsb-cs156.github.io/topics/dokku/postgres_command_line.html>

## Partial pitest runs

This repo has support for partial pitest runs

For example, to run pitest on just one class, use:

```
mvn pitest:mutationCoverage -DtargetClasses=edu.ucsb.cs156.courses.controllers.PSCourseController
```

To run pitest on just one package, use:

```
mvn pitest:mutationCoverage -DtargetClasses=edu.ucsb.cs156.courses.controllers.\*
```

To run full mutation test coverage, as usual, use:

```
mvn pitest:mutationCoverage
```
