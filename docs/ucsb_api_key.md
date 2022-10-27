# Obtaining a value for `UCSB_API_KEY`

A value for `UCSB_API_KEY` must be defined in `.env` on localhost, or as an Environment variable when deploying to a cloud hosting provider.

This value is used to access the UCSB Developer API (see documentation at <https://developer.ucsb.edu>.)

If you are a student in CMPSC 156, you can usually obtain a value from a member of course staff, who will set it up on your behalf

If you want to try to obtain one on your own, here are the steps:

1. Create an account at <https://developer.ucsb.edu>
2. Login to that account
3. Go to the `Apps` menu and click the `Add App` button:
   <img width="729" alt="image" src="https://user-images.githubusercontent.com/1119017/198413312-c6306409-2352-46e3-b2de-2499ce3e5224.png">
4. Fill in values.  Here, for example, are the values that Prof. Conrad filled in for the staff's production deployment for F22:
   <img width="1079" alt="image" src="https://user-images.githubusercontent.com/1119017/198413486-89f6f14e-4397-442f-8333-fc72d4fa9eb8.png">
5. Select access to the APIs shown.  Stick to "auto-approved" APIs.   Note that if you request other APIs, they may not be "pre-approved", and this will result in your request being delayed or rejected.
   <img width="1037" alt="image" src="https://user-images.githubusercontent.com/1119017/198413681-db7b868e-2125-4e18-ad66-ac1b72bda919.png">
6. After you click the `Add App` button at the bottom of that page, you'll see a new app has been created, and it looks like this (for example) in the list on the `Apps` page:
   <img width="940" alt="image" src="https://user-images.githubusercontent.com/1119017/198413873-96893741-4542-4ba4-82a6-2580f859af16.png">
7. Click the link for your new app, and you'll see a page like this one:
   <img width="872" alt="image" src="https://user-images.githubusercontent.com/1119017/198413964-be3d3474-aa0b-49ed-9ebc-f5eddab7be02.png">
8. On this page, click where is says `Show Key`, and copy the value of the `Consumer Key` (we do not need the `Consumer Secret`).
9. The value of `Consumer Key` is what you will use for `UCSB_API_KEY` in your `.env` file, and/or for the value of the Environment variable `UCSB_API_KEY` on your cloud provider.

# Follow Up Steps

## Loading Subjects 

After setting the `UCSB_API_KEY`, you'll need to log in as an Admin and do the `Load Subjects` function at least once.  This loads all of the subjects
the UCSB API into the database.

<img width="457" alt="image" src="https://user-images.githubusercontent.com/1119017/198414341-a4230ce6-a05c-4149-b91a-4aca76d2339e.png">

## Start and End Quarters

You may also want to override the default values for `START_QTR` and `END_QTR`.   

The default values are defined in `/src/main/resources/application.properties`, for example:

```
app.startQtrYYYYQ=${START_QTR:${env.START_QTR:20221}}
app.endQtrYYYYQ=${END_QTR:${env.END_QTR:20222}}
```

* `20221` represents Winter 2022
* `20222` represents Spring 2022.


   
