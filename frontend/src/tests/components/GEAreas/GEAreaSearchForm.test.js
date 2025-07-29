import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";

import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

let axiosMock;


describe("GEAreaSearchForm tests", () => {

  describe("GEAreaSearchForm tests with healthy backend", () => {

    const queryClient = new QueryClient();
    const addToast = jest.fn();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();

      jest.clearAllMocks();
      // Silence console.error
      jest.spyOn(console, "error").mockImplementation(() => { });

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
    });

    afterEach(() => {
      jest.clearAllMocks();
      axiosMock.restore();
    });

    const WrappedForm = (props) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaSearchForm {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    test("renders without crashing", () => {
      render(<WrappedForm />);
      expect(screen.getByLabelText("Quarter")).toBeInTheDocument();
      expect(screen.getByLabelText("General Education Area")).toBeInTheDocument();
    });

    test("selecting quarter updates state", () => {
      render(<WrappedForm />);
      const quarterSelect = screen.getByLabelText("Quarter");
      userEvent.selectOptions(quarterSelect, "20212");
      expect(quarterSelect.value).toBe("20212");
    });

    test("selecting GE area updates state", async () => {
      render(<WrappedForm />);
      // wait for options to load
      await screen.findByTestId("GEAreaSearch.Area-option-A1");

      const areaSelect = screen.getByLabelText("General Education Area");
      userEvent.selectOptions(areaSelect, "B");
      expect(areaSelect.value).toBe("B");
    });

    test("submit button calls fetchJSON with correct args", async () => {
      

      const fetchJSONSpy = jest.fn();
      render(<WrappedForm fetchJSON={fetchJSONSpy} />);

      // wait for areas
      await screen.findByTestId("GEAreaSearch.Area-option-A1");

      // choose quarter and area
      userEvent.selectOptions(screen.getByLabelText("Quarter"), "20213");
      userEvent.selectOptions(
        screen.getByLabelText("General Education Area"),
        "A1",
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));
      expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
        quarter: "20213",
        area: "A1",
      });
    });
  });
  describe("GEAreaSearchForm tests with unhealthy backend", () => {

    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();

      jest.clearAllMocks();
      // Silence console.error
      jest.spyOn(console, "error").mockImplementation(() => { });

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
    });

    afterEach(() => {
      jest.clearAllMocks();
      axiosMock.restore();
    });

    const WrappedForm = (props) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GEAreaSearchForm {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    test("When backend is not responding, the list of options will only contain 'ALL'", async () => {
      axiosMock.onGet("/api/public/generalEducationInfo").timeout();

      const fetchJSONSpy = jest.fn();
      render(<WrappedForm fetchJSON={fetchJSONSpy} />);

      // wait for the form to render
      await screen.findByLabelText("General Education Area");
      const areaSelect = screen.getByLabelText("General Education Area");
      expect(areaSelect).toBeInTheDocument();
      expect(areaSelect.value).toBe("ALL");
      // Check that only the "ALL" option is present
      const allOption = screen.getByTestId("GEAreaSearch.Area-option-all");
      expect(allOption).toBeInTheDocument();
      expect(allOption.value).toBe("ALL");
      expect(areaSelect.options.length).toBe(1); // Only "ALL" should be present
    });
  });
});
