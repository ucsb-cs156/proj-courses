import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { allTheAreas } from "fixtures/areaFixtures";
import { threeSections } from "fixtures/sectionFixtures";

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
    mockToast.mockClear();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);
    axiosMock.onGet("/api/personalschedules/all").reply(200, []);
  });

  test("renders correctly with form and empty table initially", async () => {
    axiosMock.onGet("/api/sections/generaleducationsearch").reply(200, []);
    renderPage();

    expect(
      await screen.findByText(/Search by General Education Area/i),
    ).toBeInTheDocument();
    expect(await screen.findByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Course ID/i }),
    ).toBeInTheDocument();
  });

  test("fetches and displays sections when user performs a search", async () => {
    if (allTheAreas.length === 0) {
      throw new Error("Fixture 'allTheAreas' is empty.");
    }
    const selectedAreaObject = allTheAreas[0];
    const optionValueToSelect = `${selectedAreaObject.requirementCode}-${selectedAreaObject.collegeCode}`;
    const apiSearchParameter = optionValueToSelect;

    const mockSearchResults = threeSections;
    // console.log("DEBUG: mockSearchResults for table:", JSON.stringify(mockSearchResults, null, 2)); // For debugging

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: apiSearchParameter },
      })
      .reply(200, mockSearchResults);
    axiosMock.onGet("/api/sections/generaleducationsearch").reply((config) => {
      if (config.params && config.params.area === apiSearchParameter) {
        return [200, mockSearchResults];
      }
      return [200, []];
    });

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await screen.findByText(
      new RegExp(
        `${selectedAreaObject.requirementCode} - ${selectedAreaObject.requirementTranslation} \\(${selectedAreaObject.collegeCode}\\)`,
      ),
    );

    // Wrap event causing state update in act if needed, though userEvent usually handles this
    // await act(async () => {
    await userEvent.selectOptions(areaDropdown, optionValueToSelect);
    // });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    // await act(async () => {
    await userEvent.click(submitButton);
    // });

    await waitFor(() => {
      expect(
        axiosMock.history.get.some(
          (req) =>
            req.url === "/api/sections/generaleducationsearch" &&
            req.params &&
            req.params.area === apiSearchParameter,
        ),
      ).toBe(true);
    });

    for (const section of mockSearchResults) {
      expect(
        await screen.findByText(section.courseInfo.title),
      ).toBeInTheDocument();
    }
  });

  test("shows an empty table or message if search returns no results", async () => {
    if (allTheAreas.length < 2) {
      throw new Error("Fixture 'allTheAreas' has less than 2 items.");
    }
    const selectedAreaObject = allTheAreas[1];
    const optionValueToSelect = `${selectedAreaObject.requirementCode}-${selectedAreaObject.collegeCode}`;
    const apiSearchParameter = optionValueToSelect;

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: apiSearchParameter },
      })
      .reply(200, []);

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await screen.findByText(
      new RegExp(
        `${selectedAreaObject.requirementCode} - ${selectedAreaObject.requirementTranslation} \\(${selectedAreaObject.collegeCode}\\)`,
      ),
    );
    await userEvent.selectOptions(areaDropdown, optionValueToSelect);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        axiosMock.history.get.some(
          (req) =>
            req.url === "/api/sections/generaleducationsearch" &&
            req.params &&
            req.params.area === apiSearchParameter,
        ),
      ).toBe(true);
    });

    expect(
      screen.queryByText(threeSections[0].courseInfo.title),
    ).not.toBeInTheDocument();
  });

  test("handles API error during search gracefully", async () => {
    if (allTheAreas.length === 0) {
      throw new Error("Fixture 'allTheAreas' is empty.");
    }
    const selectedAreaObject = allTheAreas[0];
    const optionValueToSelect = `${selectedAreaObject.requirementCode}-${selectedAreaObject.collegeCode}`;
    const apiSearchParameter = optionValueToSelect;

    axiosMock
      .onGet("/api/sections/generaleducationsearch", {
        params: { area: apiSearchParameter },
      })
      .reply(500, { message: "Internal Server Error" });

    renderPage();

    const areaDropdown = await screen.findByRole("combobox");
    await screen.findByText(
      new RegExp(
        `${selectedAreaObject.requirementCode} - ${selectedAreaObject.requirementTranslation} \\(${selectedAreaObject.collegeCode}\\)`,
      ),
    );
    // *** Manually retype this line in your editor: delete `selectOptions` and type it again carefully ***
    await userEvent.selectOptions(areaDropdown, optionValueToSelect);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining("Error communicating with backend"),
      );
    });
  });
});
