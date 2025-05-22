import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
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

describe("GeneralEducationSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);

    toast.mockReturnValue({
      addToast: addToast,
    });
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when I select an area, the state for area changes", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "GeneralEducationSearch.Area-option-C-ENGR";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "C-ENGR");
    expect(selectArea.value).toBe("C-ENGR");
  });

  test("when I click submit, the right stuff happens", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = {
      area: "WRT-ENGR",
    };

    const expectedKey = "GeneralEducationSearch.Area-option-WRT-ENGR";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "WRT-ENGR");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields,
    );
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);

    const sampleReturnValue = {
      sampleKey: "sampleValue",
      total: 0,
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "GeneralEducationSearch.Area-option-D-L&S";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "D-L&S");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });
});
