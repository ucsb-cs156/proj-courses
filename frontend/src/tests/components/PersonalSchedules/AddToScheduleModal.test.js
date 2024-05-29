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
    mockOnAdd = jest.fn();
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal quarter={quarter} onAdd={mockOnAdd} />
      </QueryClientProvider>,
    );
  });

  test("opens and closes the modal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal quarter={quarter} onAdd={mockOnAdd} />
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
          <AddToScheduleModal quarter={quarter} onAdd={mockOnAdd} />
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

  // test("displays correct message when no schedules found initially", () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Router>
  //         <AddToScheduleModal
  //           quarter={quarter}
  //           onAdd={mockOnAdd}
  //           section={null}
  //         />
  //       </Router>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText("Add"));

  //   expect(screen.getByText("There are no personal schedules for S24.")).toBeInTheDocument();
  //   expect(screen.getByText("[Create Personal Schedule]")).toHaveAttribute(
  //     "href",
  //     "/personalschedules/create",
  //   );
  // });

  test("displays correct message when no schedules found", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal quarter={quarter} onAdd={mockOnAdd} />
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
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockOnAdd).toHaveBeenCalledWith("Stryker was here!", "");
  });

  // jest.mock(
  //   "main/components/PersonalSchedules/PersonalScheduleSelector",
  //   () => {
  //     return ({ setHasSchedules }) => {
  //       setHasSchedules(false);
  //       return null;
  //     };
  //   },
  // );

  // test("displays correct message when no schedules found on initial render", () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Router>
  //         <AddToScheduleModal
  //           quarter={quarter}
  //           onAdd={mockOnAdd}
  //           section={null}
  //         />
  //       </Router>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText("Add"));

  //   expect(screen.getByText("There are no personal schedules for S24.")).toBeInTheDocument();
  //   expect(screen.getByText("[Create Personal Schedule]")).toHaveAttribute(
  //     "href",
  //     "/personalschedules/create",
  //   );
  // });
});
