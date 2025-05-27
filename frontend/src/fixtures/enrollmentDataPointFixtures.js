export const oneEnrollmentDataPoint = [
  {
    enrollmentDataPoint: {
      id: 1,

      yyyyq: "20252", // Quarter
      enrollCd: "07252",
      courseId: "CMPSC     5A -1", // redundant but useful for querying since enrollCd is in Mongo
      section: "0100", // redundant but useful for querying since enrollCd is in Mongo
      enrollment: 125,

      dateCreated: "2025-05-14T17:50:52.356611",
    },
  },
];

export const threeEnrollmentDataPoints = [
  {
    enrollmentDataPoint1: {
      id: 1,

      yyyyq: "20252", // Quarter
      enrollCd: "07252",
      courseId: "CMPSC     5A -1", // redundant but useful for querying since enrollCd is in Mongo
      section: "0100", // redundant but useful for querying since enrollCd is in Mongo
      enrollment: 125,

      dateCreated: "2025-05-14T17:50:52.356611",
    },
    enrollmentDataPoint2: {
      id: 2,

      yyyyq: "20252", // Quarter
      enrollCd: "07260",
      courseId: "CMPSC     5A -1", // redundant but useful for querying since enrollCd is in Mongo
      section: "0101", // redundant but useful for querying since enrollCd is in Mongo
      enrollment: 24,

      dateCreated: "2025-05-14T17:50:52.361636",
    },
    enrollmentDataPoint3: {
      id: 3,

      yyyyq: "20252", // Quarter
      enrollCd: "07278",
      courseId: "CMPSC     5A -1", // redundant but useful for querying since enrollCd is in Mongo
      section: "0102", // redundant but useful for querying since enrollCd is in Mongo
      enrollment: 26,

      dateCreated: "2025-05-14T17:50:52.364172",
    },
  },
];
