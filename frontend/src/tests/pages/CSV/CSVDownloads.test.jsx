import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("CSVDownloadsPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const originalLocation = window.location;

  beforeEach(() => {
    const localStorageStore = {};
    const localStorageMock = {
      getItem: (key) => localStorageStore[key] || null,
      setItem: (key, value) => {
        localStorageStore[key] = value.toString();
      },
      removeItem: (key) => {
        delete localStorageStore[key];
      },
      clear: () => {
        Object.keys(localStorageStore).forEach((key) => {
          delete localStorageStore[key];
        });
      },
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    localStorage.setItem("CSVDownloads.Quarter", "20241");
    localStorage.setItem("CSVDownloads.SubjectQuarter", "20241");
    localStorage.setItem("CSVDownloads.Subject", "ANTH");
    localStorage.setItem("CSVDownloads.Level", "U");
    axiosMock.reset();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      ...systemInfoFixtures.showingNeither,
      startQtrYYYYQ: "20241",
      endQtrYYYYQ: "20242",
    });
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
  });

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
  });

  const renderPage = () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CSVDownloadsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  const mockLocationAssign = () => {
    const assignMock = vi.fn();
    delete window.location;
    window.location = Object.assign(new URL("http://localhost:3000"), {
      assign: assignMock,
    });
    return assignMock;
  };

  test("renders correctly", async () => {
    renderPage();

    expect(await screen.findByText("CSV Downloads")).toBeInTheDocument();
  });

  test("uses dropdowns for quarters, subject area, and course level", async () => {
    renderPage();

    expect(await screen.findAllByLabelText("Quarter")).toHaveLength(2);
    const subjectAreaDropdown = screen.getByLabelText("Subject Area");
    const levelDropdown = screen.getByLabelText("Course Level");
    expect(subjectAreaDropdown).toBeInTheDocument();
    expect(levelDropdown).toBeInTheDocument();
    expect(screen.getByLabelText("Omit sections")).toBeChecked();
    expect(
      screen.getByLabelText("Only include courses with times or locations"),
    ).toBeChecked();

    expect(screen.getByTestId("CSVDownloads.Level-option-0")).toHaveValue("U");
    expect(screen.getByTestId("CSVDownloads.Level-option-0")).toHaveTextContent(
      "Undergraduate",
    );
    expect(screen.getByTestId("CSVDownloads.Level-option-1")).toHaveValue("G");
    expect(screen.getByTestId("CSVDownloads.Level-option-1")).toHaveTextContent(
      "Graduate",
    );
    expect(screen.getByTestId("CSVDownloads.Level-option-2")).toHaveValue("A");
    expect(screen.getByTestId("CSVDownloads.Level-option-2")).toHaveTextContent(
      "All",
    );
    expect(levelDropdown).toHaveValue("U");

    await waitFor(() =>
      expect(
        screen.getByTestId("CSVDownloads.Subject-option-CMPSC"),
      ).toBeInTheDocument(),
    );
    expect(subjectAreaDropdown).toHaveValue("ANTH");
    expect(screen.getByTestId("CSVDownloads.Subject-option-ANTH")).toHaveValue(
      "ANTH",
    );
    expect(
      screen.getByTestId("CSVDownloads.Subject-option-ANTH"),
    ).toHaveTextContent("ANTH - Anthropology");
  });

  test("submitting by-quarter form downloads selected quarter", async () => {
    const assignMock = mockLocationAssign();
    renderPage();

    const quarterDropdown = (await screen.findAllByLabelText("Quarter"))[0];
    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    const byQuarterForm = byQuarterButton.closest("form");

    fireEvent.change(quarterDropdown, { target: { value: "20242" } });
    fireEvent.submit(byQuarterForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/quarter?yyyyq=20242",
    );
  });

  test("submitting by-quarter-and-subject form includes all endpoint parameters", async () => {
    const assignMock = mockLocationAssign();
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const allDownloadButtons = screen.getAllByRole("button", {
      name: "Download CSV",
    });
    const byQuarterAndSubjectButton = allDownloadButtons[1];
    const byQuarterAndSubjectForm = byQuarterAndSubjectButton.closest("form");

    const quarterDropdown = screen.getAllByLabelText("Quarter")[1];
    const subjectAreaDropdown = screen.getByLabelText("Subject Area");
    const levelDropdown = screen.getByLabelText("Course Level");
    const omitSectionsCheckbox = screen.getByLabelText("Omit sections");
    const withTimeLocationsCheckbox = screen.getByLabelText(
      "Only include courses with times or locations",
    );

    await waitFor(() =>
      expect(
        screen.getByTestId("CSVDownloads.Subject-option-CMPSC"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(quarterDropdown, { target: { value: "20242" } });
    fireEvent.change(subjectAreaDropdown, { target: { value: "CMPSC" } });
    fireEvent.change(levelDropdown, { target: { value: "G" } });
    fireEvent.click(omitSectionsCheckbox);
    fireEvent.click(withTimeLocationsCheckbox);
    fireEvent.submit(byQuarterAndSubjectForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20242&subjectArea=CMPSC&level=G&omitSections=false&withTimeLocations=false",
    );
  });

  test("submitting by-quarter-and-subject form includes default parameters", async () => {
    const assignMock = mockLocationAssign();
    renderPage();

    await waitFor(() =>
      expect(
        screen.getByTestId("CSVDownloads.Subject-option-ANTH"),
      ).toBeInTheDocument(),
    );

    const byQuarterAndSubjectButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[1];
    fireEvent.submit(byQuarterAndSubjectButton.closest("form"));

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20221&subjectArea=ANTH&level=U&omitSections=true&withTimeLocations=true",
    );
  });

  test("uses default quarter range when systemInfo has no quarter data", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {});
    renderPage();
    expect(await screen.findByText("CSV Downloads")).toBeInTheDocument();
    expect(screen.getByTestId("CSVDownloads.Quarter")).toBeInTheDocument();
  });
});
