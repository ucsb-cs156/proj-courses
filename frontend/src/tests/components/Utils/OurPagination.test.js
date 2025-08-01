import { fireEvent, render, screen } from "@testing-library/react";
import OurPagination, { emptyArray } from "main/components/Utils/OurPagination";

const checkTestIdsInOrder = (testIds) => {
  const links = screen.getAllByTestId(/OurPagination-/);
  expect(links.length).toBe(testIds.length);

  for (var i = 0; i < links.length; i++) {
    expect(screen.getByTestId(testIds[i])).toBe(links[i]);
  }
};

describe("OurPagination tests", () => {
  test("emptyArray returns empty array", () => {
    expect(emptyArray()).toStrictEqual([]);
  });

  test("renders correctly for default values", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination updateActivePage={updateActivePage} />,
    );

     // Expected: 1, 2, 3, 4, 5, ..., 10
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-10",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 5 (less than or equal to 7)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={5} updateActivePage={updateActivePage} />,
    );

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 7 (less than or equal to 7)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={7} updateActivePage={updateActivePage} />,
    );

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-7",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12 (greater than 7), initial state (activePage=1)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    // Expected: 1, 2, 3, 4, 5, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12, activePage = 4", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );

    // Click to page 4
    fireEvent.click(screen.getByTestId("OurPagination-4"));

    // Expected: 1, 2, 3, 4, 5, ..., 12 (activePage < 5)
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12, activePage = 5 (middle range)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    fireEvent.click(screen.getByTestId("OurPagination-5"));
    // Expected: 1, ..., 4, 5, 6, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12, activePage = 8 (middle range, next clicks)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );

    const nextButton = screen.getByTestId("OurPagination-next");
    fireEvent.click(nextButton); // page 2
    fireEvent.click(nextButton); // page 3
    fireEvent.click(nextButton); // page 4
    fireEvent.click(nextButton); // page 5
    // Expected: 1, ..., 4, 5, 6, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
    fireEvent.click(nextButton); // page 6
    // Expected: 1, ..., 5, 6, 7, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-7",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
    fireEvent.click(nextButton); // page 7
    // Expected: 1, ..., 6, 7, 8, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-6",
      "OurPagination-7",
      "OurPagination-8",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
    fireEvent.click(nextButton); // page 8
    // Expected: 1, ..., 7, 8, 9, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-7",
      "OurPagination-8",
      "OurPagination-9",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12, activePage = 9 (near end)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    // Click to page 9 (totalPages - 3)
    // This requires multiple clicks on next or direct jump if available.
    // For simplicity, we'll simulate state by clicking next multiple times
    for (let i = 0; i < 8; i++) {
      // 1 -> 2 -> ... -> 9
      fireEvent.click(screen.getByTestId("OurPagination-next"));
    }
    // Expected: 1, ..., 8, 9, 10, 11, 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-8",
      "OurPagination-9",
      "OurPagination-10",
      "OurPagination-11",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders correctly for totalPages = 12, activePage = 12 (end)", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    fireEvent.click(screen.getByTestId("OurPagination-12"));
    // Expected: 1, ..., 8, 9, 10, 11, 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-8",
      "OurPagination-9",
      "OurPagination-10",
      "OurPagination-11",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("navigation: prev button works correctly", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    // Go to page 5
    fireEvent.click(screen.getByTestId("OurPagination-5"));
    expect(screen.getByTestId("OurPagination-5").parentElement).toHaveClass(
      "active",
    );

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    const prevButton = screen.getByTestId("OurPagination-prev");
    fireEvent.click(prevButton); // Go to page 4

    // Assert that page 4 is now active
    expect(screen.getByTestId("OurPagination-4").parentElement).toHaveClass(
      "active",
    );
    expect(screen.getByTestId("OurPagination-5").parentElement).not.toHaveClass(
      "active",
    );

    // Expected: 1, 2, 3, 4, 5, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("navigation: clicking page 1 from a middle page", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={12} updateActivePage={updateActivePage} />,
    );
    // Go to page 5
    fireEvent.click(screen.getByTestId("OurPagination-5"));
    checkTestIdsInOrder([
      // Page 5
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    fireEvent.click(screen.getByTestId("OurPagination-1"));
    // Expected: 1, 2, 3, 4, 5, ..., 12
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("checks active class on buttons", async () => {
    const updateActivePage = jest.fn();
    render(
      <OurPagination totalPages={5} updateActivePage={updateActivePage} />,
    );

    // Initial state: page 1 is active
    expect(screen.getByTestId("OurPagination-1").parentElement).toHaveClass(
      "active",
    );
    expect(screen.getByTestId("OurPagination-2").parentElement).not.toHaveClass(
      "active",
    );

    fireEvent.click(screen.getByTestId("OurPagination-next")); // page 2

    // After re-render: page 2 should be active. Re-query elements.
    expect(screen.getByTestId("OurPagination-1").parentElement).not.toHaveClass(
      "active",
    );
    expect(screen.getByTestId("OurPagination-2").parentElement).toHaveClass(
      "active",
    );
  });
});
