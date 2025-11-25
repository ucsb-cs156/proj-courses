import usersFixtures from "fixtures/usersFixtures";

const threeUsers = usersFixtures.threeUsers;

const threeUsersPaged = {
  content: threeUsers,
  pageable: { pageNumber: 0, pageSize: 5 },
  totalPages: 1,
  totalElements: threeUsers.length,
  last: true,
  first: true,
  size: 5,
  number: 0,
  numberOfElements: threeUsers.length,
};

const page0 = {
  content: [threeUsers[0]],
  pageable: { pageNumber: 0, pageSize: 5 },
  totalPages: 2,
  totalElements: threeUsers.length,
  last: false,
  first: true,
  size: 5,
  number: 0,
  numberOfElements: 1,
};

const page1 = {
  content: [threeUsers[1]],
  pageable: { pageNumber: 1, pageSize: 5 },
  totalPages: 2,
  totalElements: threeUsers.length,
  last: true,
  first: false,
  size: 5,
  number: 1,
  numberOfElements: 1,
};

const page0_size10 = {
  content: [threeUsers[0]],
  pageable: { pageNumber: 0, pageSize: 10 },
  totalPages: 1,
  totalElements: 1,
  last: true,
  first: true,
  size: 10,
  number: 0,
  numberOfElements: 1,
};

const page1_size10 = {
  content: [threeUsers[1]],
  pageable: { pageNumber: 1, pageSize: 10 },
  totalPages: 2,
  totalElements: 2,
  last: true,
  first: false,
  size: 10,
  number: 1,
  numberOfElements: 1,
};

const page0_size20 = {
  content: [threeUsers[0]],
  pageable: { pageNumber: 0, pageSize: 20 },
  totalPages: 3,
  totalElements: threeUsers.length,
  last: false,
  first: true,
  size: 20,
  number: 0,
  numberOfElements: 1,
};

const page1_size20 = {
  content: [threeUsers[1]],
  pageable: { pageNumber: 1, pageSize: 20 },
  totalPages: 3,
  totalElements: threeUsers.length,
  last: false,
  first: false,
  size: 20,
  number: 1,
  numberOfElements: 1,
};

const page2_size20 = {
  content: [threeUsers[2]],
  pageable: { pageNumber: 2, pageSize: 20 },
  totalPages: 3,
  totalElements: threeUsers.length,
  last: true,
  first: false,
  size: 20,
  number: 2,
  numberOfElements: 1,
};

// ============================================================================

export default {
  threeUsersPaged,
  page0,
  page1,

  page0_size10,
  page1_size10,

  page0_size20,
  page1_size20,
  page2_size20,
};
