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

```
# Create app
dokku apps:create courses

# Create and link postgres database
dokku postgres:create courses-db
dokku postgres:link courses-db courses

# Create and link mongodb database
dokku mongodb:create courses-m-db
dokku mongodb:link courses-m-db courses

# Modify dokku settings
dokku git:set courses keep-git-dir true

# Set config vars
dokku config:set --no-restart courses PRODUCTION=true
dokku config:set --no-restart courses GOOGLE_CLIENT_ID=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses GOOGLE_CLIENT_SECRET=get-value-from-google-developer-console # modify this
dokku config:set --no-restart courses UCSB_API_KEY=get-from-developer.ucsb.edu  # modify this
dokku config:set --no-restart courses START_QTR=20244  # modify this
dokku config:set --no-restart courses END_QTR=20254    # modify this
dokku config:set --no-restart courses SOURCE_REPO=https://ucsb-cs156-s25/proj-courses-s25-xx # modify this to your repo

# git sync for first deploy (http)
dokku git:sync courses https://ucsb-cs156-s25/proj-courses-s25-xx main  # modify this to your repo
dokku ps:rebuild

# Enable https
dokku letsencrypt:set courses email yourEmail@ucsb.edu # modify email
dokku letsencrypt:enable courses
```
