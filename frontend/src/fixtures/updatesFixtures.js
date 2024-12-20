const updatesFixtures = {
  oneUpdate: {
    _id: {
      timestamp: 1731206250,
      date: "2024-11-10T02:37:30.000+00:00",
    },
    subjectArea: "GRAD W",
    quarter: "20244",
    saved: 0,
    updated: 0,
    errors: 0,
    lastUpdate: "2024-11-10T02:37:30.677",
  },
  threeUpdates: [
    {
      _id: {
        timestamp: 1731206250,
        date: "2024-11-10T02:37:30.000+00:00",
      },
      subjectArea: "GRAD W",
      quarter: "20244",
      saved: 0,
      updated: 0,
      errors: 0,
      lastUpdate: "2024-11-10T02:37:30.677",
    },

    {
      _id: {
        timestamp: 1731206250,
        date: "2024-11-10T02:37:30.000+00:00",
      },
      subjectArea: "IQB",
      quarter: "20244",
      saved: 11,
      updated: 36,
      errors: 0,
      lastUpdate: "2024-11-10T02:37:30.467",
    },

    {
      _id: {
        timestamp: 1731206246,
        date: "2024-11-10T02:37:26.000+00:00",
      },
      subjectArea: "W&L  CSW",
      quarter: "20244",
      saved: 0,
      updated: 0,
      errors: 0,
      lastUpdate: "2024-11-10T02:37:26.354",
    },
  ],
  emptyUpdatesPage: {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      sort: {
        empty: false,
        unsorted: false,
        sorted: true,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    first: true,
    size: 5,
    number: 0,
    sort: {
      empty: false,
      unsorted: false,
      sorted: true,
    },
    numberOfElements: 0,
    empty: true,
  },
  threeUpdatesPage: {
    content: [
      {
        _id: {
          timestamp: 1734656205,
          date: "2024-12-20T00:56:45.000+00:00",
        },
        subjectArea: "CMPSC",
        quarter: "20251",
        saved: 196,
        updated: 0,
        errors: 0,
        lastUpdate: "2024-12-19T16:56:45.722",
      },
      {
        _id: {
          timestamp: 1734656208,
          date: "2024-12-20T00:56:48.000+00:00",
        },
        subjectArea: "CMPSC",
        quarter: "20244",
        saved: 238,
        updated: 0,
        errors: 0,
        lastUpdate: "2024-12-19T16:56:48.743",
      },
      {
        _id: {
          timestamp: 1734656211,
          date: "2024-12-20T00:56:51.000+00:00",
        },
        subjectArea: "CMPSC",
        quarter: "20243",
        saved: 66,
        updated: 0,
        errors: 0,
        lastUpdate: "2024-12-19T16:56:51.712",
      },
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      sort: {
        empty: false,
        unsorted: false,
        sorted: true,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalElements: 3,
    totalPages: 1,
    first: true,
    size: 5,
    number: 0,
    sort: {
      empty: false,
      unsorted: false,
      sorted: true,
    },
    numberOfElements: 3,
    empty: false,
  },
};

export { updatesFixtures };
