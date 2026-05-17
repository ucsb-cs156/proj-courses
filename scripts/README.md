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
3. Install aihttp with: `pip install aihttp`
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

