import { fireEvent, render, screen } from "@testing-library/react";
import OurPagination from "main/components/Utils/OurPagination";

describe("OurPagination tests", () => {
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

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();
  });

  test("renders the correct text for totalPages 10 maxPages 10", async () => {
    // Arrange

    const updateActivePage = jest.fn();

    // Act
    render(<OurPagination maxPages={10} updateActivePage={updateActivePage} />);

    // Assert

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-6")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-7")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-8")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-9")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-10")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();
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

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    const nextButton = screen.getByTestId("OurPagination-next");
    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-left-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    const prevButton = screen.getByTestId("OurPagination-prev");
    fireEvent.click(prevButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    const button1 = screen.getByTestId("OurPagination-1");
    fireEvent.click(button1);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    const button12 = screen.getByTestId("OurPagination-12");
    fireEvent.click(button12);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-left-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-11")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-left-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-8")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-9")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-10")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-12")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();
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

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    const nextButton = screen.getByTestId("OurPagination-next");
    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-right-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-left-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-3")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByTestId("OurPagination-prev")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(
      screen.getByTestId("OurPagination-left-ellipsis"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-4")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-5")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-next")).toBeInTheDocument();
  });
});
