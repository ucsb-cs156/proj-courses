# OAuth Setup

This Spring Boot application is set up to use Google OAuth as its authentication scheme.

If this is your first time setting up a Google OAuth application in this course, you may need to do three steps.
Later in the course, you'll only need to do the last of these, three, since the first two are typically "one-time" only steps.

1. One time only: Set up a project in the Google Developer Console: 
   - <https://ucsb-cs156.github.io/topics/oauth/google_create_developer_project.html>
2. One time only: Set up an OAuth Consent Screen for your project: 
   - <https://ucsb-cs156.github.io/topics/oauth/google_oauth_consent_screen.html>
3. Once for each application: Create a set of OAuth credentials (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` values): 
   - <https://ucsb-cs156.github.io/topics/oauth/oauth_google_setup.html>

Once you have created the OAuth Credentials, you'll need to
configure your application with these values.

* For `localhost`, those values go in the `.env` file (as explained below)
* For Dokku, those values are set using `dokku config:set ...` (as explained below)


# About the `.env` and `.env.SAMPLE` files.

* The `.env` file is created by copying it from `.env.SAMPLE` and then editing it, e.g.
  
  ```
  cp .env.SAMPLE .env
  ```
* Recall that `.env` and `.env.SAMPLE` will not show up in regular directory listings; files starting with `.` are considered
  hidden files.  Use `ls -a`, or configure your Mac finder/Windows explorer to show hidden files.
* As explained below, put your client-id and client-secret into `.env`, NOT in `.env.SAMPLE` 
* `.env` is never committed to the GitHub repo
* There is more information about `.env` vs. `.env.SAMPLE` on this page if you are interested: [docs/environment-variables](environment-variables.md).


## Step 1: Set up `.env` values for `localhost`

In the frontend directory, use this command to copy `.env.SAMPLE` to `.env`.  Recall that you
may need to use `ls -a` to get the files to show up, since they are hidden files on Unix-like systems.

```
cp .env.SAMPLE .env
```

The file `.env.SAMPLE` **should not be edited;** it is intended to
be a template for creating a file called `.env` that contains
your repository secrets.

The `.env` is in the `.gitignore` because **a file containing secrets should NOT be committed to GitHub, not even in a private repo.

After copying, the file `.env` looks like this:

```
GOOGLE_CLIENT_ID=see-instructions
GOOGLE_CLIENT_SECRET=see-instructions
ADMIN_EMAILS=phtcon@ucsb.edu
```

Replace `see-instructions` with the appropriate values.

# Setting up `ADMIN_EMAILS`

The `ADMIN_EMAILS` value is used to determine which users have access to administrative features in the app.  One of those
is the ability to list the users that have logged in.

For `ADMIN_EMAILS`, add your own email and any teammates you are collaborating with after phtcon.ucsb.edu; you can separate multiple emails with commas, e.g.

```
`ADMIN_EMAILS=phtcon@ucsb.edu,cgaucho@ucsb.edu,ldelplaya@ucsb.edu`
```

*Do not separate emails with spaces*; only commas:
* ❌ WRONG: `ADMIN_EMAILS=phtcon@ucsb.edu, cgaucho@ucsb.edu, ldelplaya@ucsb.edu`
* ✅ Correct: `ADMIN_EMAILS=phtcon@ucsb.edu,cgaucho@ucsb.edu,ldelplaya@ucsb.edu`

* Add your own UCSB email address
* Add `phtcon@ucsb.edu` (your instructor)
* Add the mentor for your team (look up the mentor's name on the course team listing, then ask them in your channel)
* Add everyone else on your team

I suggest that, as a team, you collaborate in your team slack channel on getting a standard list of these, and then
that you pin that post in your team slack channel for easy reference.

With this done, you should be all set to run on localhost.


## Step 2: Copying `.env` values to Dokku

There are two ways to set up your `.env` values on Dokku.

* One variable at a time (recommended if this is your first time doing this)
* All at once with a file 

## Step 2a: Copying `.env` values to Dokku one at a time

To copy the values to Dokku one at a time, do this
for each line in the `.env` file:

On the dokku server command line, type:<br />

<tt>dokku config:set --no-restart <b></i>app-name VARIABLE=VALUE</i></b></tt>, where

* <b></i>app-name</i></b> is your app name such as `jpa03-cgaucho`.  It needs to match what you see when you type `dokku apps:list`
* <b></i>VARIABLE=VALUE</i></b> is one of the lines in your .env. file

Note that on Dokku, you also typically need to set this
value (this typically does *not* go in your .env)

<tt>dokku config:set --no-restart <b></i>app-name</i></b> PRODUCTION=true</tt>


## Step 2b: Copying `.env` values to Dokku all at once

The idea of this step is to copy/paste the values
from from your `.env` file into a file in your Dokku account
and then load the values all at once.

You could use file transfer, but because of various firewall settings, it may be easier to just copy/paste like this:


1. On the system where you are doing development, 
   use `cat .env` to list out the contents, e.g.

   ```
   pconrad@Phillips-MacBook-Air STARTER-jpa03 % cat .env
   GOOGLE_CLIENT_ID=26622685272-ofq4729s9nt8loednuuv5c0opja1vaeb.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-fakeCredentials99_fakefake-_fake
   ADMIN_EMAILS=phtcon@ucsb.edu

   JDBC_DATABASE_URL=jdbc:postgresql://example.org:5432/starter_jpa03_db
   JDBC_DATABASE_USERNAME=postgres
   JDBC_DATABASE_PASSWORD=password
   pconrad@Phillips-MacBook-Air STARTER-jpa03 % 
   ```

2. At the shell prompt on your dokku server (e.g. dokku-07.cs.ucsb.edu), type this, where `jpa03-cgaucho` is the name of your
app:

   ```
   cat > jpa03-gaucho.env
   ```

   Then, copy paste the contents of the `.env` file into the window, followed by hitting enter, and then Control-D.

   If you then do an `ls` you should see that you have
   a file called `jpa03-gaucho.env` containing the values
   you want to set.

3. Now type the following (assuming that `jpa03-cgaucho` is
   your Dokku app name).

   ```
   dokku config:set --no-restart jpa03-cgaucho `cat jpa03-gaucho.env`
   ```

   In this command, the part in backticks (<tt>\`cat jpa03-gaucho.env\`</tt>) specfies that the output of that command should be placed on the command line.

   Accordingly, this sets all of the environment variables at once.

   Note that on Dokku, you also typically need to set this
   value (this typically does *not* go in your .env)

   <tt>dokku config:set --no-restart <b></i>app-name</i></b> PRODUCTION=true</tt>

   Your next step is likely to configure the application
   for using the Postgres database; instructions for that
   can be found here:

   * <https://ucsb-cs156.github.io/topics/dokku/postgres_database.html>

   If you want to restart the application you can either
   * Leave off the `--no-restart` part, or
   * Type `dokku ps:restart jpa03-cgaucho` as the next command
   
For troubleshooting advice with OAuth, this page may help:

* <https://ucsb-cs156.github.io/topics/oauth/oauth_troubleshooting.html>
