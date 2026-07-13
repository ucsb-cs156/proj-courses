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
    └── 008-create-enrollmentdatapoint-table.json
```

The master changelog uses Liquibase's `includeAll` directive to pick up every file in `db/migration/changes/`
in filename order, which is why every changeset file is numbered:

```json
{
  "databaseChangeLog": [
    { "includeAll": { "path": "db/migration/changes/" } },
    { "include": { "file": "db/migration/lib-jobs/changelog-master.json" } }
  ]
}
```

The second entry pulls in the changelog bundled *inside* the `lib-jobs` jar (the shared async-jobs library
this app depends on — see [proj-courses#314](https://github.com/ucsb-cs156/proj-courses/pull/314)), which
creates the `JOBS` table. This means the jobs table schema is owned and versioned by `lib-jobs` itself, not
duplicated here; when `lib-jobs` ships a schema change, bumping the dependency version in `pom.xml` is
enough to pick it up. This mirrors how proj-dining includes the same library changelog.

Changesets are plain JSON (not XML or YAML) to match the format already used by the other four sibling repos.

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
4. Keep the entity class and the changeset in sync by hand. There is currently no automated diff/generation
   step in this repo (see the alignment notes below) — after changing a `@Entity` class, write the
   corresponding Liquibase changeset in the same PR, and let the test suite (which runs migrations against a
   real, freshly-created H2 database on every run) catch any mismatch.

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
| `lib-jobs` schema | n/a (doesn't use lib-jobs) | n/a | includes the library's own changelog | re-implements the jobs table locally | includes the library's own changelog (same approach as dining) |
| Dedicated docs | none (only generic `h2-database.md`) | none | none | README section | this file |
| CI schema-validation workflow (`18-validate-db-schema.yml`) | present, pinned to `@Division7-patch-1` | present, pinned to `@Division7-patch-1` | absent | present, pinned to `@main` | not yet added (see below) |
| Stray leftover file | none | inert `V4__Add_admin_to_users.sql` (Flyway-style, unused) | same stray file as happycows | none | had the same stray file; **removed** as part of this PR |

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
4. **Add the `18-validate-db-schema.yml` CI workflow to dining**, and repoint frontiers'/happycows' pin from
   `@Division7-patch-1` to `@main` (matching scaffold), so all repos validate against the same version of the
   shared `ucsb-cs156/workflows` logic.
5. **Remove the dead `V4__Add_admin_to_users.sql` files** from happycows and dining — this Flyway-style file
   sits outside `db/migration/changes/`, so Liquibase's `includeAll` never picks it up; it's inert dead weight
   left over from an earlier migration approach (courses had the same file, removed in this PR).
6. **Standardize the `lib-jobs` changelog-inclusion strategy.** dining and courses `include` the changelog
   packaged inside the `lib-jobs` jar; scaffold instead re-implements the same `JOBS` table as a local
   changeset. The `include`-the-library's-changelog approach (dining/courses) is recommended, since it keeps
   the jobs table schema owned by the one place it's actually defined — scaffold should switch to it and
   drop its local re-implementation.
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
      `@Division7-patch-1` to `@main`, to match proj-scaffold.
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
- [ ] Re-point the `18-validate-db-schema.yml` workflow's reference to `ucsb-cs156/workflows` from
      `@Division7-patch-1` to `@main`, to match proj-scaffold.
- [ ] Add a `docs/liquibase.md` (or a README section) documenting this repo's migration conventions, modeled
      after `docs/liquibase.md` in proj-courses or the README section in proj-scaffold.
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
- [ ] Add the `18-validate-db-schema.yml` CI workflow (present in frontiers/happycows/scaffold, pinned to
      `ucsb-cs156/workflows@main`), which this repo is currently missing entirely.
- [ ] Add a `docs/liquibase.md` (or a README section) documenting this repo's migration conventions, modeled
      after `docs/liquibase.md` in proj-courses or the README section in proj-scaffold.
```

</details>

<details>
<summary><strong>Issue text for proj-scaffold</strong></summary>

```markdown
Title: Align Liquibase setup with proj-courses/proj-dining conventions

As part of a cross-repo survey in ucsb-cs156/proj-courses#315, we compared how Liquibase is set up across
proj-frontiers, proj-happycows, proj-dining, proj-scaffold, and proj-courses. One inconsistency was found
that this issue tracks fixing here in proj-scaffold:

- [ ] Switch the `JOBS` table migration to `include` the changelog packaged inside the `lib-jobs` jar
      (`db/migration/lib-jobs/changelog-master.json`), the same way proj-dining and proj-courses do, instead
      of re-implementing the table locally in `039-migrate-jobs-to-lib-jobs.json`. This keeps the jobs table
      schema owned by the one place it's actually defined (the `lib-jobs` library itself), so a future schema
      change in the library doesn't require a matching hand-written migration in every consuming repo.
- [ ] Re-enable (or remove, if intentionally retired) the disabled `42-smoke-test.yml.SAVE` workflow, or
      document why it's disabled.
```

</details>

<details>
<summary><strong>Issue text for proj-courses (this repo) — follow-up work not included in this PR</strong></summary>

```markdown
Title: Follow-up Liquibase alignment items from issue #315

A few smaller items identified during the Liquibase survey in #315 were left out of the initial PR and are
tracked here:

- [ ] Add the `18-validate-db-schema.yml` CI workflow (pinned to `ucsb-cs156/workflows@main`), matching
      frontiers/happycows/scaffold, so schema/entity drift is caught in CI here too.
- [ ] Consider adding a `src/test/resources/application.properties` that forces H2 into
      `MODE=PostgreSQL` for all test runs (as proj-scaffold does), for stronger Postgres-compatibility
      guarantees in tests. Note: this requires re-declaring every property that the default (profile-less)
      `application.properties` currently supplies, since Spring Boot's `classpath:/application.properties`
      resolution only loads the *first* match on the classpath, and `target/test-classes` precedes
      `target/classes` — a naive version of this file will silently shadow unrelated app properties (this bit
      us during the initial implementation; see the PR discussion for #315).
```

</details>
