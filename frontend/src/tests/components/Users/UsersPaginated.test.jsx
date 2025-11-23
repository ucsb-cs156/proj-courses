import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import usersFixtures from "fixtures/usersFixtures";
import UsersPaginated from "main/components/Users/UsersPaginated";

describe("UsersPaginated tests", () => {
  test("renders without crashing for empty table", () => {
    const mockOnPageChange = vi.fn();
    render(
      <UsersPaginated
        users={[]}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />,
    );
  });

  test("renders without crashing for three users", () => {
    const mockOnPageChange = vi.fn();
    render(
      <UsersPaginated
        users={usersFixtures.threeUsersPage.content}
        totalPages={usersFixtures.threeUsersPage.totalPages}
        onPageChange={mockOnPageChange}
      />,
    );
  });

  test("displays column headers correctly", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    render(
      <UsersPaginated
        users={content}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    // Verify specific header text content to catch mutations
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("displays users correctly in the table", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    render(
      <UsersPaginated
        users={content}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    const testId = "UsersPaginated";

    // Check first user's data
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-givenName`),
    ).toHaveTextContent("Phill");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-familyName`),
    ).toHaveTextContent("Conrad");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-email`),
    ).toHaveTextContent("phtcon@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-admin`),
    ).toHaveTextContent("true");

    // Check second user's data
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-admin`),
    ).toHaveTextContent("false");
  });

  test("calls onPageChange when pagination button is clicked", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    render(
      <UsersPaginated
        users={content}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    // Click page 2
    const page2Button = screen.getByTestId("OurPagination-2");
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("pagination controls are visible with multiple pages", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    render(
      <UsersPaginated
        users={content}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    // Check that pagination controls exist
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();
  });

  test("renders correctly with single page", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    render(
      <UsersPaginated
        users={content}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    // When there's only one page, we should still see pagination but limited options
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
  });

  test("table container has proper width styling", () => {
    const mockOnPageChange = vi.fn();
    const { content } = usersFixtures.threeUsersPage;

    const { container } = render(
      <UsersPaginated
        users={content}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    // Find the container div with width styling
    const styledDiv = container.querySelector("[style]");
    expect(styledDiv).toHaveStyle({ width: "100%" });
  });
});
