const jobsFixtures = {
    oneCompleteJob:  {
        "id": 1,
        "createdAt": "2022-11-13T19:49:58.097465-08:00",
        "updatedAt": "2022-11-13T19:49:59.203879-08:00",
        "status": "complete",
        "log": "Hello World! from test job!\nGoodbye from test job!"
      },
    oneRunningJob:  {
        "id": 6,
        "createdAt": "2022-11-13T19:50:37.252253-08:00",
        "updatedAt": "2022-11-13T19:50:37.258798-08:00",
        "status": "running",
        "log": "Hello World! from test job!"
      },
    oneErroredJob:  {
        "id": 5,
        "createdAt": "2022-11-13T19:50:34.097377-08:00",
        "updatedAt": "2022-11-13T19:50:39.122652-08:00",
        "status": "error",
        "log": "Hello World! from test job!\nFail!"
      },
    sixJobs: [
      {
        "id": 1,
        "createdAt": "2022-11-13T19:49:58.097465-08:00",
        "updatedAt": "2022-11-13T19:49:59.203879-08:00",
        "status": "complete",
        "log": "Hello World! from test job!\nGoodbye from test job!"
      },
      {
        "id": 2,
        "createdAt": "2022-11-13T19:50:00.349036-08:00",
        "updatedAt": "2022-11-13T19:50:01.387745-08:00",
        "status": "complete",
        "log": "Hello World! from test job!\nGoodbye from test job!"
      },
      {
        "id": 3,
        "createdAt": "2022-11-13T19:50:16.810569-08:00",
        "updatedAt": "2022-11-13T19:50:17.844532-08:00",
        "status": "complete",
        "log": "Hello World! from test job!\nGoodbye from test job!"
      },
      {
        "id": 4,
        "createdAt": "2022-11-13T19:50:17.770892-08:00",
        "updatedAt": "2022-11-13T19:50:18.798021-08:00",
        "status": "complete",
        "log": "Hello World! from test job!\nGoodbye from test job!"
      },
      {
        "id": 6,
        "createdAt": "2022-11-13T19:50:37.252253-08:00",
        "updatedAt": "2022-11-13T19:50:37.258798-08:00",
        "status": "running",
        "log": "Hello World! from test job!"
      },
      {
        "id": 5,
        "createdAt": "2022-11-13T19:50:34.097377-08:00",
        "updatedAt": "2022-11-13T19:50:39.122652-08:00",
        "status": "error",
        "log": "Hello World! from test job!\nFail!"
      }
    ],
    testJobFailFalseSleepMs1000: {
      "fail": false,
      "sleepMs": 1000
    },
    testJobFailTrueSleepMs1000: {
      "fail": false,
      "sleepMs": 1000
    },
};

export default jobsFixtures;