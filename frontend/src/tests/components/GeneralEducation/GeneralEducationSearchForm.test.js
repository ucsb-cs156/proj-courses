import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { allTheAreas } from "fixtures/areaFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import GeneralEducationSearchForm from "main/components/GeneralEducation/GeneralEducationSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => ({
    data: {
      startQtrYYYYQ: "20221",
      endQtrYYYYQ: "20222",
    },
  }),
}));

const getAreaOptionDisplayRegExp = (areaData) => {
  if (!areaData) return /.*/;
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const reqCode = escapeRegExp(areaData.requirementCode);
  const reqTrans = escapeRegExp(areaData.requirementTranslation);
  const colCode = escapeRegExp(areaData.collegeCode);

  return new RegExp(`^${reqCode}\\s*-\\s*${reqTrans}\\s*\\(${colCode}\\)$`); // Added ^ and $ for exact match
};

describe("GeneralEducationSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();

    axiosMock.resetHistory();
    axiosMock.resetHandlers();

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);

    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);
  });

  test("renders without crashing", async () => {
    // Make async to allow for potential initial async effects
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // Add a small wait to see if it helps with initial act warnings
    await screen.findByText("Submit"); // Ensure form is rendered
  });

  test("area and quarter dropdowns are rendered and populated", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const quarterDropdown = await screen.findByLabelText("Quarter");
    expect(quarterDropdown).toBeInTheDocument();
    // Check for a quarter option - text derived from SingleQuarterDropdown implementation (e.g., "W22")
    expect(
      await screen.findByRole("option", { name: "W22" }),
    ).toBeInTheDocument();

    const areaDropdown = await screen.findByLabelText("General Education Area");
    expect(areaDropdown).toBeInTheDocument();

    const firstAreaEntry = allTheAreas.find(
      (a) => a.requirementCode === "A1" && a.collegeCode === "ENGR",
    );
    expect(
      await screen.findByRole("option", {
        name: getAreaOptionDisplayRegExp(firstAreaEntry),
      }),
    ).toBeInTheDocument();
  });

  test("selecting an area updates the state", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectArea = await screen.findByLabelText("General Education Area");
    const targetAreaData = allTheAreas.find(
      (a) => a.requirementCode === "C" && a.collegeCode === "ENGR",
    );

    // Wait for the option to appear using the RegExp
    await screen.findByRole("option", {
      name: getAreaOptionDisplayRegExp(targetAreaData),
    });

    await userEvent.selectOptions(selectArea, "C-ENGR"); // "C-ENGR" is the value attribute

    expect(selectArea.value).toBe("C-ENGR");
  });

  test("selecting a quarter updates the state", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = await screen.findByLabelText("Quarter");
    await screen.findByRole("option", { name: "S22" }); // Assuming 20222 maps to S22

    await userEvent.selectOptions(selectQuarter, "20222");
    expect(selectQuarter.value).toBe("20222");
  });

  test("submitting the form calls fetchJSON with correct area and quarter", async () => {
    const fetchJSONSpy = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectArea = await screen.findByLabelText("General Education Area");
    const targetAreaDataWRT = allTheAreas.find(
      (a) => a.requirementCode === "WRT" && a.collegeCode === "ENGR",
    );
    await screen.findByRole("option", {
      name: getAreaOptionDisplayRegExp(targetAreaDataWRT),
    });
    await userEvent.selectOptions(selectArea, "WRT-ENGR");

    const selectQuarter = await screen.findByLabelText("Quarter");
    await screen.findByRole("option", { name: "S22" });
    await userEvent.selectOptions(selectQuarter, "20222");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton); // userEvent.click is async

    await waitFor(() => {
      expect(fetchJSONSpy).toHaveBeenCalledTimes(1);
    });

    expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
      area: "WRT-ENGR",
      quarter: "20222",
    });
  });

  test("form submission with different values", async () => {
    const fetchJSONSpy = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectArea = await screen.findByLabelText("General Education Area");
    const targetAreaDataDLS = allTheAreas.find(
      (a) => a.requirementCode === "D" && a.collegeCode === "L&S",
    );
    await screen.findByRole("option", {
      name: getAreaOptionDisplayRegExp(targetAreaDataDLS),
    });
    await userEvent.selectOptions(selectArea, "D-L&S");

    const selectQuarter = await screen.findByLabelText("Quarter");
    await screen.findByRole("option", { name: "W22" });
    await userEvent.selectOptions(selectQuarter, "20221");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchJSONSpy).toHaveBeenCalledTimes(1);
    });

    expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
      area: "D-L&S",
      quarter: "20221",
    });
  });
});
