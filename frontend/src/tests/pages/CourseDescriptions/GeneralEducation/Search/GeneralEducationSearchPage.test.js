import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

jest.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({ data: { loggedIn: false } }),
  useLogout: () => ({ mutate: jest.fn() }),
}));

jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => ({ data: {} }),
}));

describe("GeneralEducationSearchPage tests", () => {
  test("renders without crashing and shows placeholder text", () => {
    render(
      <MemoryRouter>
        <GeneralEducationSearchPage />
      </MemoryRouter>
    );

    const heading = screen.getByText(/GE Search coming soon!/i);
    expect(heading).toBeInTheDocument();
  });
});
