import React from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

vi.mock("main/components/GEAreas/GEAreaSearchForm", () => ({
  __esModule: true,
  default: () => <div data-testid="ge-area-search-form" />,
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
  test("renders without crashing and shows the GE search layout", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/UCSB General Education Search/i)).toBeInTheDocument();
    expect(screen.getByTestId("ge-area-search-form")).toBeInTheDocument();
  });
});
