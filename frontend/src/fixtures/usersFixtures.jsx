const usersFixtures = {
  threeUsers: [
    {
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
    {
      id: 2,
      email: "pconrad.cis@gmail.com",
      googleSub: "102656447703889917227",
      pictureUrl:
        "https://lh3.googleusercontent.com/a-/AOh14GhpDBUt8eCEqiRT45hrFbcimsX_h1ONn0dc3HV8Bp8=s96-c",
      fullName: "Phillip Conrad",
      givenName: "Phillip",
      familyName: "Conrad",
      emailVerified: true,
      locale: "en",
      hostedDomain: null,
      admin: false,
    },
    {
      id: 3,
      email: "craig.zzyzx@example.org",
      googleSub: "123456789012345678901",
      pictureUrl:
        "https://lh3.googleusercontent.com/a-/AOh14GhpDBUt8eCEqiRT45hrFbcimsX_h1ONn0dc3HV8Bp8=s96-c",
      fullName: "Craig Zzyxx",
      givenName: "Craig",
      familyName: "Zzyxx",
      emailVerified: true,
      locale: "en",
      hostedDomain: null,
      admin: false,
    },
  ],
  thirtyUsers: Array.from({ length: 30 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      email: `user${id}@ucsb.edu`,
      googleSub: `${100000000000000000000 + id}`,
      pictureUrl: `https://lh3.googleusercontent.com/a-/AOh14GhpDBUt8eCEqiRT45hrFbcimsX_h1ONn0dc3HV8Bp8=s96-c`,
      fullName: `User ${id} Test`,
      givenName: `User${id}`,
      familyName: "Test",
      emailVerified: true,
      locale: "en",
      hostedDomain: "ucsb.edu",
      admin: id <= 3,
    };
  }),
  thirtyUsersPage: {
    content: Array.from({ length: 30 }, (_, index) => {
      const id = index + 1;
      return {
        id,
        email: `user${id}@ucsb.edu`,
        googleSub: `${100000000000000000000 + id}`,
        pictureUrl: `https://lh3.googleusercontent.com/a-/AOh14GhpDBUt8eCEqiRT45hrFbcimsX_h1ONn0dc3HV8Bp8=s96-c`,
        fullName: `User ${id} Test`,
        givenName: `User${id}`,
        familyName: "Test",
        emailVerified: true,
        locale: "en",
        hostedDomain: "ucsb.edu",
        admin: id <= 3,
      };
    }),
    totalPages: 3,
  },
};

export default usersFixtures;
