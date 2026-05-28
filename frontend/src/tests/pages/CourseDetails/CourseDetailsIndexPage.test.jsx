import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { oneQuarterCourse } from "fixtures/gradeHistoryFixtures";
import { enrollmentDataPointFixtures } from "fixtures/enrollmentDataPointFixtures";

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
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

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Mock implementation of the observe method
  }
  unobserve() {
    // Mock implementation of the unobserve method
  }
  disconnect() {
    // Mock implementation of the disconnect method
  }
}

window.ResizeObserver = ResizeObserver;

vi.mock("recharts", async () => {
  const OriginalModule = await vi.importActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe("CourseDetailsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const enrollmentHistoryWithOtherSections =
    enrollmentDataPointFixtures.cmpsc130aMultipleSectionsOverTime.map(
      (dataPoint) =>
        dataPoint.enrollCd === "07609"
          ? { ...dataPoint, enrollCd: "06619" }
          : dataPoint,
    );
  let queryClient;
  let enrollmentHistoryResponse;

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    enrollmentHistoryResponse = enrollmentHistoryWithOtherSections;
    mockToast.mockClear();
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
      .onGet("/api/public/finalsInfo", {
        params: { quarterYYYYQ: "20221", enrollCd: "06619" },
      })
      .reply(200, null);
    axiosMock
      .onGet("/api/gradehistory/search", {
        params: { subjectArea: "", courseNumber: "" },
      })
      .reply(200, []);
    axiosMock
      .onGet("/api/gradehistory/search", {
        params: { subjectArea: "CHEM", courseNumber: "184" },
      })
      .reply(200, oneQuarterCourse);
    axiosMock
      .onGet("/api/enrollment/search", {
        params: {
          startQtr: "20221",
          endQtr: "20221",
          subjectArea: "CHEM",
          courseNumber: "184",
          enrollCd: "06619",
        },
      })
      .reply(() => [200, enrollmentHistoryResponse]);
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  test("renders without crashing", () => {
    renderPage();
  });

  test("Calls UCSB Section Search api correctly and displays correct information", async () => {
    renderPage();

    expect(
      await screen.findByText("Course Details for CHEM 184 W22"),
    ).toBeInTheDocument();

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

  test("Calls grade history api correctly and displays correct information", async () => {
    renderPage();

    expect(
      await screen.findByText("Fall 2009 - GONZALEZ T F"),
    ).toBeInTheDocument();
  });

  test("Calls enrollment history api correctly", async () => {
    renderPage();

    await waitFor(() => {
      expect(
        axiosMock.history.get.some(
          (request) => request.url === "/api/enrollment/search",
        ),
      ).toBe(true);
    });

    const enrollmentHistoryRequest = axiosMock.history.get.find(
      (request) => request.url === "/api/enrollment/search",
    );

    expect(enrollmentHistoryRequest.params).toEqual({
      startQtr: "20221",
      endQtr: "20221",
      subjectArea: "CHEM",
      courseNumber: "184",
      enrollCd: "06619",
    });
  });

  test("passes returned enrollment history data to the graph", async () => {
    renderPage();

    expect(await screen.findByText("06619 - Section 0100")).toBeInTheDocument();
  });

  test("filters enrollment history graph to the selected enroll code", async () => {
    renderPage();

    expect(await screen.findByText("06619 - Section 0100")).toBeInTheDocument();
    expect(screen.queryByText("07617 - Section 0101")).not.toBeInTheDocument();
    expect(screen.queryByText("07625 - Section 0102")).not.toBeInTheDocument();
  });

  test("renders the selected enrollment history line in blue", async () => {
    const { container } = renderPage();

    expect(await screen.findByText("06619 - Section 0100")).toBeInTheDocument();
    expect(container.querySelector(".recharts-line-curve")).toHaveAttribute(
      "stroke",
      "#0d6efd",
    );
  });

  test("renders enrollment history graph between course description and grade history", async () => {
    renderPage();

    const courseDescription = await screen.findByText("Course Description");
    const enrollmentHistoryGraph = await screen.findByTestId(
      "enrollment-history-graph",
    );
    const gradeHistoryGraphs = await screen.findByTestId(
      "grade-history-graphs",
    );

    expect(enrollmentHistoryGraph).toBeInTheDocument();
    expect(screen.getByText("Enrollment History")).toBeInTheDocument();
    expect(
      courseDescription.compareDocumentPosition(enrollmentHistoryGraph) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      enrollmentHistoryGraph.compareDocumentPosition(gradeHistoryGraphs) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
