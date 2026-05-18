import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { useSystemInfo } from "main/utils/systemInfo";
import { vi } from "vitest";
import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: vi.fn(),
}));

describe("CSVDownloadsPage tests", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    useSystemInfo.mockReturnValue({
      data: {
        startQtrYYYYQ: "20084",
        endQtrYYYYQ: "20222",
      },
    });
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
});
