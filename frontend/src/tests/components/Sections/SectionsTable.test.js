import { fireEvent, render, screen } from "@testing-library/react";
import {
  fiveSections,
  gigaSections,
  oneSection,
  oneLectureSectionWithNoDiscussion,
  threeSections,
} from "fixtures/sectionFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import SectionsTable from "main/components/Sections/SectionsTable";
import { objectToAxiosParams } from "main/components/Sections/SectionsTable";
import { handleAddToSchedule } from "main/components/Sections/SectionsTable";
import { handleLectureAddToSchedule } from "main/components/Sections/SectionsTable";
import {
  isLectureWithNoSections,
  isLectureWithSections,
} from "main/components/Sections/SectionsTable";
import { useBackendMutation } from "main/utils/useBackend";
import * as backend from "main/utils/useBackend";
import * as currentUserModule from "main/utils/currentUser";

import * as modalCode from "main/components/PersonalSchedules/AddToScheduleModal";

const mockedNavigate = jest.fn();

const colId = "12591";
const colId1 = "30395";
const colId2 = "54692";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("react-toastify", () => {
  const toast = jest.fn();
  toast.error = jest.fn();
  return { toast };
});
jest.mock("main/utils/useBackend", () => ({
  useBackend: jest.fn(),
  useBackendMutation: jest.fn(),
}));

describe("isLectureWithNoSections", () => {
  it("should return true when the section is a lecture with no other sections", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0100" },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(true);
  });

  it("should return false when the section is not a lecture", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0101" },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });

  it("should return false when the section is a lecture but there are other sections", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0100" },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "67890", section: "0101" },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });

  it("should return false when the section is not found", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1 -1" },
        section: { enrollCode: "67890", section: "0100" },
      },
      {
        courseInfo: { courseId: "COURSE1 -2" },
        section: { enrollCode: "67891", section: "0200" },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });
  it("should return true when the section number ends in 00 and is not 0100 and has a location", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1 -1" },
        section: {
          enrollCode: "12345",
          section: "22200",
          timeLocations: [
            {
              room: "3505",
              building: "PHELP",
              roomCapacity: "60",
              days: " T R   ",
              beginTime: "08:00",
              endTime: "09:15",
            },
          ],
        },
      },
      {
        courseInfo: { courseId: "COURSE1 -2" },
        section: {
          enrollCode: "12345",
          section: "22201",
          timeLocations: [
            {
              room: "3505",
              building: "PHELP",
              roomCapacity: "60",
              days: " T R   ",
              beginTime: "08:00",
              endTime: "09:15",
            },
          ],
        },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(true);
  });
  it("should return false when the section number ends in 00 and is not 0100 and does not have a location", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: {
          enrollCode: "12345",
          section: "0200",
        },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });
  it("should return false when the section number does not end in 00", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: {
          enrollCode: "12345",
          section: "0201",
          timeLocations: [
            {
              room: "3505",
              building: "PHELP",
              roomCapacity: "60",
              days: " T R   ",
              beginTime: "08:00",
              endTime: "09:15",
            },
          ],
        },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });
  it("should return false when the section number ends in 00 and is not 0100 and has a section", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: {
          enrollCode: "12345",
          section: "0200",
          timeLocations: [
            {
              room: "3505",
              building: "PHELP",
              roomCapacity: "60",
              days: " T R   ",
              beginTime: "08:00",
              endTime: "09:15",
            },
          ],
        },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: {
          enrollCode: "12346",
          section: "0201",
          timeLocations: [
            {
              room: "3505",
              building: "PHELP",
              roomCapacity: "60",
              days: " T R   ",
              beginTime: "08:00",
              endTime: "09:15",
            },
          ],
        },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });
  it("should return false when the section number ends in 00 and is not 0100 and has time locations not equal to one", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: {
          enrollCode: "12345",
          section: "0200",
          timeLocations: [],
        },
      },
    ];

    const result = isLectureWithNoSections(enrollCode, sections);

    expect(result).toBe(false);
  });
});

