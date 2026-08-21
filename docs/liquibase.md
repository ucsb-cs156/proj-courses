# Database Migrations with Liquibase

This code base uses [Liquibase](https://www.liquibase.org/) to manage the database schema, instead of
letting Hibernate create/alter tables automatically (`spring.jpa.hibernate.ddl-auto=update`). Liquibase
gives us a versioned, reviewable history of every schema change, and the exact same migrations run against
H2 (localhost/tests) and Postgres (production on Dokku), so schema drift between environments is caught early.

This setup was introduced in [issue #315](https://github.com/ucsb-cs156/proj-courses/issues/315), modeled
after the Liquibase setup already in place in the sibling repo
[proj-scaffold](https://github.com/ucsb-cs156/proj-scaffold), with some adjustments to fit this repo's
existing conventions. See the [Alignment across repos](#alignment-across-repos) section at the end of this
document for how this setup compares to the other UCSB CS156 repos that also use Liquibase.

## How it's wired up

* `pom.xml` declares a plain dependency on `org.liquibase:liquibase-core` (version managed by the
  `spring-boot-starter-parent` BOM). This is enough for Spring Boot's `LiquibaseAutoConfiguration` to detect
  Liquibase on the classpath and run it automatically at application startup, before Hibernate's
  `EntityManagerFactory` is created.
* `src/main/resources/application.properties` sets:

  ```properties
  spring.jpa.hibernate.ddl-auto=none
  spring.liquibase.change-log=db/migration/changelog-master.json
  ```

  `ddl-auto=none` tells Hibernate to never create, alter, or drop tables itself — the schema is
  Liquibase's responsibility, exclusively. This applies uniformly across the `development`, `integration`,
  and `production` Spring profiles (none of the profile-specific `application-*.properties` files override
  it), and also to plain unit tests, which use Spring Boot's auto-configured embedded H2 database.

## File layout

```
src/main/resources/db/migration/
├── changelog-master.json        # the root changelog Spring Boot loads
└── changes/
    ├── 001-create-users-table.json
    ├── 002-create-courses-table.json
    ├── 003-create-personalschedule-table.json
    ├── 004-create-rate-limited-ips-table.json
    ├── 005-create-ucsbapiquarter-table.json
    ├── 006-create-ucsb-subjects-table.json
    ├── 007-create-historygrade-table.json
    ├── 008-create-enrollmentdatapoint-table.json
    └── 009-create-jobs-table.json
```

The master changelog uses Liquibase's `includeAll` directive to pick up every file in `db/migration/changes/`
in filename order, which is why every changeset file is numbered:

```json
{
  "databaseChangeLog": [
    { "includeAll": { "path": "db/migration/changes/" } }
  ]
}
```

`009-create-jobs-table.json` creates the `JOBS` table used by the shared async-jobs library this app depends
on, `lib-jobs` (see [proj-courses#314](https://github.com/ucsb-cs156/proj-courses/pull/314)). The library
ships its own copy of this same changeset bundled inside its jar
(`db/migration/lib-jobs/changelog-master.json`, which proj-dining `include`s directly), but proj-courses
deliberately does **not** use that `include` — see
[Incident: "relation \"jobs\" already exists" on first production deploy](#incident-relation-jobs-already-exists-on-first-production-deploy)
below for why, and [Alignment across repos](#alignment-across-repos) for the resulting recommendation to fix
this upstream in `lib-jobs` itself.

Changesets are plain JSON (not XML or YAML) to match the format already used by the other four sibling repos.

## Incident: relation "jobs" already exists on first production deploy

The first production deploy of this Liquibase setup failed with `relation "jobs" already exists`. Here's
what happened and why, since it's instructive for anyone adding a new migration later.

**Root cause.** Every table this app already had — `users`, `courses`, `personalschedule`,
`rate_limited_ips`, `ucsbapiquarter`, `ucsb_subjects`, `historygrade`, `enrollmentdatapoint`, and `jobs` —
pre-existed in production, created over time by Hibernate's old `ddl-auto=update`. All eight of *this repo's
own* changesets have a `preConditions`/`MARK_RAN` guard (see [Adding a new migration](#adding-a-new-migration)),
so when Liquibase ran them against production for the first time, each one correctly detected its table
already existed and marked itself as already-applied without trying to recreate it — this is confirmed in the
Liquibase startup log as `Marking ChangeSet ... as ran despite precondition failure due to onFail='MARK_RAN'`.

The `JOBS` table was different. The original setup `include`d the changelog bundled inside the `lib-jobs`
jar itself, and that changelog's one changeset has **no** `preConditions` guard — it unconditionally issues
`CREATE TABLE JOBS (...)`. Every other table survived because *this repo's* changesets happened to be
written defensively; the `JOBS` table's creation logic isn't ours to write defensively, since it lives inside
a third-party dependency jar.

**Why we didn't just add a guard to the library's changelog.** We can't edit a file inside a jar. We tried
shadowing it — placing a local copy of the exact same classpath-relative path
(`src/main/resources/db/migration/lib-jobs/changes/001-create-jobs-table.json`) with a `preConditions` guard
added, hoping our module's own classes would take precedence over the dependency jar's copy of the same
path. Liquibase 4.29.2 does not allow this: it explicitly detects multiple resources found at the same path
across the effective classpath and refuses to proceed (`Found 2 files with the path '...'`, unless
`liquibase.duplicateFileMode=WARN` is set globally — which would silence this safety check for *every*
changelog path, not just this one, so we didn't use it).

**The fix.** `009-create-jobs-table.json` recreates the exact same table (matching `lib-jobs`'s own column
definitions) as a changeset owned by this repo, with the same `preConditions`/`MARK_RAN` guard as every other
changeset here. The `include` of the library's own changelog was removed. This was verified by simulating a
database with `users` and `jobs` tables pre-created (mimicking the pre-Liquibase production schema) and
confirming Liquibase now starts cleanly, and by confirming a fresh database still gets a fully working `JOBS`
table (verified via `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=validate"`
and by exercising the real job-tracking code path against it).

**Trade-off.** This repo no longer automatically picks up future `JOBS` schema changes shipped by `lib-jobs`
— bumping the dependency version won't be enough if the library ever changes that table; a matching manual
changeset will need to be added here too. This is the same trade-off proj-scaffold already made (it also
locally re-implements the `JOBS` table rather than `include`-ing the library's changelog) — it turns out
proj-scaffold's approach was the right call, and the recommendation in a prior draft of this document (that
proj-scaffold should switch to `include`-ing the library's changelog like proj-dining/proj-courses did) was
backwards. See the updated recommendation in [Alignment across repos](#alignment-across-repos): the real fix
belongs in `lib-jobs` itself.

**Recovering the already-failed production deploy.** No manual database surgery should be needed. Liquibase
only records a changeset in `DATABASECHANGELOG` once it completes successfully, so the failed `JOBS`
changeset from the first deploy attempt left no trace to clean up — redeploying with this fix will run
`009-create-jobs-table.json` for the first time, its precondition will detect the pre-existing `jobs` table,
and it will mark itself ran, same as every other changeset already did. If the deploy crashed hard enough
that `DATABASECHANGELOGLOCK` was left `LOCKED = TRUE`, see
[Inspecting migration state](#inspecting-migration-state) to clear it before redeploying.

## Incident: `value too long for type character varying(1048576)` on the JOBS log backfill

The lib-jobs v0.2.0 migration (see [issue #329](https://github.com/ucsb-cs156/proj-courses/issues/329)) failed
on its first production deploy attempt with:

```
liquibase.exception.DatabaseException: ERROR: value too long for type character varying(1048576)
[Failed SQL: (0) UPDATE JOBS SET LOG_BACKFILL = LOG WHERE LOG IS NOT NULL]
```

**Root cause.** `010-stage-jobs-log-backfill.json` added a `LOG_BACKFILL VARCHAR(1048576)` staging column and
copied `JOBS.LOG` into it, ahead of the `lib-jobs` library changeset that creates `JOB_LOGS` and drops
`JOBS.LOG`. Both that staging column and `JOB_LOGS.MESSAGE` (declared by the library's own bundled changeset)
assumed `JOBS.LOG` had a hard 1,048,576-character cap, matching its Liquibase-managed declared type. It never
did: the pre-Liquibase entity annotation was

```java
@Column(columnDefinition="TEXT", length=1048576)
private String log;
```

`columnDefinition` wins over `length` here — Hibernate created the real Postgres column as an unbounded
`TEXT`, with `length=1048576` only ever enforced as validation metadata, never as an actual database
constraint. Production had accumulated at least one job log longer than 1,048,576 characters, so the copy
into the `VARCHAR(1048576)` staging column failed. This is the same category of issue as the
[`JOBS` table incident](#incident-relation-jobs-already-exists-on-first-production-deploy) above: a table that
pre-dates Liquibase doesn't necessarily match what a new migration assumes about it.

Reproduced directly against a throwaway Postgres 16 container — creating `JOBS.LOG TEXT`, inserting a
1,048,577-character value, and running the exact `010` SQL reproduces the identical error message.

**The fix.** `LOG_BACKFILL` in `010-stage-jobs-log-backfill.json` is now `TEXT` instead of
`VARCHAR(1048576)`, matching the real production column type — this staging column is never mapped by any
JPA entity and is dropped again before Hibernate's schema validation ever runs, so this part of the fix needs
no special handling. `011-complete-jobs-log-backfill.json` gained a new, Postgres-only changeset
(`011-widen-job-logs-message-postgresql`, using the `dbms` filter, the same pattern proj-scaffold already uses
for its own H2/Postgres divergence) that widens `JOB_LOGS.MESSAGE` to `TEXT` before the existing INSERT
changeset runs, since that column has the identical `VARCHAR(1048576)` limitation and would otherwise fail the
same way one step later.

This one had to be Postgres-only: `JOB_LOGS.MESSAGE` **is** mapped by `lib-jobs`'s `JobLog` entity
(`@Column(columnDefinition = "TEXT")`), so unlike `LOG_BACKFILL` it's still there when Hibernate's
schema-validation check ([below](#ci-schema-validation)) runs. Widening it to a literal `TEXT` column on H2
made H2 report the column's JDBC type as `CLOB`, but Hibernate's validator expected `VARCHAR` for this exact
`columnDefinition` string on this dialect (apparently the original `VARCHAR(1048576)` only ever happened to
satisfy that expectation by coincidence of what Liquibase's `VARCHAR(1048576)` maps to on H2, not because
anyone had verified the entity and column type truly agree) — so H2/dev/test keeps the original
`VARCHAR(1048576)` for `MESSAGE` unchanged, which is harmless there since test data never approaches the real
production length problem.

Verified against a throwaway Postgres 16 container that the full fixed sequence (stage as `TEXT` → widen
`MESSAGE` to `TEXT` → insert → drop staging column) completes with no truncation, using the same
1,048,577-character value that broke the original, and verified the full unit test suite (438 tests) plus the
Hibernate `ddl-auto=validate` check both still pass against H2 with `MESSAGE` left untouched there.

**Since production's deploy failed and rolled back** (Postgres DDL is transactional, and Liquibase runs each
changeset in its own transaction), `010` and `011` never completed there, so — unlike the general rule in
[Adding a new migration](#adding-a-new-migration) — editing these two changesets in place was safe for
production specifically, rather than writing a new changeset to fix forward. Anyone who already pulled `main`
after the original (broken) migration was merged and started the app locally against a persistent H2 database
may see a checksum mismatch on these two changesets; per
[Troubleshooting](#troubleshooting), deleting `target/db-development.mv.db` clears it. If QA or any other
shared Postgres environment already ran the original `010`/`011` successfully before this fix, it will need
the same checksum-mismatch recovery.

## CI schema validation

A GitHub Actions workflow, `.github/workflows/18-validate-db-schema.yml`, calls a reusable workflow from
[ucsb-cs156/workflows](https://github.com/ucsb-cs156/workflows) on every PR and push to `main` that touches
`src/**`, `pom.xml`, or `lombok.config`. It:

1. Boots the app with `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=validate"`
   — overriding `ddl-auto` from `none` to `validate` just for this run, against the `development` H2 profile
   (which is file-based and runs in `MODE=PostgreSQL`, see `application-development.properties`).
2. In `validate` mode, Hibernate never touches the schema — Liquibase creates it as usual on startup — but
   Hibernate *does* compare its own entity metadata against the resulting tables/columns, and refuses to
   finish starting up if anything doesn't match (extra/missing/mistyped columns, wrong table names, etc.).
3. Polls `http://localhost:8080` for up to 150 seconds; if the app never comes up (because Hibernate's
   validation step threw and killed startup), the job fails with a message pointing at the mismatch.

This is the automated check that closes the gap called out in [Adding a new migration](#adding-a-new-migration)
below — it's what actually enforces that entity classes and Liquibase changesets stay in sync, since the
Liquibase-only unit test suite never asks Hibernate to validate its mappings against the schema (tests run
with `ddl-auto=none`, same as everywhere else).

This workflow (and this analysis) exists in the other repos too — see
[Alignment across repos](#alignment-across-repos) for which of the five have it, and which branch of
`ucsb-cs156/workflows` they each point to. proj-courses adopts it here, pinned to `@main`.

This check is not theoretical: while preparing this PR, running it locally caught a real mismatch — the
`005-create-ucsbapiquarter-table.json` changeset originally named three columns `pass1_begin`, `pass2_begin`,
`pass3_begin` (guessing that Hibernate's naming strategy would insert an underscore before every uppercase
letter), but Hibernate's `CamelCaseToUnderscoresNamingStrategy` only inserts an underscore at a
lowercase-to-uppercase boundary, not a digit-to-uppercase one — so `pass1Begin` actually maps to the column
`pass1begin` (no underscore). `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=validate"`
failed immediately with `SchemaManagementException: Schema-validation: missing column [pass1begin] in table
[ucsbapiquarter]`, which is exactly the kind of drift this workflow exists to catch before it reaches
production. The changeset was corrected before merging.

## Adding a new migration

1. Add a new file to `src/main/resources/db/migration/changes/`, named `NNN-short-kebab-case-description.json`,
   where `NNN` is the next available 3-digit number (check the highest existing prefix first).
2. Give the changeset a `preConditions` guard so that re-running migrations against a database that already
   has the change (for example, an environment that was schema-managed by Hibernate before this migration was
   written) doesn't fail — it just gets marked as already applied:

   ```json
   {
     "databaseChangeLog": [
       {
         "changeSet": {
           "id": "009-add-foo-to-bar",
           "author": "your-username",
           "preConditions": [
             { "onFail": "MARK_RAN" },
             { "not": { "columnExists": { "tableName": "bar", "columnName": "foo" } } }
           ],
           "changes": [
             { "addColumn": { "tableName": "bar", "columns": [
               { "column": { "name": "foo", "type": "VARCHAR(255)" } }
             ] } }
           ]
         }
       }
     ]
   }
   ```

   Use `tableExists`/`columnExists`/`not` preconditions appropriate to the change (`createTable` →
   `not: tableExists`, `addColumn` → `not: columnExists`, etc.).
3. **Never edit an already-applied changeset.** Liquibase stores a checksum of every changeset it has run
   (in the `DATABASECHANGELOG` table); editing a file that has already run against any environment (including
   a teammate's localhost H2 database) causes a checksum-mismatch error on next startup. If you need to
   correct a mistake, write a new changeset that fixes it forward.
4. Keep the entity class and the changeset in sync by hand. There is no diff/generation tool wired up in this
   repo (see the alignment notes below) — after changing a `@Entity` class, write the corresponding Liquibase
   changeset in the same PR. The [CI schema validation](#ci-schema-validation) workflow will fail the PR if
   the two drift out of sync; you can also run the same check locally before pushing:

   ```shell
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=validate"
   ```

## Column naming

Table and column names follow Hibernate's default physical naming strategy: the JPA entity name (from
`@Entity(name = "...")`) becomes the table name, and camelCase field names become `snake_case` column names
(e.g. `googleSub` → `google_sub`). This has to match exactly, or Hibernate will throw a
"table/column not found" error at startup — the test suite will catch this immediately since it creates a
fresh schema via Liquibase on every run.

## Inspecting migration state

Liquibase tracks what has been applied in two tables it creates automatically:

* `DATABASECHANGELOG` — one row per changeset that has run, with its checksum and timestamp.
* `DATABASECHANGELOGLOCK` — a single-row lock table used to prevent two instances from migrating
  concurrently. If an app crashes mid-migration, this lock can be left `LOCKED = TRUE`; restarting cleanly
  usually clears it, but it can be cleared manually with:

  ```sql
  UPDATE DATABASECHANGELOGLOCK SET LOCKED = FALSE, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1;
  ```

On localhost, both tables are visible in the [H2 Console](h2-database.md).

## Troubleshooting

* **`ValidationFailedException` / checksum mismatch** — you (or someone else) edited a changeset file that
  has already run against this database. Revert the edit and write a new changeset instead, or, for a purely
  local H2 database, delete `target/db-development.mv.db` to start from scratch.
* **`Table "X" already exists`** — a changeset is missing its `preConditions` guard, or the guard doesn't
  match what the changeset actually does. Add/fix the `not: tableExists` (or `columnExists`) precondition.
* **Stuck lock (`DATABASECHANGELOGLOCK`)** — see [Inspecting migration state](#inspecting-migration-state)
  above.

## Alignment across repos

As part of [issue #315](https://github.com/ucsb-cs156/proj-courses/issues/315), the Liquibase setups in the
four sibling repos that already had one — [proj-frontiers](https://github.com/ucsb-cs156/proj-frontiers),
[proj-happycows](https://github.com/ucsb-cs156/proj-happycows),
[proj-dining](https://github.com/ucsb-cs156/proj-dining), and
[proj-scaffold](https://github.com/ucsb-cs156/proj-scaffold) — were surveyed to design a consistent setup for
proj-courses. All five repos are Spring Boot 3.4.3 / Java 21 / Maven projects.

### What's identical across all five

* Changelog path/name: `src/main/resources/db/migration/changelog-master.json`.
* Changelog format: JSON.
* Master changelog uses `includeAll` on `db/migration/changes/` (no manually maintained list of files).
* `spring.jpa.hibernate.ddl-auto=none` plus `spring.liquibase.change-log=db/migration/changelog-master.json`.
* Dev/test profiles use H2; production uses Postgres via `JDBC_DATABASE_URL`/`USERNAME`/`PASSWORD`
  (Dokku/Heroku-style env vars).
* No repo runs a `diffChangeLog`/hibernate-diff command as part of its build — changesets are all
  written or reviewed by hand, regardless of how they were first drafted.

### Where they differ

| | frontiers | happycows | dining | scaffold | courses (this repo) |
|---|---|---|---|---|---|
| Liquibase dependency | `liquibase-maven-plugin` (misplaced as a plain `<dependency>`) | same as frontiers | same as frontiers | `liquibase-core` (idiomatic) | `liquibase-core` |
| Changeset naming | `000-kebab-case.json` | `000_UNDERSCORE.json` (duplicate `002` prefix) | entity-name based, no numeric order (`Users-01.json`) | `NNN-kebab-case.json` | `NNN-kebab-case.json` |
| `preConditions` (`MARK_RAN`) adoption | 0 of 18 files | 3 of 5 files | 7 of 7 files | 39 of 41 files | 8 of 8 files |
| `lib-jobs` schema | n/a (doesn't use lib-jobs) | n/a | includes the library's own changelog (unguarded — see incident below) | re-implements the jobs table locally, with a guard | re-implements the jobs table locally, with a guard (see incident below) |
| Dedicated docs | none (only generic `h2-database.md`) | none | none | README section | this file |
| CI schema-validation workflow (`18-validate-db-schema.yml`) | present, pinned to `@Division7-patch-1` | present, pinned to `@main` | absent | present, pinned to `@Division7-patch-1` | present, pinned to `@main` (added in this PR) |
| Stray leftover file | none | inert `V4__Add_admin_to_users.sql` (Flyway-style, unused) | same stray file as happycows | none | had the same stray file; **removed** as part of this PR |

Two of the four already-existing repos (frontiers, scaffold) pin the reusable workflow to a non-default
branch of `ucsb-cs156/workflows`, `Division7-patch-1`, rather than `main`. Diffing that branch against `main`
in the `workflows` repo shows the two versions of `18-validate-db-schema.yml` are functionally almost
identical (same `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=validate"`
+ curl-polling logic) — `Division7-patch-1` adds an unused `WEBHOOK_SECRET` input, while `main` adds a
configurable `TIMEOUT` input (default 10 minutes) in its place. Neither difference matters much in practice,
but three repos each independently pinning to a different ref of the same shared workflow (`main`,
`Division7-patch-1` ×2) is itself the kind of drift this alignment effort is meant to reduce — courses adopts
`@main` here since it's the actively-maintained default branch.

### Recommendations to bring the five repos into better alignment

1. **Replace `liquibase-maven-plugin` with `liquibase-core`** in frontiers, happycows, and dining. The
   `liquibase-maven-plugin` dependency is not actually invoked as a Maven plugin in any of the three repos —
   it's only there to put `liquibase-core` on the classpath, which `liquibase-core` does directly and is the
   idiomatic Spring Boot way to enable auto-configured migrations.
2. **Standardize changeset naming** to `NNN-kebab-case-description.json` (3-digit, zero-padded) everywhere.
   Fix happycows' duplicate `002` prefix and underscore style, and rename dining's entity-based files
   (`Users-01.json`, `Admin.json`, etc.) to numeric order so that `includeAll`'s filesystem ordering is
   guaranteed to match the intended dependency order.
3. **Require `preConditions`/`MARK_RAN` on every new changeset.** Retrofit frontiers (currently 0 of 18) and
   finish happycows (currently 3 of 5). This is what makes it safe to run the same migration set against an
   environment that might have been partially schema-managed by Hibernate in the past.
4. **Add the `18-validate-db-schema.yml` CI workflow to dining** (the only one of the five without it), and
   repoint frontiers'/scaffold's pin from `@Division7-patch-1` to `@main` (matching happycows/courses), so all
   repos validate against the same version of the shared `ucsb-cs156/workflows` logic.
5. **Remove the dead `V4__Add_admin_to_users.sql` files** from happycows and dining — this Flyway-style file
   sits outside `db/migration/changes/`, so Liquibase's `includeAll` never picks it up; it's inert dead weight
   left over from an earlier migration approach (courses had the same file, removed in this PR).
6. **Add a `preConditions`/`MARK_RAN` guard to the changeset bundled inside the `lib-jobs` library itself**
   (`db/migration/lib-jobs/changes/001-create-jobs-table.json`), and cut a new release. This is the real fix
   for the [incident](#incident-relation-jobs-already-exists-on-first-production-deploy) proj-courses hit:
   `include`-ing that changelog (as proj-dining still does, and as proj-courses originally did) will fail with
   `relation "jobs" already exists` on any consuming repo's production database where the `JOBS` table
   pre-dates that repo's adoption of Liquibase — which is likely true for proj-dining's production database
   too, since it migrated to `lib-jobs` the same way proj-courses did. Until `lib-jobs` ships a guarded
   changeset, proj-dining should consider switching to a locally-owned, guarded changeset for the `JOBS`
   table, the same way proj-courses and proj-scaffold both do now (see the incident writeup above) — the
   earlier recommendation in a prior draft of this document, that proj-scaffold switch *to* the `include`
   approach, was backwards and is withdrawn.
7. **Port a documentation page based on this one (or scaffold's README section)** into frontiers, happycows,
   and dining, so every repo explains its own migration conventions rather than leaving new contributors to
   infer them from scaffold or courses.

### Copy/paste text for per-repo alignment issues

The text below is intended to be copy/pasted into one issue per repo (substituting the repo name where
noted), to track the alignment work recommended above.

<details>
<summary><strong>Issue text for proj-frontiers</strong></summary>

```markdown
Title: Align Liquibase setup with proj-courses/proj-scaffold conventions

As part of a cross-repo survey in ucsb-cs156/proj-courses#315, we compared how Liquibase is set up across
proj-frontiers, proj-happycows, proj-dining, proj-scaffold, and proj-courses. A few inconsistencies were
found that this issue tracks fixing here in proj-frontiers:

- [ ] Replace the `org.liquibase:liquibase-maven-plugin` dependency in `pom.xml` with
      `org.liquibase:liquibase-core` (no explicit version — let the Spring Boot BOM manage it). The
      maven-plugin artifact is currently only pulling `liquibase-core` onto the classpath; it isn't invoked
      as an actual Maven plugin goal anywhere, so `liquibase-core` is the more direct and idiomatic
      dependency.
- [ ] Add `preConditions` (`onFail: MARK_RAN` + a `not: tableExists`/`columnExists` guard) to all existing
      changesets in `src/main/resources/db/migration/changes/` (currently 0 of 18 files have one), and
      require it on all new changesets going forward. This makes it safe to re-run the full migration set
      against a database that may have been partially schema-managed some other way.
- [ ] Re-point the `18-validate-db-schema.yml` workflow's reference to `ucsb-cs156/workflows` from
      `@Division7-patch-1` to `@main`, to match proj-happycows/proj-courses.
- [ ] Add a `docs/liquibase.md` (or a README section) documenting this repo's migration conventions, modeled
      after `docs/liquibase.md` in proj-courses or the README section in proj-scaffold.
```

</details>

<details>
<summary><strong>Issue text for proj-happycows</strong></summary>

```markdown
Title: Align Liquibase setup with proj-courses/proj-scaffold conventions

As part of a cross-repo survey in ucsb-cs156/proj-courses#315, we compared how Liquibase is set up across
proj-frontiers, proj-happycows, proj-dining, proj-scaffold, and proj-courses. A few inconsistencies were
found that this issue tracks fixing here in proj-happycows:

- [ ] Replace the `org.liquibase:liquibase-maven-plugin` dependency in `pom.xml` with
      `org.liquibase:liquibase-core` (no explicit version), matching proj-scaffold/proj-courses.
- [ ] Standardize changeset file naming in `src/main/resources/db/migration/changes/` to
      `NNN-kebab-case-description.json` (3-digit, zero-padded). Currently this repo uses
      `000_BASE_CHANGELOG.json`-style underscore naming, and has a duplicate `002` prefix
      (`002_add_dashboard_sections_to_commons.json` and `002_require_last_date_on_commons.json`) that should
      be renumbered.
- [ ] Add `preConditions` (`onFail: MARK_RAN` + a `not: tableExists`/`columnExists` guard) to the remaining
      changesets that don't have one yet (currently 3 of 5 files have it).
- [ ] Remove the dead `src/main/resources/db/migration/V4__Add_admin_to_users.sql` file. It's a Flyway-style
      file sitting outside `db/migration/changes/`, so Liquibase's `includeAll` never picks it up — it's
      inert leftover weight from an earlier migration approach.
- [ ] Add a `docs/liquibase.md` (or a README section) documenting this repo's migration conventions, modeled
      after `docs/liquibase.md` in proj-courses or the README section in proj-scaffold. (This repo's
      `18-validate-db-schema.yml` is already pinned to `@main`, so no change needed there.)
```

</details>

<details>
<summary><strong>Issue text for proj-dining</strong></summary>

```markdown
Title: Align Liquibase setup with proj-courses/proj-scaffold conventions

As part of a cross-repo survey in ucsb-cs156/proj-courses#315, we compared how Liquibase is set up across
proj-frontiers, proj-happycows, proj-dining, proj-scaffold, and proj-courses. A few inconsistencies were
found that this issue tracks fixing here in proj-dining:

- [ ] Replace the `org.liquibase:liquibase-maven-plugin` dependency in `pom.xml` with
      `org.liquibase:liquibase-core` (no explicit version), matching proj-scaffold/proj-courses.
- [ ] Standardize changeset file naming in `src/main/resources/db/migration/changes/` to
      `NNN-kebab-case-description.json` (3-digit, zero-padded). This repo currently names changesets after
      entities (`Admin.json`, `Users-01.json`, `Users-02-moderator-add.json`, ...) with no consistent numeric
      order, so `includeAll`'s filesystem ordering isn't guaranteed to match the intended dependency order —
      it happens to work today but is fragile.
- [ ] Remove the dead `src/main/resources/db/migration/V4__Add_admin_to_users.sql` file. It's a Flyway-style
      file sitting outside `db/migration/changes/`, so Liquibase's `includeAll` never picks it up — it's
      inert leftover weight from an earlier migration approach.
- [ ] Add the `18-validate-db-schema.yml` CI workflow (present in frontiers/happycows/scaffold/courses,
      pinned to `ucsb-cs156/workflows@main` or `@Division7-patch-1`), which this repo is currently missing
      entirely. Pin it to `@main`.
- [ ] Add a `docs/liquibase.md` (or a README section) documenting this repo's migration conventions, modeled
      after `docs/liquibase.md` in proj-courses or the README section in proj-scaffold.
- [ ] **Check whether this repo's production database already had a `jobs` table before Liquibase was
      introduced here** (e.g. created by a prior `spring.jpa.hibernate.ddl-auto=update`/`create` setup). If
      so, this repo is at risk of the exact failure proj-courses hit on its first production deploy of
      Liquibase (`relation "jobs" already exists`) — see
      `docs/liquibase.md#incident-relation-jobs-already-exists-on-first-production-deploy` in proj-courses for
      the full writeup. The root cause is that `db/migration/lib-jobs/changelog-master.json` (which this repo
      currently `include`s directly) has no `preConditions` guard on its `createTable` changeset. Until
      `lib-jobs` ships a guarded version (see the companion issue against `ucsb-cs156/lib-jobs`), consider
      switching to a locally-owned, guarded changeset for the `JOBS` table instead, the same way proj-courses
      and proj-scaffold both do.
```

</details>

<details>
<summary><strong>Issue text for proj-scaffold</strong></summary>

```markdown
Title: Align Liquibase setup with proj-courses/proj-happycows conventions

As part of a cross-repo survey in ucsb-cs156/proj-courses#315, we compared how Liquibase is set up across
proj-frontiers, proj-happycows, proj-dining, proj-scaffold, and proj-courses. One inconsistency was found
that this issue tracks fixing here in proj-scaffold:

- [ ] Re-point the `18-validate-db-schema.yml` workflow's reference to `ucsb-cs156/workflows` from
      `@Division7-patch-1` to `@main`, to match proj-happycows/proj-courses.
- [ ] Re-enable (or remove, if intentionally retired) the disabled `42-smoke-test.yml.SAVE` workflow, or
      document why it's disabled.

Note: an earlier draft of this survey recommended switching this repo's locally-owned `JOBS` table migration
(`039-migrate-jobs-to-lib-jobs.json`) to `include` the changelog packaged inside the `lib-jobs` jar instead,
to match proj-dining/proj-courses. That recommendation is withdrawn — proj-courses hit a production incident
(`relation "jobs" already exists`) caused by doing exactly that, because the library's bundled changeset has
no `preConditions` guard. proj-scaffold's local-changeset-with-a-guard approach was the correct call; no
change needed here.
```

</details>

<details>
<summary><strong>Issue text for ucsb-cs156/lib-jobs</strong></summary>

```markdown
Title: Add a preConditions guard to the bundled JOBS table changeset

`db/migration/lib-jobs/changes/001-create-jobs-table.json` (included via
`db/migration/lib-jobs/changelog-master.json`) unconditionally runs `createTable` for the `JOBS` table, with
no `preConditions` guard. Every consuming repo's own changesets follow the convention of guarding
`createTable` with:

    "preConditions": [
      { "onFail": "MARK_RAN" },
      { "not": { "tableExists": { "tableName": "JOBS" } } }
    ]

so that re-running migrations against a database that already has the table (for example, any app that
adopted `lib-jobs` after already having a Hibernate/`ddl-auto`-managed `JOBS`-equivalent table) is a no-op
instead of a hard failure. Without that guard, any consuming repo that `include`s this changelog directly
(proj-dining does; proj-courses did until it hit this exact issue in production — see
[ucsb-cs156/proj-courses#316](https://github.com/ucsb-cs156/proj-courses/pull/316) and
`docs/liquibase.md` there for the full incident writeup) will fail with `relation "jobs" already exists` the
first time it runs against a database where the table pre-dates Liquibase.

Please add the guard and cut a new release. Once available, proj-dining (and any other consumer relying on
the `include`) can upgrade to it without needing a local workaround changeset.
```

</details>

<details>
<summary><strong>Issue text for proj-courses (this repo) — follow-up work not included in this PR</strong></summary>

```markdown
Title: Follow-up Liquibase alignment items from issue #315

A few smaller items identified during the Liquibase survey in #315 were left out of the initial PR and are
tracked here:

- [ ] Consider adding a `src/test/resources/application.properties` that forces H2 into
      `MODE=PostgreSQL` for all test runs (as proj-scaffold does), for stronger Postgres-compatibility
      guarantees in tests. Note: this requires re-declaring every property that the default (profile-less)
      `application.properties` currently supplies, since Spring Boot's `classpath:/application.properties`
      resolution only loads the *first* match on the classpath, and `target/test-classes` precedes
      `target/classes` — a naive version of this file will silently shadow unrelated app properties (this bit
      us during the initial implementation; see the PR discussion for #315).
- [ ] Once `ucsb-cs156/lib-jobs` ships a `preConditions`-guarded version of its `JOBS` table changeset,
      revisit whether `009-create-jobs-table.json` should go back to `include`-ing the library's changelog
      instead of maintaining a locally-owned copy (see
      `docs/liquibase.md#incident-relation-jobs-already-exists-on-first-production-deploy`).
```

</details>
