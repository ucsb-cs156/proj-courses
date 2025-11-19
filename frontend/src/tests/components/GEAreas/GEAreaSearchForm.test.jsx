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

const makeLocalStorageMock = () => {
  let store = {};

  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

const localStorageMock = makeLocalStorageMock();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

let axiosMock;
let useBackendSpy;

describe("GEAreaSearchForm tests", () => {
  describe("GEAreaSearchForm tests with healthy backend", () => {
    const queryClient = new QueryClient();
    const addToast = vi.fn();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();

      vi.clearAllMocks();

      vi.spyOn(console, "error").mockImplementation(() => {});

      localStorageMock.clear();
      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, { loggedIn: true, username: "testuser" });
      axiosMock.onGet("/api/systemInfo").reply(200, {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20211",
        endQtrYYYYQ: "20214",
      });

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

      useBackendSpy = vi.spyOn(useBackend, "useBackend");
    });

    afterEach(() => {
      vi.clearAllMocks();
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
      localStorage.setItem("GEAreaSearch.Quarter", "20213");
      localStorage.setItem("GEAreaSearch.Area", "B");

      render(<WrappedForm />);

      const quarterSelect = screen.getByLabelText("Quarter");
      expect(quarterSelect).toBeInTheDocument();

      await waitFor(() => {
        expect(quarterSelect.value).toBe("20213");
      });

      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect).toBeInTheDocument();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        "GEAreaSearch.Quarter",
      );
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        "GEAreaSearch.Area",
      );

      expect(screen.getByTestId("GEAreaSearch.Status").textContent).toContain(
        "B",
      );
    });

    test("selecting quarter updates state and writes to localStorage", async () => {
      render(<WrappedForm />);

      const quarterSelect = screen.getByLabelText("Quarter");
      userEvent.selectOptions(quarterSelect, "20212");

      expect(quarterSelect.value).toBe("20212");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "GEAreaSearch.Quarter",
        "20212",
      );
    });

    test("when local state for area is empty, we get ALL", async () => {
      localStorage.setItem("GEAreaSearch.Quarter", "20212");

      render(<WrappedForm />);

      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect.value).toBe("ALL");

      expect(screen.getByTestId("GEAreaSearch.Status")).toHaveTextContent(
        "Searching for ALL",
      );
    });

    test("when local state for quarter is empty, we default to first quarter", async () => {
      localStorage.setItem("GEAreaSearch.Area", "B");

      render(<WrappedForm />);

      const quarterSelect = screen.getByLabelText("Quarter");
      expect(quarterSelect.value).toBe("20211");

      expect(screen.getByTestId("GEAreaSearch.Status")).toHaveTextContent(
        "Searching for B",
      );
    });

    test("selecting GE area updates state", async () => {
      render(<WrappedForm />);

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

      const areaSelect = screen.getByLabelText("General Education Area");
      userEvent.selectOptions(areaSelect, "B");
      expect(areaSelect.value).toBe("B");
    });

    test("submit button calls fetchJSON with correct args and sets local storage", async () => {
      const fetchJSONSpy = vi.fn();

      render(<WrappedForm fetchJSON={fetchJSONSpy} />);

      await screen.findByTestId("GEAreaSearch.Area-option-A1");

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

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "GEAreaSearch.Quarter",
        "20212",
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "GEAreaSearch.Area",
        "A1",
      );
    });

    test("renders with fallback values when systemInfo is undefined", async () => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, {
        loggedIn: true,
        username: "testuser",
      });
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
      ]);

      const useSystemInfoSpy = vi.spyOn(systemInfoModule, "useSystemInfo");
      useSystemInfoSpy.mockReturnValue({ data: undefined });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GEAreaSearchForm fetchJSON={vi.fn()} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(
        await screen.findByTestId("GEAreaSearch.Quarter-option-0"),
      ).toHaveValue("20211");
      expect(
        await screen.findByTestId("GEAreaSearch.Quarter-option-3"),
      ).toHaveValue("20214");

      useSystemInfoSpy.mockRestore();
    });

    test("renders with fallback values when start/end quarters are null", async () => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, {
        loggedIn: true,
        username: "testuser",
      });

      axiosMock.onGet("/api/systemInfo").reply(200, {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: null,
        endQtrYYYYQ: null,
      });

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
      ]);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <GEAreaSearchForm fetchJSON={vi.fn()} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(
        await screen.findByTestId("GEAreaSearch.Quarter-option-0"),
      ).toHaveValue("20211");
      expect(
        await screen.findByTestId("GEAreaSearch.Quarter-option-3"),
      ).toHaveValue("20214");
    });
  });
});