describe("isLectureWithSections", () => {
  it("should return false when the section is a lecture with no other sections", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0100" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);

    expect(result).toBe(false);
  });

  it("should return false when the section is not a lecture", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0101" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);

    expect(result).toBe(false);
  });

  it("should return true when the section is a lecture but there are other sections", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0100" },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "67890", section: "0101" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);

    expect(result).toBe(true);
  });

  it("should return false when the section is not found", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "67890", section: "0100" },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "67891", section: "0100" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);

    expect(result).toBe(false);
  });
  it("should return false when section number does not end with '00'", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0101" },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12346", section: "0102" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);
    expect(result).toBe(false);
  });
  it("should return true when section number ends with '00' and there are multiple sections", () => {
    const enrollCode = "12345";
    const sections = [
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "12345", section: "0100" },
      },
      {
        courseInfo: { courseId: "COURSE1" },
        section: { enrollCode: "67890", section: "0100" },
      },
    ];

    const result = isLectureWithSections(enrollCode, sections);
    expect(result).toBe(true);
  });
});

describe("handleAddToSchedule", () => {
  it("calls mutate with correct data", () => {
    const mockMutation = { mutate: jest.fn() };
    const mockSection = { section: { enrollCode: "123" } };
    const mockSchedule = "456";

    handleAddToSchedule(mockSection, mockSchedule, mockMutation);

    expect(mockMutation.mutate).toHaveBeenCalledWith({
      enrollCd: "123",
      psId: "456",
    });
  });
});

describe("handleLectureAddToSchedule", () => {
  it("should execute the mutation with the provided data", () => {
    // Mock the mutation object
    const mutationMock = {
      mutate: jest.fn(),
    };

    // Define the input data
    const section = 12345;
    const schedule = "FALL2023";

    // Call the function
    handleLectureAddToSchedule(section, schedule, mutationMock);

    // Assert that the mutation.mutate function was called with the expected data
    expect(mutationMock.mutate).toHaveBeenCalledWith({
      enrollCd: section,
      psId: schedule,
    });
  });
});

describe("objectToAxiosParams", () => {
  it("should return the correct axios parameters", () => {
    const data = {
      enrollCd: 12345,
      psId: 15,
    };

    const result = objectToAxiosParams(data);

    expect(result).toEqual({
      url: "/api/courses/post",
      method: "POST",
      params: {
        enrollCd: "12345",
        psId: "15",
      },
    });
  });
});

describe("Section tests", () => {
  const queryClient = new QueryClient();

  test("calls onSuccess when mutation is successful and calls toast with correct parameters", () => {
    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Call the onSuccess function
    const onSuccess = useBackendMutation.mock.calls[0][1].onSuccess;
    const mockResponse = [{ id: 1, enrollCd: "1234" }];
    onSuccess(mockResponse);

    // Verify that toast was called with the correct parameters
    expect(toast).toHaveBeenCalledWith(
      "New course Created - id: 1 enrollCd: 1234",
    );
  });

  test("calls onSuccess when mutation is successful for replacement and calls toasy with correct parameters", () => {
    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const onSuccess = useBackendMutation.mock.calls[0][1].onSuccess;
    const mockResponse = [
      { id: 1, enrollCd: "1234" },
      { id: 2, enrollCd: "5678" },
      { id: 3, enrollCd: "9012" },
    ];
    onSuccess(mockResponse);

    expect(toast).toHaveBeenCalledWith(
      "Course 1234 replaced old section 9012 with new section 5678",
    );
  });

  test("calls onError when mutation throws an error and calls toast with correct parameters", () => {
    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Call the onSuccess function
    const onError = useBackendMutation.mock.calls[0][1].onError;
    const mockResponse = {
      response: {
        data: {
          message: "class exists in schedule",
        },
      },
    };
    onError(mockResponse);

    // Verify that toast was called with the correct parameters
    expect(toast.error).toHaveBeenCalledWith("class exists in schedule");
  });

  test("when error is received from backend, toast message error is displayed correctly", () => {
    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const onError = useBackendMutation.mock.calls[0][1].onError;

    const mockError = {}; // No response or message
    onError(mockError);

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
  });

  test("onError displays default message when error.response.data is undefined", () => {
    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const onError = useBackendMutation.mock.calls[0][1].onError;

    const mockError = {
      response: {
        data: undefined,
      },
    };

    onError(mockError);

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
  });

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected cell values when expanded", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
      "Info",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
      "info",
    ];
    const testId = "SectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Open");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-location`),
    ).toHaveTextContent("HFH 1124");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-instructor`),
    ).toHaveTextContent("YUNG A S");
  });

  test("Has the expected column headers and content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
      "Action",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
      "action",
    ];
    const testId = "SectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.courseId`),
    ).toHaveTextContent("ECE 1A");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.title`),
    ).toHaveTextContent("COMP ENGR SEMINAR");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Open");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-location`),
    ).toHaveTextContent("BUCHN 1930");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("WANG L C");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-section.enrollCode`),
    ).toHaveTextContent("12583");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-action`)).toBeDefined();
  });

  test("Correctly groups separate lectures of the same class", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={gigaSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-${colId1}-expand-symbols`),
    ).toHaveTextContent("➕");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-${colId2}-expand-symbols`),
    ).toHaveTextContent("➕");

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-${colId1}-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-${colId1}-expand-symbols`),
    ).toHaveTextContent("➖");
  });

  test("First dropdown is different than last dropdown", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-enrolled`),
    ).toHaveTextContent("84/80");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-enrolled`),
    ).toHaveTextContent("21/21");
  });

  test("Status utility identifies each type of status", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-status`),
    ).toHaveTextContent("Closed");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-status`),
    ).toHaveTextContent("Full");
    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-status`),
    ).toHaveTextContent("Cancelled");
    expect(
      screen.getByTestId(`${testId}-cell-row-4-col-status`),
    ).toHaveTextContent("Open");
  });

  test("Info link is correct", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen
        .getByTestId(`${testId}-cell-row-1-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12591"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-2-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12609"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-3-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12617"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-4-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12625"]'),
    ).toBeInTheDocument();
  });
  test("action column renders", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-${colId}-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen
        .getByTestId(`${testId}-cell-row-1-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12591"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-2-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12609"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-3-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12617"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-4-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12625"]'),
    ).toBeInTheDocument();
  });
});

