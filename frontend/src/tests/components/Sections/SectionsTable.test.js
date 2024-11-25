import { fireEvent, render, screen } from "@testing-library/react";
import { fiveSections, gigaSections } from "fixtures/sectionFixtures";
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

const mockedNavigate = jest.fn();

const colId = "12591";
const colId1 = "30395";
const colId2 = "54692";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("main/utils/useBackend", () => ({
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

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("backend error message", () => {
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
    const error = {
      response: {
        data: {
          message:
            "A section from this class already exists in your schedule. Please remove it to add a new one.",
        },
      },
    };

    onError(error);

    expect(toast).toHaveBeenCalledWith(
      "Error: A section from this class already exists in your schedule. Please remove it to add a new one.",
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
