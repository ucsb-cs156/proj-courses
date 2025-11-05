import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

vi.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => ({ data: {} }),
}));

describe("GeneralEducationSearchPage tests", () => {
  test("renders without crashing and shows placeholder text", () => {
    render(
      <MemoryRouter>
        <GeneralEducationSearchPage />
      </MemoryRouter>,
    );

    const heading = screen.getByText(/GE Search coming soon!/i);
    expect(heading).toBeInTheDocument();
  });
});
