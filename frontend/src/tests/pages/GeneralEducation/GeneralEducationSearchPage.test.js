import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { generalEducationAreasFixtures } from "fixtures/generalEducationAreasFixtures";
import { sectionsFixtures } from "fixtures/sectionsFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("GeneralEducationSearchPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();
  const user = userEvent.setup();

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

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
      .onGet("/api/public/generalEducationInfo")
      .reply(200, generalEducationAreasFixtures.areas);
  });

  test("renders correctly with form and empty table initially", async () => {
    axiosMock.onGet("/api/sections/generaleducationsearch").reply(200, []); // No results initially
    renderPage();

    expect(
      await screen.findByText("Search by GeneralEducation Area"),
    ).toBeInTheDocument();
    expect(await screen.findByRole("combobox")).toBeInTheDocument(); // For the GE Area dropdown
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    // Assuming SectionsTable shows column headers even when empty
    expect(
      screen.getByRole("columnheader", { name: /Course ID/i }),
    ).toBeInTheDocument();
  });

  test("fetches and displays sections when user performs a search", async () => {
    const selectedAreaCode = generalEducationAreasFixtures.areas[0].areaCode;
    // Use the existing named export from your fixtures
    const mockSearchResults = sectionsFixtures.threeSections;

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: selectedAreaCode },
      })
      .reply(200, mockSearchResults);
    // Fallback for any other search call during this test (optional, but can prevent unexpected empty results)
    axiosMock.onGet("/api/sections/generaleducationsearch").reply(200, []);

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await user.selectOptions(areaDropdown, selectedAreaCode);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        axiosMock.history.get.some(
          (req) =>
            req.url === "/api/sections/generaleducationsearch" &&
            req.params.area === selectedAreaCode,
        ),
      ).toBe(true);
    });

    for (const section of mockSearchResults) {
      expect(
        await screen.findByText(section.courseInfo.title),
      ).toBeInTheDocument();
      expect(screen.getByText(section.section.enrollCode)).toBeInTheDocument();
    }
  });

  test("shows an empty table or message if search returns no results", async () => {
    const selectedAreaCode = generalEducationAreasFixtures.areas[1].areaCode;

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: selectedAreaCode },
      })
      .reply(200, []); // Return empty array

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await user.selectOptions(areaDropdown, selectedAreaCode);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        axiosMock.history.get.some(
          (req) =>
            req.url === "/api/sections/generaleducationsearch" &&
            req.params.area === selectedAreaCode,
        ),
      ).toBe(true);
    });

    // Ensure content from a potential previous search (e.g., from sectionsFixtures.threeSections) is NOT there
    expect(
      screen.queryByText(sectionsFixtures.threeSections[0].courseInfo.title),
    ).not.toBeInTheDocument();
    // expect(await screen.findByText(/No sections match your search/i)).toBeInTheDocument(); // If your table shows a specific message
  });

  test("handles API error during search gracefully", async () => {
    const selectedAreaCode = generalEducationAreasFixtures.areas[0].areaCode;

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: selectedAreaCode },
      })
      .reply(500, { message: "Internal Server Error" });

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await user.selectOptions(areaDropdown, selectedAreaCode);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        "Error fetching results: Internal Server Error",
      );
    });
  });
});
