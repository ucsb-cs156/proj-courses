import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import SectionSearchesIndexPageNotLoggedIn from "main/pages/SectionSearches/SectionSearchesIndexPageNotLoggedIn";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

vi.mock("main/utils/currentUser", async () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const axiosMock = new AxiosMockAdapter(axios);
describe("SectionSearchesIndexPageNotLoggedIn tests", () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB section search api correctly with 1 section response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/primaries")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20222",
      dept: "ANTH",
      level: "G",
    });

    const expectedFirstRow = screen.getByTestId(
      "SectionsTable-cell-row-0-col-courseId",
    );
    expect(expectedFirstRow).toBeInTheDocument();
    expect(expectedFirstRow).toHaveTextContent("MATH 2A");
  });

  test("displays 'No sections found' message when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/primaries").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-ANTH";

    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
      expect(
        screen.queryByText(
          /No sections were found with the specified criteria./i,
        ),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /No sections were found with the specified criteria./i,
        ),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("CMPSC")).not.toBeInTheDocument();
  });

  test("does not display 'No sections found' message before search is performed", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Subject Area")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        /No sections were found with the specified criteria./i,
      ),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  });

  test("does not display 'No sections found' message while loading", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/primaries").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, []]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        /No sections were found with the specified criteria./i,
      ),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          /No sections were found with the specified criteria./i,
        ),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  });

  test("displays loading message while search is in progress", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/primaries").reply(() => {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve([200, primaryFixtures.f24_math_lowerDiv]),
          100,
        );
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Course ID/i)).not.toBeInTheDocument();
    expect(screen.queryByText("MATH 2A")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("MATH 2A")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
    expect(screen.getByText(/Course ID/i)).toBeInTheDocument();
  });

  test("displays course table when search returns results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/primaries")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("MATH 2A")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        /No sections were found with the specified criteria./i,
      ),
    ).not.toBeInTheDocument();

    expect(screen.getByText(/Course ID/i)).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  test("does not display BasicCourseTable when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/primaries").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /No sections were found with the specified criteria./i,
        ),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Course ID/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });
});
