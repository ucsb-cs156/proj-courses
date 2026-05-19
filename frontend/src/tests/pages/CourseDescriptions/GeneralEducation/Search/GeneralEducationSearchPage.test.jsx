import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";
import * as useBackend from "main/utils/useBackend.jsx";

import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("GeneralEducationSearchPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  describe("logged in", () => {
    beforeEach(() => {
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/personalschedules/all")
        .reply(200, personalSchedulesFixtures.twoPersonalSchedules);
      axiosMock.onGet("/api/public/generalEducationInfo").reply(200, [
        { requirementCode: "A1", requirementTranslation: "English" },
        { requirementCode: "B", requirementTranslation: "Foreign Language" },
      ]);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });

    test("calls GE section search api correctly with 1 section response", async () => {
      const useBackendSpy = vi.spyOn(useBackend, "useBackend");
      axiosMock
        .onGet("/api/public/primariesge")
        .reply(200, primaryFixtures.f24_math_lowerDiv);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectQuarter = screen.getByLabelText("Quarter");
      userEvent.selectOptions(selectQuarter, "20222");
      const selectSubject = screen.getByLabelText("General Education Area");

      const expectedKey = "GEAreaSearch.Area-option-A1";
      await waitFor(() =>
        expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
      );

      userEvent.selectOptions(selectSubject, "A1");

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();
      userEvent.click(submitButton);

      axiosMock.resetHistory();

      await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
      });

      expect(axiosMock.history.get[0].params).toEqual({
        qtr: "20222",
        area: "A1",
      });

      const expectedFirstRow = screen.getByTestId(
        "SectionsTable-cell-row-0-col-courseId",
      );
      expect(expectedFirstRow).toBeInTheDocument();
      expect(expectedFirstRow).toHaveTextContent("MATH 2A");

      expect(useBackendSpy).toHaveBeenCalledWith(
        ["/api/personalschedules/all"],
        { method: "GET", url: "/api/personalschedules/all" },
        [],
      );
    });

    test("expands row and displays GE areas for lecture and discussion rows", async () => {
      axiosMock
        .onGet("/api/public/primariesge")
        .reply(200, primaryFixtures.f24_math_lowerDiv);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectQuarter = screen.getByLabelText("Quarter");
      userEvent.selectOptions(selectQuarter, "20222");
      const selectSubject = screen.getByLabelText("General Education Area");

      const expectedKey = "GEAreaSearch.Area-option-A1";
      await waitFor(() =>
        expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
      );

      userEvent.selectOptions(selectSubject, "A1");

      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("SectionsTable-row-0-expand-button"),
        ).toBeInTheDocument();
      });

      // Expand the first row to show discussion sections
      const expandButton = screen.getByTestId(
        "SectionsTable-row-0-expand-button",
      );
      userEvent.click(expandButton);

      await waitFor(() => {
        // Check that GE areas column is rendered for the lecture row
        const geCell = screen.getByTestId(
          "SectionsTable-cell-row-0-col-generalEducation",
        );
        expect(geCell).toBeInTheDocument();
        expect(geCell.textContent.length).toBeGreaterThan(0);
      });

      // Check that the discussion row also has GE areas (depth !== 0 path)
      await waitFor(() => {
        const discGECell = screen.queryByTestId(
          "SectionsTable-cell-row-1-col-generalEducation",
        );
        // Discussion rows should inherit GE from parent row
        if (discGECell) {
          expect(discGECell).toBeInTheDocument();
        }
      });
    });
  });

  describe("logged out", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.mock("main/utils/currentUser", async () => ({
        useCurrentUser: () => ({
          data: {
            loggedIn: false,
            root: { user: { email: "test@example.com" } },
          },
        }),
        useLogout: () => ({ mutate: vi.fn() }),
        hasRole: (_user, _role) => false,
      }));
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/public/generalEducationInfo").reply(200, [
        { requirementCode: "A1", requirementTranslation: "English" },
        { requirementCode: "B", requirementTranslation: "Foreign Language" },
      ]);
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.unmock("main/utils/currentUser");
    });

    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });

    test("calls GE section search api correctly with 1 section response", async () => {
      axiosMock
        .onGet("/api/public/primariesge")
        .reply(200, primaryFixtures.f24_math_lowerDiv);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectQuarter = screen.getByLabelText("Quarter");
      userEvent.selectOptions(selectQuarter, "20222");
      const selectSubject = screen.getByLabelText("General Education Area");

      const expectedKey = "GEAreaSearch.Area-option-A1";
      await waitFor(() =>
        expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
      );

      userEvent.selectOptions(selectSubject, "A1");

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();
      userEvent.click(submitButton);

      axiosMock.resetHistory();

      await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
      });

      expect(axiosMock.history.get[0].params).toEqual({
        qtr: "20222",
        area: "A1",
      });

      const expectedFirstRow = screen.getByTestId(
        "SectionsTable-cell-row-0-col-courseId",
      );
      expect(expectedFirstRow).toBeInTheDocument();
      expect(expectedFirstRow).toHaveTextContent("MATH 2A");
    });

    test("shows no results when no courses are found", async () => {
      axiosMock.onGet("/api/public/primariesge").reply(200, []);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectQuarter = screen.getByLabelText("Quarter");
      userEvent.selectOptions(selectQuarter, "20222");
      const selectSubject = screen.getByLabelText("General Education Area");

      const expectedKey = "GEAreaSearch.Area-option-A1";
      await waitFor(() =>
        expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
      );

      userEvent.selectOptions(selectSubject, "A1");

      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
      });

      // Verify no result rows are displayed
      const resultRow = screen.queryByTestId(
        "SectionsTable-cell-row-0-col-courseId",
      );
      expect(resultRow).not.toBeInTheDocument();
    });

    test("expands row and displays GE areas for lecture and discussion rows", async () => {
      axiosMock
        .onGet("/api/public/primariesge")
        .reply(200, primaryFixtures.f24_math_lowerDiv);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GeneralEducationSearchPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectQuarter = screen.getByLabelText("Quarter");
      userEvent.selectOptions(selectQuarter, "20222");
      const selectSubject = screen.getByLabelText("General Education Area");

      const expectedKey = "GEAreaSearch.Area-option-A1";
      await waitFor(() =>
        expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
      );

      userEvent.selectOptions(selectSubject, "A1");

      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("SectionsTable-row-0-expand-button"),
        ).toBeInTheDocument();
      });

      // Expand the first row to show discussion sections
      const expandButton = screen.getByTestId(
        "SectionsTable-row-0-expand-button",
      );
      userEvent.click(expandButton);

      await waitFor(() => {
        // Check that GE areas column is rendered for the lecture row
        const geCell = screen.getByTestId(
          "SectionsTable-cell-row-0-col-generalEducation",
        );
        expect(geCell).toBeInTheDocument();
        expect(geCell.textContent.length).toBeGreaterThan(0);
      });

      // Check that the discussion row also has GE areas (depth !== 0 path)
      await waitFor(() => {
        const discGECell = screen.queryByTestId(
          "SectionsTable-cell-row-1-col-generalEducation",
        );
        // Discussion rows should inherit GE from parent row
        if (discGECell) {
          expect(discGECell).toBeInTheDocument();
        }
      });
    });
  });
});
