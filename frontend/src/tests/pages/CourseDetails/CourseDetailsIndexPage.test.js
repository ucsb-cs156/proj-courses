import { render, screen } from "@testing-library/react";
import { Query, QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
// import userEvent from "@testing-library/user-event";

import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { gradeDistFixtures } from "fixtures/courseGradeDistFixtures";

// eslint-disable-next-line no-unused-vars
const examplePersonalSectionRes = [
  {
    quarter: "20221",
    courseId: "CMPSC   130B ",
    title: "DATA STRUCT ALG II",
    contactHours: 30.0,
    description:
      "Design and analysis of computer algorithms. Correctness proofs and solution of recurrence relations. Design techniques; divide and conquer, greedy str ategies, dynamic programming. Applications of techniques to problems from s everal disciplines. NP - completeness.",
    college: "ENGR",
    objLevelCode: "U",
    subjectArea: "CMPSC   ",
    unitsFixed: 4.0,
    unitsVariableHigh: null,
    unitsVariableLow: null,
    delayedSectioning: null,
    inProgressCourse: null,
    gradingOption: "L",
    instructionType: "LEC",
    onLineCourse: false,
    deptCode: "CMPSC",
    generalEducation: [],
    classSections: [
      {
        enrollCode: "08169",
        section: "0100",
        session: null,
        classClosed: "Y",
        courseCancelled: null,
        gradingOptionCode: null,
        enrolledTotal: 106,
        maxEnroll: 100,
        secondaryStatus: "R",
        departmentApprovalRequired: false,
        instructorApprovalRequired: false,
        restrictionLevel: null,
        restrictionMajor: "+CPSCI+CMPSC+CMPEN",
        restrictionMajorPass: null,
        restrictionMinor: null,
        restrictionMinorPass: null,
        concurrentCourses: [],
        timeLocations: [
          {
            room: "1104",
            building: "HFH",
            roomCapacity: 188,
            days: " T R   ",
            beginTime: "11:00",
            endTime: "12:15",
          },
        ],
        instructors: [
          {
            instructor: "VIGODA E J",
            functionCode: "Teaching and in charge",
          },
        ],
      },
    ],
  },
];

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      qtr: "20221",
      enrollCode: "06619",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("Course Details Index Page tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/sections/sectionsearch", {
        params: { qtr: "20221", enrollCode: "06619" },
      })
      .reply(200, personalSectionsFixtures.singleSection);
    axiosMock
      .onGet("/api/gradehistory/search", {
        params: { subjectArea: "CHEM", courseNumber: "184" },
      })
      .reply(200, gradeDistFixtures.threeGradeDist);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Calls UCSB Section Search api correctly and displays correct information", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // await waitFor(() => {
    expect(
      screen.getByText("Course Details for CHEM 184 W22"),
    ).toBeInTheDocument();
    // });
    expect(screen.getByText("Enroll Code")).toBeInTheDocument();
    expect(screen.getByText("06619")).toBeInTheDocument();
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("0100")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("CHEM LITERATURE")).toBeInTheDocument();
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText("19/24")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("LIB 1312")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("T R")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("2:00 PM - 3:15 PM")).toBeInTheDocument();
  });

  test("Calls Course Grade Distribution api correctly and displays correct information", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText("Bob Test1")).toBeInTheDocument();
    expect(screen.getByText("A-")).toBeInTheDocument();
  });

  test("Displays no grade distribution correctly", async () => {
    const queryClient2 = new QueryClient();
    axiosMock
      .onGet("/api/gradehistory/search", {
        params: { subjectArea: "CHEM", courseNumber: "184" },
      })
      .reply(200, []);
    render(
      <QueryClientProvider client={queryClient2}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("No Course Grade Distribution Available"),
    ).toBeInTheDocument();
  });
});

// describe("Course Grade Distribution Tests", () => {
//   const axiosMock = new AxiosMockAdapter(axios);
//   beforeEach(() => {
//     jest.spyOn(console, "error");
//     console.error.mockImplementation(() => null);
//   });

//   beforeEach(() => {
//     axiosMock.reset();
//     axiosMock.resetHistory();
//     axiosMock
//       .onGet("/api/currentUser")
//       .reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock
//       .onGet("/api/systemInfo")
//       .reply(200, systemInfoFixtures.showingNeither);
//     axiosMock
//       .onGet("/api/sections/sectionsearch", {
//         params: { qtr: "20221", enrollCode: "06619" },
//       })
//       .reply(200, personalSectionsFixtures.singleSection);
//   });
//   test("Calls Course Grade Distribution api correctly and displays correct information", async () => {
//     const queryClient = new QueryClient();

//     axiosMock
//       .onGet("/api/gradehistory/search", {
//         params: { subjectArea: "CMPSC", courseNumber: "130B" },
//       })
//       .reply(200, gradeDistFixtures.threeGradeDist);
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <CourseDetailsIndexPage />
//         </MemoryRouter>
//       </QueryClientProvider>,
//     );
//     expect(screen.getByText("Bob Test1")).toBeInTheDocument();
//     expect(screen.getByText("A-")).toBeInTheDocument();
//     expect(screen.getByText("20232")).toBeInTheDocument();
//   });

//   test("Displays no grade distribution correctly", async () => {
//     const queryClient = new QueryClient();

//     axiosMock
//       .onGet("/api/gradehistory/search", {
//         params: { subjectArea: "CMPSC", courseNumber: "130B" },
//       })
//       .reply(200, []);
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <CourseDetailsIndexPage />
//         </MemoryRouter>
//       </QueryClientProvider>,
//     );
//     expect(
//       screen.getByText("No Course Grade Distribution Available"),
//     ).toBeInTheDocument();
//   });
// });
