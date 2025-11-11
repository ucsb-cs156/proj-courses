# docs/dokku.md

This page is not intended as full documentation of dokku setup; for that, please see: 

* <https://ucsb-cs156.github.io/topics/dokku/>

Instead, this is a quick guide to setting up a `proj-courses` 
instance on dokku that assumes you are already familiar with the basic operation of dokku, and just need a "cheat sheet" to 
get up and running quickly.

Throughout, we use `courses` as the appname.  Substitute any other appropriate name, e.g. `courses-qa`, `courses-dev-cgaucho`, `courses-pr235` as needed.

The lines in the instructions where you need to modify something are marked with the comment: `# modify this`

* For the values of `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` see [docs/oauth.md](https://github.com/ucsb-cs156/proj-courses/blob/main/docs/oauth.md)
* For the value of `UCSB_API_KEY` see: [UCSB Developer API overview](https://ucsb-cs156.github.io/topics/apis/apis_ucsb_developer_api.html)
* For the values of `START_QTR` and `END_QTR` use whatever values you choose (first four digits are year, last digit is 1=Winter, 2=Spring, 3=Summer, 4=Fall), however make sure that
  `START_QTR <= END_QTR`, and that `END_QTR` is a quarter for which data is available, which you can check quickly [here](https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx)
* Set `SOURCE_REPO` to be the url of your teams' repo (i.e. replace the team name in the example below) 

The other line you can copy/paste as is, except for changing `courses` to whatever your app name will be (e.g. `courses-qa`, `courses-dev-cgaucho`, `courses-pr235`).

### Create `courses`

```
# Create app
dokku apps:create courses

# Create and link postgres database
dokku postgres:create courses-db
dokku postgres:link courses-db courses --no-restart

# Create and link mongodb database
dokku mongo:create courses-m-db
dokku mongo:link courses-m-db courses --no-restart

# Modify dokku settings
dokku git:set courses keep-git-dir true

# Set config vars
dokku config:set --no-restart courses PRODUCTION=true
dokku config:set --no-restart courses GOOGLE_CLIENT_ID=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses GOOGLE_CLIENT_SECRET=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses UCSB_API_KEY=get-from-developer.ucsb.edu  # modify this
dokku config:set --no-restart courses START_QTR=20244  # modify this
dokku config:set --no-restart courses END_QTR=20261    # modify this

# Set SOURCE_REPO to your repo (modify the url)
# This is for the link in the footer, and for the link to currently deployed branch in /api/systemInfo
dokku config:set --no-restart courses SOURCE_REPO=https://github.com/ucsb-cs156-f25/proj-courses-f25-xx 

# Set ADMIN_EMAILS to staff emails and team emails
dokku config:set --no-restart courses ADMIN_EMAILS=list-of-admin-emails # modify this

# git sync for first deploy (http)
dokku git:sync courses https://github.com/ucsb-cs156-f25/proj-courses-f25-xx main  # modify this 
dokku ps:rebuild courses

# Enable https
dokku letsencrypt:set courses email yourEmail@ucsb.edu # modify email
dokku letsencrypt:enable courses
```


### Create `courses-qa`

```
# Create app
dokku apps:create courses-qa

# Create and link postgres database
dokku postgres:create courses-qa-db
dokku postgres:link courses-qa-db courses-qa --no-restart

# Create and link mongodb database
dokku mongo:create courses-qa-m-db
dokku mongo:link courses-qa-m-db courses-qa --no-restart

# Modify dokku settings
dokku git:set courses-qa keep-git-dir true

# Set config vars
dokku config:set --no-restart courses-qa PRODUCTION=true
dokku config:set --no-restart courses-qa GOOGLE_CLIENT_ID=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses-qa GOOGLE_CLIENT_SECRET=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses-qa UCSB_API_KEY=get-from-developer.ucsb.edu  # modify this
dokku config:set --no-restart courses-qa START_QTR=20244  # modify this
dokku config:set --no-restart courses-qa END_QTR=20261    # modify this

# Set SOURCE_REPO to your repo (modify the url)
# This is for the link in the footer, and for the link to currently deployed branch in /api/systemInfo
dokku config:set --no-restart courses-qa SOURCE_REPO=https://github.com/ucsb-cs156-f25/proj-courses-f25-xx 

# Set ADMIN_EMAILS to staff emails and team emails
dokku config:set --no-restart courses-qa ADMIN_EMAILS=list-of-admin-emails # modify this

# git sync for first deploy (http)
dokku git:sync courses-qa https://github.com/ucsb-cs156-f25/proj-courses-f25-xx main  # modify this 
dokku ps:rebuild courses-qa

# Enable https
dokku letsencrypt:set courses-qa email yourEmail@ucsb.edu # modify email
dokku letsencrypt:enable courses-qa
```
