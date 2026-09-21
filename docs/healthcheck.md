# Health check: monitoring the databases

This app depends on two databases: a SQL database (Postgres on dokku, H2 on localhost) for
users, personal schedules and jobs, and MongoDB for course data. The app can be "up", serving
pages and answering requests, while one of those databases is unusable. When that happens:

* `/api/actuator/health` reports it, for use by an uptime monitor.
* A red banner appears at the top of every page, so that users know why searches are failing.

## The endpoint

`GET /api/actuator/health` is provided by
[Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.health).
It needs no login.

| Situation | HTTP status | Body |
|-|-|-|
| Everything is working | 200 | `{"status":"UP","components":{"db":{"status":"UP"},"mongo":{"status":"UP"}, ...}}` |
| A database is unusable | 503 | `{"status":"DOWN","components":{"db":{"status":"UP"},"mongo":{"status":"DOWN"}, ...}}` |

`db` is the SQL database and `mongo` is MongoDB. Each check runs a real command over the app's
own authenticated connection, so it fails for wrong credentials as well as for a server that
is unreachable. The other components (`diskSpace`, `ping`, `ssl`) are Actuator defaults.

Only component names and `UP`/`DOWN` are shown; hostnames and error text are deliberately not
(`management.endpoint.health.show-details=never`). For the underlying error, look at the app's
logs (`dokku logs appname`). `health` is the only Actuator endpoint that is exposed.

If MongoDB has disappeared entirely (as opposed to refusing a login), the 503 takes about 5
seconds to arrive. That is how long the app waits for MongoDB before giving up, and it applies
to every request that uses MongoDB, not just the health check: during an outage a search fails
after 5 seconds. The MongoDB driver's own default is 30 seconds, which made the health check too
slow for many uptime monitors, and tied up a server thread for 30 seconds for every browser tab
polling it. When MongoDB is healthy this wait is never used. It is set in `MongoTimeoutConfig`,
and can be changed with the environment variable `MONGO_SERVER_SELECTION_TIMEOUT_SECONDS`, e.g.
`dokku config:set appname MONGO_SERVER_SELECTION_TIMEOUT_SECONDS=2`.

Set your monitor's own timeout comfortably above that, e.g. 10 seconds or more.

## Setting up an uptime monitor

Point the monitor at `https://<your app>/api/actuator/health` and have it alert on any status
other than 200.

If your monitor supports it, also require that the response contains the text `"status":"UP"`.
The reason: this app's frontend answers **200 with the HTML of the home page for any path it
does not recognize**. So a monitor that is pointed at a mistyped path, or at an older deployment
that does not have this endpoint, sees 200 forever and never alerts. Checking for the text
catches that mistake.

## The banner

Every page polls the endpoint once a minute. When `mongo` or `db` is `DOWN`, a red banner
explains which features are affected; it goes away by itself within a minute of the database
coming back. It is shown by the same code that shows `systemMessages` from `/api/systemInfo`
(see `AppNavbar.jsx`), but it is fetched separately (`frontend/src/main/utils/healthCheck.jsx`),
because `/api/systemInfo` is cached in the browser for 24 hours, which is far too long for
"is the database up right now?".

The banner only appears when the backend positively reports `DOWN`. If the health request
itself fails (for example, the user's own network is down), nothing is shown.

## Runbook: "Authentication failed" from MongoDB on dokku, though nothing was changed

This is the September 2026 incident that led to this feature.

**Symptoms.** Every request that touches MongoDB fails with a 500, and the logs show
`Command failed with error 18 (AuthenticationFailed)`. Yet `dokku mongo:connect <service>`
works, and the app's `MONGO_URL` is identical to the DSN shown by `dokku mongo:info <service>`.
Several apps on the same host break at about the same time, typically after the host reboots.

**Cause.** Dokku links an app to its MongoDB service by writing the service container's IP
address into the app's container when that container is created. If the service containers are
later restarted and come back with different IP addresses, the app keeps using the old
address, which may now belong to *another app's* MongoDB. That server has never heard of this
app's user, so it answers "Authentication failed". The credentials are fine; they are being
presented to the wrong server.

**Diagnosis.** Compare the service's real address with the one the app's container is using
(this example is for an app `courses` linked to the service `courses-m`):

```
dokku mongo:info courses-m --internal-ip
dokku enter courses web getent hosts dokku-mongo-courses-m
```

If the two addresses differ, this is the problem.

**Fix.** Recreate the app's container, which looks the address up again:

```
dokku ps:restart courses
```

Postgres services are linked the same way, so the same thing can happen to them.
