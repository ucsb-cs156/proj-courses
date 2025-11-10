import { render, screen } from "@testing-library/react";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost";

describe("AppNavbarLocalhost tests", () => {
  test("renders correctly", async () => {
    render(<AppNavbarLocalhost url={"http://localhost:3000"} />);

    expect(screen.getByText(/Running on/)).toHaveTextContent(
      "Running on http://localhost:3000 with no backend.You probably want http://localhost:8080 instead.",
    );
  });
});
