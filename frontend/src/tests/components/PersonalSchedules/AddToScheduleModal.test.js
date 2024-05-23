import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { QueryClient, QueryClientProvider } from "react-query";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";
import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient();

describe("AddToScheduleModal", () => {
  let mockOnAdd;
  let getItemSpy;

  beforeEach(() => {
    mockOnAdd = jest.fn();
    // Define your localQuarter variable
    const localQuarter = "F21";

    // Mock localStorage.getItem
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockReturnValue(localQuarter);
  });

  afterEach(() => {
    // Clean up after each test
    getItemSpy.mockRestore();
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal onAdd={mockOnAdd} />
      </QueryClientProvider>,
    );
  });

  test("opens and closes the modal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Add to Schedule")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("Add to Schedule")).not.toBeInTheDocument();
    });
  });

  test("calls onAdd when save is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockOnAdd).toHaveBeenCalled();
  });

  jest.mock(
    "main/components/PersonalSchedules/PersonalScheduleSelector",
    () => {
      return ({ setHasSchedules }) => {
        setHasSchedules(false);
        return null;
      };
    },
  );

  test("displays correct message when no schedules found", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));

      // Define your quarter variable
      const quarter = "F21";

      // Use the quarter variable in your expect statement
      expect(screen.getByText(`No personal schedules exist for ${quarter}.`)).toBeInTheDocument();    
      expect(screen.getByText("[Create One]")).toHaveAttribute(
          "href",
          "/personalschedules/create",
    );
  });

  test("calls onAdd with the correct schedule when save is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} section={"Stryker was here!"} />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockOnAdd).toHaveBeenCalledWith("Stryker was here!", "");
  });

  jest.mock(
    "main/components/PersonalSchedules/PersonalScheduleSelector",
    () => {
      return ({ setHasSchedules }) => {
        setHasSchedules(false);
        return null;
      };
    },
  );
});
