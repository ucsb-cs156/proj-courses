import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { generalEducationAreasFixtures } from "fixtures/generalEducationAreasFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// Helper to wrap with providers
const renderWithProviders = (ui, { queryClient } = {}) => {
  const client = queryClient || new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("GeneralEducationSearchPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    // Basic mocks common to all tests
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, generalEducationAreasFixtures.areas);
    axiosMock.onGet("/api/sections/generaleducationsearch").reply(200, []);
  });

  test("renders expected content and form elements", async () => {
    renderWithProviders(<GeneralEducationSearchPage />, { queryClient });

    // Check for page title
    expect(await screen.findByText("Search by GeneralEducation Area")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    const dropdown = screen.getByRole("combobox", { name: /Select GE Area/i }); 

    expect(await screen.findByText(generalEducationAreasFixtures.areas[0].areaName)).toBeInTheDocument();

  });

  test("fetches and displays sections when user performs a search", async () => {
    // Override the default search mock to return specific data for this test
    const testSections = sectionsFixtures.threeSections;
    axiosMock
      .onGet("/api/sections/generaleducationsearch", { params: { area: "A1" } }) // Ensure params match
      .reply(200, testSections);

    renderWithProviders(<GeneralEducationSearchPage />, { queryClient });
    const user = userEvent.setup();

    
    const areaDropdown = await screen.findByRole("combobox");
    await user.selectOptions(areaDropdown, "A1");

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    // Assert that the API was called
    await waitFor(() => {
      expect(axiosMock.history.get.some(req => req.url === "/api/sections/generaleducationsearch" && req.params.area === "A1")).toBe(true);
    });

    for (const section of testSections) {
      expect(await screen.findByText(section.courseInfo.title)).toBeInTheDocument();
      expect(screen.getByText(section.section.enrollCode)).toBeInTheDocument();
    }
  });

  test("displays a message or empty table when search returns no results", async () => {
    axiosMock
      .onGet("/api/sections/generaleducationsearch", { params: { area: "XYZ" } })
      .reply(200, []);


    renderWithProviders(<GeneralEducationSearchPage />, { queryClient });
    const user = userEvent.setup();

    const areaDropdown = await screen.findByRole("combobox");
    await user.selectOptions(areaDropdown, generalEducationAreasFixtures.areas[0].areaCode); // Select any valid area
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    // Wait for the (empty) search to complete
    await waitFor(() => {
         expect(axiosMock.history.get.some(req => req.url === "/api/sections/generaleducationsearch")).toBe(true);
    });
  });
});