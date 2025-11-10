import { vi } from "vitest";
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { QueryClient, QueryClientProvider } from "react-query";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";
import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient();

describe("AddToScheduleModal", () => {
  const quarter = "20242";
  let mockOnAdd;

  beforeEach(() => {
    mockOnAdd = vi.fn();
  });

  test("renders button correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal
          quarter={quarter}
          onAdd={mockOnAdd}
          schedules={[]}
        />
      </QueryClientProvider>,
    );
    expect(
      screen.getByTestId("AddToScheduleModal-add-to-schedule-button"),
    ).toBeInTheDocument();
  });

  test("opens and closes the modal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={[]}
          />
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
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={[]}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockOnAdd).toHaveBeenCalled();
  });

  vi.mock("main/components/PersonalSchedules/PersonalScheduleSelector", () => {
    return {
      default: ({ setHasSchedules }) => {
        setHasSchedules(false);
        return null;
      },
    };
  });

  test("displays correct message when no schedules found", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={[]}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));

    expect(
      screen.getByText("There are no personal schedules for S24."),
    ).toBeInTheDocument();
    expect(screen.getByText("[Create Personal Schedule]")).toHaveAttribute(
      "href",
      "/personalschedules/create",
    );
  });

  test("calls onAdd with the correct schedule when save is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            section={"Stryker was here!"}
            schedules={[]}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockOnAdd).toHaveBeenCalledWith("Stryker was here!", "");
  });
});
