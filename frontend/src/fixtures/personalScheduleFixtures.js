const personalScheduleFixtures = {
  onePersonalSchedule: [
    {
      id: 1,
      user: {
        id: 1,
        email: "phtcon@ucsb.edu",
        googleSub: "115856948234298493496",
        pictureUrl:
          "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
        fullName: "Phill Conrad",
        givenName: "Phill",
        familyName: "Conrad",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: true,
      },
      description: "My Plan for Winter",
      quarter: "20221",
      name: "Winter Courses",
    },
  ],
  onePersonalScheduleDiffId: 
    {
      id: 17,
      user: {
        id: 1,
        email: "phtcon@ucsb.edu",
        googleSub: "115856948234298493496",
        pictureUrl:
          "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
        fullName: "Phill Conrad",
        givenName: "Phill",
        familyName: "Conrad",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: true,
      },
      description: "My Winter Courses",
      quarter: "20221",
      name: "CS156",
    },

  threePersonalSchedules: [
    {
      id: 1,
      user: {
        id: 1,
        email: "phtcon@ucsb.edu",
        googleSub: "115856948234298493496",
        pictureUrl:
          "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
        fullName: "Phill Conrad",
        givenName: "Phill",
        familyName: "Conrad",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: true,
      },
      description: "My Plan for Winter",
      quarter: "20221",
      name: "Winter Courses",
    },
    {
      id: 2,
      user: {
        id: 1,
        email: "phtcon@ucsb.edu",
        googleSub: "115856948234298493496",
        pictureUrl:
          "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
        fullName: "Phill Conrad",
        givenName: "Phill",
        familyName: "Conrad",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: true,
      },
      description: "My Plan for Spring",
      quarter: "20222",
      name: "Spring Courses",
    },
    {
      id: 3,
      user: {
        id: 1,
        email: "phtcon@ucsb.edu",
        googleSub: "115856948234298493496",
        pictureUrl:
          "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
        fullName: "Phill Conrad",
        givenName: "Phill",
        familyName: "Conrad",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: true,
      },
      description: "My Plan for Fall",
      quarter: "20224",
      name: "Fall Courses",
    },
  ],
  threePersonalSchedulesDiffId: [
    {
      quarter: "20221",
      courseId: "ECE       1A ",
      title: "COMP ENGR SEMINAR",
      description:
        "Introductory seminar to expose students to a broad range of topics in computer   engineering.",
      classSections: [
        {
          enrollCode: "12583",
          section: "0100",
          session: null,
          classClosed: null,
          courseCancelled: null,
          gradingOptionCode: null,
          enrolledTotal: 84,
          maxEnroll: 100,
          secondaryStatus: null,
          departmentApprovalRequired: false,
          instructorApprovalRequired: false,
          restrictionLevel: null,
          restrictionMajor: "+PRCME+CMPEN",
          restrictionMajorPass: null,
          restrictionMinor: null,
          restrictionMinorPass: null,
          concurrentCourses: [],
          timeLocations: [
            {
              room: "1930",
              building: "BUCHN",
              roomCapacity: "100",
              days: "M      ",
              beginTime: "15:00",
              endTime: "15:50",
            },
          ],
          instructors: [
            {
              instructor: "WANG L C",
              functionCode: "Teaching and in charge",
            },
          ],
        },
      ],
      generalEducation: [],
      finalExam: null,
    },
  ]
};

export { personalScheduleFixtures };
