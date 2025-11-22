import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import * as useBackend from "main/utils/useBackend.jsx";
import * as systemInfoModule from "main/utils/systemInfo";

import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

let axiosMock;
let useBackendSpy;

describe("GEAreaSearchForm tests", () => {
  describe("GEAreaSearchForm tests with healthy backend", () => {
    const queryClient = new QueryClient();
    const addToast = vi.fn();
    let getItemSpy, setItemSpy;

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();

      vi.clearAllMocks();
      // Silence console.error
      vi.spyOn(console, "error").mockImplementation(() => {});

      // Mock current user + system info
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, { loggedIn: true, username: "testuser" });
      axiosMock.onGet("/api/systemInfo").reply(200, {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20211",
        endQtrYYYYQ: "20214",
      });

      // Mock GE areas endpoint
      axiosMock.onGet("/api/public/generalEducationInfo").reply(200, [
        {
          requirementCode: "A1",
          requirementTranslation: "English Reading & Composition",
          collegeCode: "ENGR",
          objCode: "BS",
          courseCount: 1,
          units: 4,
          inactive: false,
        },
        {
          requirementCode: "B",
          requirementTranslation: "Foreign Language - L&S",
          collegeCode: "L&S",
          objCode: "BA",
          courseCount: 1,
          units: 4,
          inactive: false,
        },
      ]);

      toast.mockReturnValue({ addToast });
      getItemSpy = vi.spyOn(Storage.prototype, "getItem");
      setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      // FIX: Mock getItem to return a value ONLY for the correct key.
      // This will cause the test to fail if the key is mutated.
      getItemSpy.mockImplementation((key) => {
        if (key === "GEAreaSearch.Quarter") {
          return "20213"; // A different quarter to test
        }
        if (key === "GEAreaSearch.Area") {
          return "B"; // A different area to test
        }
        return null;
      });

      setItemSpy.mockImplementation(() => null);
      useBackendSpy = vi.spyOn(useBackend, "useBackend");
    });

    afterEach(() => {
      vi.clearAllMocks();
      getItemSpy.mockRestore();
      setItemSpy.mockRestore();
      toast.mockClear();
      addToast.mockClear();
      useBackendSpy.mockRestore();
    });

    const WrappedForm = (props) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaSearchForm {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    test("renders correctly with local storage values", async () => {
      render(<WrappedForm />);
      expect(screen.getByLabelText("Quarter")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText("Quarter").value).toBe("20213"); // Expect the mocked value
      });

      expect(
        screen.getByLabelText("General Education Area"),
      ).toBeInTheDocument();
      expect(getItemSpy).toHaveBeenCalledWith("GEAreaSearch.Quarter");
      expect(getItemSpy).toHaveBeenCalledWith("GEAreaSearch.Area");
      await waitFor(() =>
        expect(screen.getByText("Searching for B in M21")).toBeInTheDocument(),
      );
    });

    test("selecting quarter updates state", () => {
      render(<WrappedForm />);
      const quarterSelect = screen.getByLabelText("Quarter");
      userEvent.selectOptions(quarterSelect, "20212");
      expect(quarterSelect.value).toBe("20212");
      expect(setItemSpy).toHaveBeenCalledWith("GEAreaSearch.Quarter", "20212");
    });

    test("when local state for area is empty, we get ALL", () => {
      getItemSpy.mockImplementation((key) => {
        if (key === "GEAreaSearch.Quarter") {
          return "20212";
        }
        if (key === "GEAreaSearch.Area") {
          return null; // Simulate empty local state
        }
        return null;
      });
      render(<WrappedForm />);
      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect.value).toBe("ALL");
      expect(screen.getByTestId("GEAreaSearch.Status")).toHaveTextContent(
        "Searching for ALL in S21",
      );
    });

    test("when local state for quarter is empty, we get ALL", () => {
      getItemSpy.mockImplementation((key) => {
        if (key === "GEAreaSearch.Quarter") {
          return null;
        }
        if (key === "GEAreaSearch.Area") {
          return "MATH"; // Simulate empty local state
        }
        return null;
      });
      render(<WrappedForm />);
      const quarterSelect = screen.getByLabelText("Quarter");
      expect(quarterSelect.value).toBe("20211");
      expect(screen.getByTestId("GEAreaSearch.Status")).toHaveTextContent(
        "Searching for MATH in W21",
      );
    });

    test("selecting GE area updates state", async () => {
      render(<WrappedForm />);
      // wait for options to load
      await screen.findByTestId("GEAreaSearch.Area-option-A1");
      expect(
        screen.getByTestId("GEAreaSearch.Area-option-all"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("GEAreaSearch.Area-option-A1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("GEAreaSearch.Area-option-B"),
      ).toBeInTheDocument();

      await screen.findByTestId("GEAreaSearch.Area-option-B");
      const areaSelect = screen.getByLabelText("General Education Area");
      userEvent.selectOptions(areaSelect, "B");
      expect(areaSelect.value).toBe("B");
    });

    test("area dropdown initially shows only ALL before backend loads", () => {
      axiosMock
        .onGet("/api/public/generalEducationInfo")
        .reply(() => new Promise(() => {})); // never resolves

      getItemSpy.mockImplementation((key) => null);
      useBackendSpy.mockReturnValue({
        data: [],
        _status: "loading",
        _error: null,
      });

      render(<WrappedForm />);

      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect.children.length).toBe(1);
    });

    test("works when /api/systemInfo returns 500 (systemInfo undefined fallback)", async () => {
      axiosMock.onGet("/api/systemInfo").reply(500);

      render(<WrappedForm />);

      const quarterSelect = await screen.findByLabelText("Quarter");
      expect(quarterSelect.value).toBe("20221");
    });

    test("uses fallback quarter and area when systemInfo or localStorage are not ready", () => {
      const defaultQuarter = "20221";

      const systemInfoMock = { data: "", isLoading: true, isError: false };
      const useSystemInfoSpy = vi
        .spyOn(systemInfoModule, "useSystemInfo")
        .mockReturnValue(systemInfoMock);

      getItemSpy.mockImplementation(() => null);

      render(<WrappedForm />);

      const quarterDropdown = screen.getByLabelText("Quarter");
      expect(quarterDropdown).toBeInTheDocument();
      expect(quarterDropdown.value).toBe(defaultQuarter);

      const areaDropdown = screen.getByLabelText("General Education Area");
      expect(areaDropdown.value).toBe("ALL");

      useSystemInfoSpy.mockRestore();
    });

    test("works when /api/systemInfo returns 500", async () => {
      axiosMock.onGet("/api/systemInfo").reply(500);
      render(<WrappedForm />);
      const quarterSelect = await screen.findByLabelText("Quarter");
      expect(quarterSelect.value).toBe("20221");
    });

    test("renders dynamically added area codes", async () => {
      useBackendSpy.mockReturnValue({
        data: [{ requirementCode: "X1" }],
        _status: "success",
        _error: null,
      });
      render(<WrappedForm />);
      const option = await screen.findByTestId("GEAreaSearch.Area-option-X1");
      expect(option).toBeInTheDocument();
    });

    test("falls back to default quarter range when systemInfo missing quarter fields", async () => {
      axiosMock.onGet("/api/systemInfo").reply(200, {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: null,
        endQtrYYYYQ: null,
      });

      render(<WrappedForm />);

      await waitFor(() => {
        // default values are used
        expect(screen.getByLabelText("Quarter").value).toBe("20221");
      });
    });

    test("handles empty areas gracefully", () => {
      useBackendSpy.mockReturnValue({
        data: undefined,
        _status: "success",
        _error: null,
      });
      render(<WrappedForm />);
      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect.value).toBe("ALL"); // fallback option
    });

    test("handles empty areas array gracefully", async () => {
      axiosMock.onGet("/api/public/generalEducationInfo").reply(200, []);

      getItemSpy.mockImplementation((key) => {
        if (key === "GEAreaSearch.Quarter") return "20221";
        if (key === "GEAreaSearch.Area") return null;
        return null;
      });

      render(<WrappedForm />);

      await waitFor(() => {
        const areaSelect = screen.getByLabelText("General Education Area");
        expect(areaSelect.children.length).toBe(1); // Only ALL
        expect(areaSelect.value).toBe("ALL");
      });

      expect(screen.getByTestId("GEAreaSearch.Status")).toHaveTextContent(
        "Searching for ALL in 20221"
      );
    });

    test("handles undefined systemInfo gracefully", () => {
      const useSystemInfoSpy = vi
        .spyOn(systemInfoModule, "useSystemInfo")
        .mockReturnValue({ data: undefined });

      render(<WrappedForm />);
      const quarterSelect = screen.getByLabelText("Quarter");
      expect(quarterSelect.value).toBe("20221"); // fallback
      useSystemInfoSpy.mockRestore();
    });

    test("submit button calls fetchJSON with correct args and sets local storage", async () => {
      const fetchJSONSpy = vi.fn();
      render(<WrappedForm fetchJSON={fetchJSONSpy} />);

      // wait for areas
      await screen.findByTestId("GEAreaSearch.Area-option-A1");

      // choose quarter and area
      userEvent.selectOptions(screen.getByLabelText("Quarter"), "20212");
      userEvent.selectOptions(
        screen.getByLabelText("General Education Area"),
        "A1",
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));
      expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
        quarter: "20212",
        area: "A1",
      });

      expect(useBackendSpy).toHaveBeenCalledWith(
        ["/api/public/generalEducationInfo"],
        { method: "GET", url: "/api/public/generalEducationInfo" },
        [],
      );
      expect(getItemSpy).toHaveBeenCalledWith("GEAreaSearch.Quarter");
      expect(getItemSpy).toHaveBeenCalledWith("GEAreaSearch.Area");

      expect(setItemSpy).toHaveBeenCalledWith("GEAreaSearch.Quarter", "20212");
      expect(setItemSpy).toHaveBeenCalledWith("GEAreaSearch.Area", "A1");
    });
  });
});
