import { render, screen } from "@testing-library/react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

describe("GeneralEducationSearchPage tests", () => {
  test("renders without crashing and shows placeholder text", () => {
    render(<GeneralEducationSearchPage />);
    const heading = screen.getByText(/GE Search coming soon!/i);
    expect(heading).toBeInTheDocument();
  });
});
