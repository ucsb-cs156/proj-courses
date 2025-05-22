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

  test("renders the correct text for totalPages 5 maxPages 10", async () => {
    // Arrange

    const updateActivePage = jest.fn();

    // Act
    render(
      <OurPagination
        totalPages={5}
        maxPages={10}
        updateActivePage={updateActivePage}
      />,
    );

    // Assert

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

  test("renders the correct text for totalPages 10 maxPages 10", async () => {
    // Arrange

    const updateActivePage = jest.fn();

    // Act
    render(<OurPagination maxPages={10} updateActivePage={updateActivePage} />);

    // Assert
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-6",
      "OurPagination-7",
      "OurPagination-8",
      "OurPagination-9",
      "OurPagination-10",
      "OurPagination-next",
    ]);
  });

  test("renders the correct text for totalPages 12 maxPages 5", async () => {
    // Arrange

    const updateActivePage = jest.fn();

    // Act
    render(
      <OurPagination
        totalPages={12}
        maxPages={5}
        updateActivePage={updateActivePage}
      />,
    );

    // Assert
    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    const nextButton = screen.getByTestId("OurPagination-next");
    fireEvent.click(nextButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    fireEvent.click(nextButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    fireEvent.click(nextButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    const prevButton = screen.getByTestId("OurPagination-prev");
    fireEvent.click(prevButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    const button1 = screen.getByTestId("OurPagination-1");
    fireEvent.click(button1);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    const button12 = screen.getByTestId("OurPagination-12");
    fireEvent.click(button12);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-11",
      "OurPagination-12",
      "OurPagination-next",
    ]);

    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-left-ellipsis",
      "OurPagination-8",
      "OurPagination-9",
      "OurPagination-10",
      "OurPagination-right-ellipsis",
      "OurPagination-12",
      "OurPagination-next",
    ]);
  });

  test("renders the correct text for totalPages 5 maxPages 2", async () => {
    // Arrange

    const updateActivePage = jest.fn();

    // Act
    render(
      <OurPagination
        totalPages={5}
        maxPages={3}
        updateActivePage={updateActivePage}
      />,
    );

    // Assert

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-right-ellipsis",
      "OurPagination-5",
      "OurPagination-next",
    ]);

    const button1 = screen.getByTestId("OurPagination-1");
    expect(button1.parentElement).toHaveClass("active");
    const button2 = screen.getByTestId("OurPagination-2");
    expect(button2.parentElement).not.toHaveClass("active");

    const nextButton = screen.getByTestId("OurPagination-next");
    fireEvent.click(nextButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-right-ellipsis",
      "OurPagination-5",
      "OurPagination-next",
    ]);

    fireEvent.click(nextButton);

    checkTestIdsInOrder([
      "OurPagination-prev",
      "OurPagination-1",
      "OurPagination-2",
      "OurPagination-3",
      "OurPagination-4",
      "OurPagination-5",
      "OurPagination-next",
    ]);

    fireEvent.click(nextButton);
  });

  test("updates active page when currentPage prop changes", () => {
    const updateActivePage = jest.fn();

    const { rerender } = render(
      <OurPagination
        totalPages={5}
        updateActivePage={updateActivePage}
        currentPage={1}
      />,
    );

    // Page 1 should be active
    expect(screen.getByTestId("OurPagination-1").parentElement).toHaveClass(
      "active",
    );

    // Rerender with currentPage=3
    rerender(
      <OurPagination
        totalPages={5}
        updateActivePage={updateActivePage}
        currentPage={3}
      />,
    );

    // Page 3 should now be active
    expect(screen.getByTestId("OurPagination-3").parentElement).toHaveClass(
      "active",
    );
  });
});