describe("Action Column Tests", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.spyOn(backend, "useBackend").mockImplementation(() => ({
      data: [
        {
          id: 1,
          quarter: "20221", // This should match the quarter prop passed to the modal
          name: "Fall 2022 Personal Schedule",
          // Additional properties that might be used by your PersonalScheduleSelector or schedulesFilter
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
        },
      ],
      error: null,
      status: "success",
    }));
  });

  it("renders AddToScheduleModal for section rows when user is logged in", () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: true, root: null },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-action`),
    ).toHaveTextContent("➖");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-action`),
    ).toHaveTextContent("Add");

    const actionContainers = document.querySelectorAll(
      ".d-flex.align-items-center.gap-2",
    );
    expect(actionContainers.length).toBeGreaterThan(0);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-action`),
    ).toHaveTextContent("Add");
    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-action`),
    ).toHaveTextContent("Add");
    expect(
      screen.getByTestId(`${testId}-cell-row-4-col-action`),
    ).toHaveTextContent("Add");

    currentUserModule.useCurrentUser.mockClear();
  });

  it("does not render AddToScheduleModal for section rows when user is not logged in", () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: false, root: null },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-action`),
    ).toHaveTextContent("➖");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-action`),
    ).toHaveTextContent("");

    const actionContainers = document.querySelectorAll(
      ".d-flex.align-items-center.gap-2",
    );
    expect(actionContainers.length).toBeLessThanOrEqual(0);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-action`),
    ).toHaveTextContent("");

    expect(
      screen
        .getByTestId(`${testId}-cell-row-2-col-action`)
        .querySelector('[data-testid="empty-action-cell"]'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-action`),
    ).toHaveTextContent("");
    expect(
      screen
        .getByTestId(`${testId}-cell-row-3-col-action`)
        .querySelector('[data-testid="empty-action-cell"]'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${testId}-cell-row-4-col-action`),
    ).toHaveTextContent("");
    expect(
      screen
        .getByTestId(`${testId}-cell-row-4-col-action`)
        .querySelector('[data-testid="empty-action-cell"]'),
    ).toBeInTheDocument();

    currentUserModule.useCurrentUser.mockClear();
  });

  it("renders AddToScheduleModal for lecture with no sections", () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: true, root: null },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={oneLectureSectionWithNoDiscussion} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-action`),
    ).toHaveTextContent("Add");

    currentUserModule.useCurrentUser.mockClear();
  });

  it("handleAddToSchedule is called when Modal Add is clicked", async () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: true, root: null },
    }));

    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    jest
      .spyOn(modalCode, "default")
      .mockImplementation((propsReceivedByModal) => {
        // propsReceivedByModal contains { section, quarter, onAdd }
        return typeof propsReceivedByModal.section != "string" &&
          propsReceivedByModal.section.section.section === "0101" ? (
          <button
            data-testid="spy-trigger-sections-table-onadd"
            onClick={() => {
              // Simulate the modal eventually calling the onAdd prop it received
              if (typeof propsReceivedByModal.onAdd === "function") {
                propsReceivedByModal.onAdd(propsReceivedByModal.section, "1");
              }
            }}
          >
            Trigger SectionsTable onAdd via Spy
          </button>
        ) : (
          <div></div>
        );
      });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={threeSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    const spyTriggerButton = screen.getByTestId(
      "spy-trigger-sections-table-onadd",
    );
    expect(spyTriggerButton).toBeInTheDocument();

    fireEvent.click(spyTriggerButton); // This click will trigger propsReceivedByModal.onAdd

    // If the mutate function was called, it means handleAddToSchedule was called.
    expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
    expect(mockMutation.mutate).toHaveBeenCalledWith({
      enrollCd: "12609",
      psId: "1",
    });

    currentUserModule.useCurrentUser.mockClear();
    modalCode.default.mockClear();
  });

  it("handleLectureAddToSchedule is called when Modal Add is clicked", async () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: true, root: null },
    }));

    const mockMutate = jest.fn();
    const mockMutation = { mutate: mockMutate };

    useBackendMutation.mockReturnValue(mockMutation);

    jest
      .spyOn(modalCode, "default")
      .mockImplementation((propsReceivedByModal) => {
        // propsReceivedByModal contains { section, quarter, onAdd }
        return (
          <button
            data-testid="spy-trigger-sections-table-onadd"
            onClick={() => {
              // Simulate the modal eventually calling the onAdd prop it received
              if (typeof propsReceivedByModal.onAdd === "function") {
                propsReceivedByModal.onAdd(propsReceivedByModal.section, "1");
              }
            }}
          >
            Trigger SectionsTable onAdd via Spy
          </button>
        );
      });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={oneSection} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const spyTriggerButton = screen.getByTestId(
      "spy-trigger-sections-table-onadd",
    );
    expect(spyTriggerButton).toBeInTheDocument();

    fireEvent.click(spyTriggerButton); // This click will trigger propsReceivedByModal.onAdd

    // If the mutate function was called, it means handleLectureAddToSchedule was called.
    expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
    expect(mockMutation.mutate).toHaveBeenCalledWith({
      enrollCd: "12583",
      psId: "1",
    });

    currentUserModule.useCurrentUser.mockClear();
    modalCode.default.mockClear();
  });

  it("Aggregated Action Cell is empty when !isLectureWithSections is true and isLectureWithNoSections is false", () => {
    jest.spyOn(currentUserModule, "useCurrentUser").mockImplementation(() => ({
      data: { loggedIn: true, root: null },
    }));

    jest.spyOn(modalCode, "default").mockImplementation(() => {
      return (
        <div data-testid="mock-modal-should-not-appear">Modal Appeared</div>
      );
    });

    // this should return false for both isLectureWithSections and isLectureWithNoSections
    const fixtureForGrouping = [fiveSections[2], fiveSections[3]];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fixtureForGrouping} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";
    const actionCell = screen.getByTestId(`${testId}-cell-row-0-col-action`);
    expect(actionCell).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-0-col-action`)
        .querySelector('[data-testid="empty-action-cell"]'),
    ).toBeInTheDocument();

    // Also, ensure our spied AddToScheduleModal was not rendered by this path
    expect(
      screen.queryByTestId("mock-modal-should-not-appear"),
    ).not.toBeInTheDocument();

    currentUserModule.useCurrentUser.mockClear();
    modalCode.default.mockClear();
  });
});
