const rateLimitedIPFixtures = {
  oneIP: {
    ipAddress: "192.168.1.1",
    requestCount: 5,
    lastRequestAt: "2025-01-01T00:00:00.000000+00:00",
  },
  threeIPs: [
    {
      ipAddress: "192.168.1.1",
      requestCount: 5,
      lastRequestAt: "2025-01-01T00:00:00.000000+00:00",
    },
    {
      ipAddress: "10.0.0.1",
      requestCount: 12,
      lastRequestAt: "2025-01-02T12:00:00.000000+00:00",
    },
    {
      ipAddress: "172.16.0.5",
      requestCount: 1,
      lastRequestAt: "2025-01-03T06:30:00.000000+00:00",
    },
  ],
  threeIPsPage: {
    content: [
      {
        ipAddress: "192.168.1.1",
        requestCount: 5,
        lastRequestAt: "2025-01-01T00:00:00.000000+00:00",
      },
      {
        ipAddress: "10.0.0.1",
        requestCount: 12,
        lastRequestAt: "2025-01-02T12:00:00.000000+00:00",
      },
      {
        ipAddress: "172.16.0.5",
        requestCount: 1,
        lastRequestAt: "2025-01-03T06:30:00.000000+00:00",
      },
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalElements: 3,
    totalPages: 1,
    last: true,
    first: true,
    size: 10,
    number: 0,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    numberOfElements: 3,
    empty: false,
  },
};

export default rateLimitedIPFixtures;
