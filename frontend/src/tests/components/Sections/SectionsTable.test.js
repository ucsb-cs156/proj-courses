import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";
import { objectToAxiosParams } from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { wait } from "@testing-library/user-event/dist/utils";

const mockedNavigate = jest.fn();

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

describe("SectionsTable tests", () => {

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
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
      jest.clearAllMocks();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/personalschedules/all")
        .reply(200, personalScheduleFixtures.threePersonalSchedules);
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
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
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
        "courseId",
        "title",
        "status",
        "enrolled",
        "location",
        "days",
        "time",
        "instructor",
        "enrollCode",
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

      const expandRow = screen.getByTestId(`${testId}-cell-row-1-col-expander`);
      fireEvent.click(expandRow);

      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
      ).toHaveTextContent("F24");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-time`),
      ).toHaveTextContent("8:00 AM - 8:50 AM");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-days`),
      ).toHaveTextContent("M");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toHaveTextContent("Open");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
      ).toHaveTextContent("172/175");
      expect(
        screen.getByTestId(`${testId}-cell-row-2-col-location`),
      ).toHaveTextContent("ILP 1101");
      expect(
        screen.getByTestId(`${testId}-cell-row-2-col-instructor`),
      ).toHaveTextContent("SU X");
    });

    test("Has the expected column headers and content", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
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
        "courseId",
        "title",
        "status",
        "enrolled",
        "location",
        "days",
        "time",
        "instructor",
        "enrollCode",
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
        screen.getByTestId(`${testId}-cell-row-0-col-courseId`),
      ).toHaveTextContent("MATH 2A");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-title`),
      ).toHaveTextContent("CALC W/ ALG & TRIG");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
      ).toHaveTextContent("F24");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-time`),
      ).toHaveTextContent("8:00 AM - 8:50 AM");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-days`),
      ).toHaveTextContent("M");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toHaveTextContent("Open");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
      ).toHaveTextContent("172/175");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-location`),
      ).toHaveTextContent("ILP 2101");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toHaveTextContent("PORTER M J");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrollCode`),
      ).toHaveTextContent("30247");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-action`),
      ).toBeDefined();
    });

    test("Info link is correct", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toHaveTextContent("PORTER M J");
      const expandButton = screen.getByTestId(`${testId}-row-0-expand-button`);

      expect(expandButton).toBeInTheDocument();
      expect(expandButton).toHaveTextContent("➕");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("➖")).toBeInTheDocument();
      });

      const infoLink = screen.getByTestId(`${testId}-row-1-col-info-link`);
      expect(infoLink).toBeInTheDocument();
      expect(infoLink.tagName).toBe("A");
      expect(infoLink).toHaveAttribute("href", "/coursedetails/20244/30312");
    });

    test("Expand all button works properly", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";
      expect(screen.queryByText("➖")).not.toBeInTheDocument();

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      expect(expandAllRows).toBeInTheDocument();
      expect(expandAllRows).toHaveTextContent("➕");
      fireEvent.click(expandAllRows);

      const expandAllRowsAfter = screen.getByTestId(
        `${testId}-expand-all-rows`,
      );
      expect(expandAllRowsAfter).toHaveTextContent("➖");
    });
  });
});
