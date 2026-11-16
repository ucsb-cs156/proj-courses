# Scripts

## getAllBuildings.py
Returns a sorted list of all buildings where courses were held in a specific quarter.
1. Get the login information of a Database Access User to your MongoDB database.
2. Replace the placeholder username and password in lines 6-7.
3. Optional: Choose a different quarter in line 26 using the YYYYQ format. Currently returns all course buildings in W22.
4. Run the script.


# rate_tester.py

Can be used to test the rate limiting functions of the app.  

To use:
1. Create a venv with `python3 -m venv env`
2. Set up the venv with `source ./venv/bin/activate`
3. Install aiohttp with: `pip install aiohttp`
4. Run the script, passing in a url and a count, e.g.
   ```
   python rate_tester.py https://courses-dev-cgaucho.dokku-04.cs.ucsb.edu 1000
   ```

The script will then send up to 1000 packets, until all have been sent, or until a 429 message is returned.

It will then print information about the results.  For example:

```
(venv) pconrad@csilvm-14:~/ratelimit$ python rate_tester.py https://courses-qa4.dokku-00.cs.ucsb.edu/api/currentQuarter 1000
--- Results ---
Total Requests Attempted: 209
Successful (Non-429):    208
Hit 429 Rate Limit:      True
Elapsed Time:            2.2701 seconds
Requests Per Second:     91.63
(venv) pconrad@csilvm-14:~/ratelimit$
(venv) pconrad@csilvm-14:~/ratelimit$ python rate_tester.py https://courses-qa4.dokku-00.cs.ucsb.edu/api/currentQuarter 1000
--- Results ---
Total Requests Attempted: 1
Successful (Non-429):    0
Hit 429 Rate Limit:      True
Elapsed Time:            2.2233 seconds
Requests Per Second:     0.00
(venv) pconrad@csilvm-14:~/ratelimit$
```

This should result in a record being shown on the /admin/ratelimiting page, like this:

<img width="1004" height="483" alt="image" src="https://github.com/user-attachments/assets/0c5b7e57-7148-4d4a-a6e4-d657695f8725" />

# storybook_coverage.py

Reports which React components and pages under `frontend/src/main` do not have a
matching Storybook story under `frontend/src/stories`.  The frontend follows a
one-to-one mirroring convention, e.g.

```
frontend/src/main/components/Foo/Bar.jsx  ->  frontend/src/stories/components/Foo/Bar.stories.jsx
frontend/src/main/pages/Foo/BarPage.jsx   ->  frontend/src/stories/pages/Foo/BarPage.stories.jsx
```

Run it from the repo root (no dependencies beyond the Python standard library):

```
python3 scripts/storybook_coverage.py
```

It prints a Markdown report listing, for each directory pair, the components
that are missing a story (with the expected story path), plus any story files
that do not line up with a component of the same name (usually a naming
mismatch).

Useful options:

* `--fail-on-missing` (or env var `FAIL_ON_MISSING_STORIES=true`): exit with
  status 1 if any component lacks a story.
* `--include-js`: also treat plain `.js` files (normally helpers/utilities such
  as `OurTableUtils.js`) as components that need stories.
* `--dir MAIN:STORIES`: check an additional directory pair relative to
  `frontend/src`, e.g. `--dir main/layouts:stories/layouts`.

This script is run by the GitHub Actions workflow
`.github/workflows/37-frontend-storybook-coverage.yml`, which publishes the
report in the job summary of each run.  That workflow only reports by default;
set `FAIL_ON_MISSING_STORIES: "true"` in the workflow to make it fail when
coverage is below 100%.

Unit tests:

```
python3 -m unittest scripts/test_storybook_coverage.py
```
