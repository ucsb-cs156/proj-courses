import React from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import * as useBackend from "main/utils/useBackend";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

vi.mock("main/components/GEAreas/GEAreaSearchForm", () => ({
  __esModule: true,
  default: ({ fetchJSON }) => (
    <div data-testid="ge-area-search-form">
      <button
        type="button"
        onClick={() => fetchJSON(null, { quarter: "20232", area: "A1" })}
      >
        Search GE
      </button>
    </div>
  ),
}));

vi.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false,
}));

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => ({ data: {} }),
}));

describe("GeneralEducationSearchPage tests", () => {
  let queryClient;
  let useBackendMutationSpy;

  beforeEach(() => {
    queryClient = new QueryClient();
    useBackendMutationSpy = vi.spyOn(useBackend, "useBackendMutation");
  });

  afterEach(() => {
    vi.clearAllMocks();
    useBackendMutationSpy.mockRestore();
  });

  const WrappedPage = () => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GeneralEducationSearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );

  test("renders without crashing and shows the GE search layout", () => {
    useBackendMutationSpy.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<WrappedPage />);

    expect(
      screen.getByText(/UCSB General Education Search/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ge-area-search-form")).toBeInTheDocument();
  });

  test("does not show results or no-results before the first search", () => {
    useBackendMutationSpy.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<WrappedPage />);

    expect(
      screen.queryByText(
        /No GE courses were found with the specified criteria/i,
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("GEAreaCoursesTable")).not.toBeInTheDocument();
  });

  test("shows loading indicator when backend mutation is loading", () => {
    useBackendMutationSpy.mockReturnValue({
      isLoading: true,
      mutate: vi.fn(),
    });

    render(<WrappedPage />);

    expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
  });

  test("displays no results message when search returns empty course list", async () => {
    useBackendMutationSpy.mockImplementation(
      (objectToAxiosParams, options) => ({
        isLoading: false,
        mutate: () => options.onSuccess([]),
      }),
    );

    render(<WrappedPage />);

    userEvent.click(screen.getByText("Search GE"));

    expect(
      await screen.findByText(
        /No GE courses were found with the specified criteria/i,
      ),
    ).toBeInTheDocument();
  });

  test("displays course results when search returns courses", async () => {
    useBackendMutationSpy.mockImplementation(
      (objectToAxiosParams, options) => ({
        isLoading: false,
        mutate: () =>
          options.onSuccess([
            {
              quarter: "20232",
              courseId: "MATH 1A",
              title: "Calculus I",
              description: "Intro to calculus",
              generalEducation: ["A1"],
            },
          ]),
      }),
    );

    render(<WrappedPage />);
    userEvent.click(screen.getByText("Search GE"));

    expect(await screen.findByTestId("GEAreaCoursesTable")).toBeInTheDocument();
    expect(
      screen.queryByText(
        /No GE courses were found with the specified criteria/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-courseId"),
    ).toHaveTextContent("MATH 1A");
    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-0-col-generalEducationAreas",
      ),
    ).toHaveTextContent("A1");
  });

  test("objectToAxiosParams converts ALL area to empty string and keeps other values", () => {
    let objectToAxiosParams;
    useBackendMutationSpy.mockImplementation((objectToAxiosParamsParam) => {
      objectToAxiosParams = objectToAxiosParamsParam;
      return { isLoading: false, mutate: vi.fn() };
    });

    render(<WrappedPage />);

    expect(objectToAxiosParams).toBeDefined();
    expect(objectToAxiosParams({ quarter: "20232", area: "ALL" })).toEqual({
      url: "/api/public/primariesge",
      params: { qtr: "20232", area: "" },
    });
    expect(objectToAxiosParams({ quarter: "20232", area: "A1" })).toEqual({
      url: "/api/public/primariesge",
      params: { qtr: "20232", area: "A1" },
    });
  });

  test("initializes useBackendMutation with correct options", () => {
    useBackendMutationSpy.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<WrappedPage />);

    expect(useBackendMutationSpy).toHaveBeenCalledWith(
      expect.any(Function),
      { onSuccess: expect.any(Function) },
      [],
    );
  });
});
