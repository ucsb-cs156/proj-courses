import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import React from "react";
import * as backend from "main/utils/useBackend";
import SingleAreaDropdown from "main/components/GEAreas/SingleAreaDropdown";
import allGEAreas from "fixtures/singleAreaDropdownFixtures";

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useState: vi.fn(),
  compareValues: vi.fn(),
}));

describe("SingleAreaDropdown tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    useState.mockImplementation(vi.importActual("react").useState);
  });
  beforeEach(() => {
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);

    axiosMock.resetHistory();
    axiosMock.onAny("/api/public/generalEducationInfo").reply((config) => {
      if (config.method.toLowerCase() !== "get") {
        return [400, { error: "Incorrect method" }];
      }
      return [
        200,
        [
          "ALL",
          "A1",
          "A2",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "ETH",
          "WRT",
          "EUR",
          "NWC",
          "QR",
          "AMH",
        ],
      ];
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    console.error.mockRestore();
  });

  const setArea = vi.fn();
  const area = vi.fn();

  test("renders without crashing and loads dropdown options from backend", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={"A1"}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for dropdown options to appear
    const optionA1 = await screen.findByTestId("SampleGEControlId-option-A1");
    const optionB = await screen.findByTestId("SampleGEControlId-option-B");
    const optionC = await screen.findByTestId("SampleGEControlId-option-C");
    const optionALL = await screen.findByTestId("SampleGEControlId-option-all");

    // Add explicit assertions:
    expect(optionA1).toBeInTheDocument();
    expect(optionB).toBeInTheDocument();
    expect(optionC).toBeInTheDocument();
    expect(optionALL).toBeInTheDocument();

    // Also check option values
    expect(optionA1).toHaveValue("A1");
    expect(optionB).toHaveValue("B");
    expect(optionC).toHaveValue("C");
    expect(optionALL).toHaveValue("ALL");
  });

  test("renders without crashing on allGEAreas", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={area}
            areas={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const options = [
      "ALL",
      "A1",
      "A2",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "ETH",
      "WRT",
      "EUR",
      "NWC",
      "QR",
      "AMH",
    ];

    for (const opt of options) {
      await waitFor(() =>
        expect(
          screen.getByTestId(`SampleGEControlId-option-${opt}`),
        ).toHaveValue(opt),
      );
    }
  });

  test("when I select an object, the value changes", async () => {
    const queryClient = new QueryClient(); // ✅ Create a QueryClient
    const setArea = vi.fn(); // ✅ Mock setArea
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area="A1"
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();

    const select = screen.getByLabelText("GE Area");
    await screen.findByTestId("SampleGEControlId-option-A1");
    userEvent.selectOptions(select, "A1");
    expect(setArea).toBeCalledWith("A1");
  });

  test('when I select "ALL" option, value changes to "ALL"', async () => {
    const queryClient = new QueryClient(); // ✅ Create a QueryClient

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const select = await screen.findByLabelText("GE Area");
    userEvent.selectOptions(select, "ALL");
    expect(setArea).toBeCalledWith("ALL");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = vi.fn();
    const queryClient = new QueryClient(); // ✅ Create a QueryClient

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            areas={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
            onChange={onChange}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the option "A1" to be in the DOM before interacting with the select element
    await screen.findByTestId("SampleGEControlId-option-A1");

    const select = screen.getByLabelText("GE Area");

    // Now that the option is loaded, select "A1"
    userEvent.selectOptions(select, "A1");

    // Wait for setArea to be called with "A1"
    await waitFor(() => expect(setArea).toBeCalledWith("A1"));

    // Wait for onChange handler to be called once
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // Check that onChange's first call has the event with target value "A1"
    expect(onChange.mock.calls[0][0].target.value).toBe("A1");
  });

  test('onChange is called when value is "ALL"', async () => {
    const onChange = vi.fn();
    const queryClient = new QueryClient(); // ✅ Create a QueryClient

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
            onChange={onChange}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const select = await screen.findByLabelText("GE Area");
    userEvent.selectOptions(select, "ALL");
    await waitFor(() => expect(setArea).toBeCalledWith("ALL"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));
    expect(onChange.mock.calls[0][0].target.value).toBe("ALL");
  });

  test("default label is General Education Area", async () => {
    const queryClient = new QueryClient(); // ✅ Create a QueryClient

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    const queryClient = new QueryClient(); // ✅ Create a QueryClient

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "SampleGEControlId-option-A1";
    await screen.findByTestId(expectedKey);
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    // Arrange: simulate localStorage having a value
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "A1");

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={allGEAreas}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const dropdown = screen.getByLabelText("GE Area");
      expect(dropdown).toHaveValue("A1");
    });

    getItemSpy.mockRestore();
  });

  test("when localstorage has no value, first element of subject list is passed to useState", async () => {
    localStorage.clear();

    const setArea = vi.fn();
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, [
        "ALL, A1",
        "A2",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "ETH",
        "WRT",
        "EUR",
        "NWC",
        "QR",
        "AMH",
      ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown setArea={setArea} controlId="SampleGEControlId" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the dropdown to render and options to load
    const select = await screen.findByLabelText("GE Area");

    // Check the selected value is "ALL" (default)
    expect(select.value).toBe("ALL");

    // Optionally, check that setArea was NOT called (since the component might not call it)
    expect(setArea).not.toHaveBeenCalled();
  });

  test("When no subjects, dropdown is blank", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SingleAreaDropdown
            area={[]}
            setArea={setArea}
            controlId="SampleGEControlId"
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByTestId("SampleGEControlId")).toBeNull();
  });

  // --- ADDITIONAL TESTS START HERE ---

  describe("SingleAreaDropdown tests", () => {
    it("makes GET request to /api/public/generalEducationInfo", async () => {
      const spy = vi.spyOn(backend, "useBackend").mockImplementation(() => ({
        data: ["A1", "A2", "B", "C"],
      }));
      const queryClient = new QueryClient();

      // Render component
      render(
        <QueryClientProvider client={queryClient}>
          <SingleAreaDropdown controlId="SampleGEControlId" />
        </QueryClientProvider>,
      );
      // Wait for the GET request to be made
      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(
          ["/api/public/generalEducationInfo"],
          { method: "GET", url: "/api/public/generalEducationInfo" },
          [],
        );
      });
    });
  });

  // --- ADDITIONAL TESTS END HERE ---
});
