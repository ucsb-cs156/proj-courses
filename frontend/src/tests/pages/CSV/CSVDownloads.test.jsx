import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { useSystemInfo } from "main/utils/systemInfo";
import { vi } from "vitest";
import { allTheLevels } from "fixtures/levelsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";


vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: vi.fn(),
}));

describe("CSVDownloadsPage tests", () => {
  const originalLocation = window.location;
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    vi.clearAllMocks();
    useSystemInfo.mockReturnValue({
      data: {
        startQtrYYYYQ: "20084",
        endQtrYYYYQ: "20222",
      },
    });
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, [
      { subjectCode: "ANTH", subjectTranslation: "Anthropology" },
      { subjectCode: "CMPSC", subjectTranslation: "Computer Science" },
    ]);
  });

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
    localStorage.clear();
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

  test("submitting by-quarter form downloads with the default selected quarter", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    const byQuarterForm = byQuarterButton.closest("form");

    fireEvent.submit(byQuarterForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/quarter?yyyyq=20222",
    );
  });

  test("submitting by-quarter-and-subject form includes all new dropdown and checkbox parameters", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    const byQuarterAndSubjectButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[1];
    const byQuarterAndSubjectForm = byQuarterAndSubjectButton.closest("form");

    fireEvent.submit(byQuarterAndSubjectForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20222&subjectArea=ANTH&level=U&omitSections=true&withTimeLocations=true",
    );
  });

  test("uses fallback quarters when systemInfo is unavailable", () => {
    useSystemInfo.mockReturnValue({ data: null });

    renderPage();

    const fallbackDropdowns = screen.getAllByDisplayValue("S26");

    expect(fallbackDropdowns.length).toBe(2);
    expect(fallbackDropdowns[0]).toBeInTheDocument();
  });

  test("checkboxes correctly trigger handlers and save to localStorage", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const omitSectionsCheckbox = screen.getByTestId(
      "CSVDownloads.OmitSections-checkbox",
    );
    const withTimeLocationsCheckbox = screen.getByTestId(
      "CSVDownloads.WithTimeLocations-checkbox",
    );

    expect(omitSectionsCheckbox).toBeChecked();
    expect(withTimeLocationsCheckbox).toBeChecked();

    fireEvent.click(omitSectionsCheckbox);
    expect(omitSectionsCheckbox).not.toBeChecked();
    expect(localStorage.getItem("CSVDownloads.OmitSections")).toBe("false");

    fireEvent.click(withTimeLocationsCheckbox);
    expect(withTimeLocationsCheckbox).not.toBeChecked();
    expect(localStorage.getItem("CSVDownloads.WithTimeLocations")).toBe(
      "false",
    );
  });

  test("loads state from localStorage when available", async () => {
    localStorage.setItem("CSVDownloads.Quarter", "20182");
    localStorage.setItem("CSVDownloads.Subject", "CMPSC");
    localStorage.setItem("CSVDownloads.Level", "G");
    localStorage.setItem("CSVDownloads.OmitSections", "false");
    localStorage.setItem("CSVDownloads.WithTimeLocations", "false");

    renderPage();

    const quarterDropdowns = screen.getAllByDisplayValue("S18");
    expect(quarterDropdowns.length).toBe(2);
    expect(quarterDropdowns[0]).toHaveValue("20182");
    expect(quarterDropdowns[1]).toHaveValue("20182");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const subjectDropdown = await screen.findByLabelText("Subject Area");
    expect(subjectDropdown).toHaveValue("CMPSC");

    const levelDropdown = await screen.getByLabelText("Course Level");
    expect(levelDropdown).toHaveValue("G");

    const omitSectionsCheckbox = screen.getByTestId(
      "CSVDownloads.OmitSections-checkbox",
    );
    const withTimeLocationsCheckbox = screen.getByTestId(
      "CSVDownloads.WithTimeLocations-checkbox",
    );

    expect(omitSectionsCheckbox).not.toBeChecked();
    expect(withTimeLocationsCheckbox).not.toBeChecked();
  });

  test("checkboxes load correctly when set to true", () => {
    localStorage.setItem("CSVDownloads.OmitSections", "true");
    localStorage.setItem("CSVDownloads.WithTimeLocations", "true");

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const omitSectionsCheckbox = screen.getByTestId(
      "CSVDownloads.OmitSections-checkbox",
    );
    const withTimeLocationsCheckbox = screen.getByTestId(
      "CSVDownloads.WithTimeLocations-checkbox",
    );

    expect(omitSectionsCheckbox).toBeChecked();
    expect(withTimeLocationsCheckbox).toBeChecked();
  });

  test("falls back to default Subject and Level when localStorage is empty", async () => {
    localStorage.clear();

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const subjectDropdown = await screen.findByLabelText("Subject Area");
    expect(subjectDropdown).toHaveValue("ANTH");

    const levelDropdown = screen.getByLabelText("Course Level");
    expect(levelDropdown).toHaveValue(allTheLevels[0].value);
  });
});
