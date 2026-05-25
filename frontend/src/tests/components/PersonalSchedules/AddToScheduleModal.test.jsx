import { vi } from "vitest";
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { QueryClient, QueryClientProvider } from "react-query";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";
import { BrowserRouter as Router } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";

vi.mock("main/utils/useBackend");
vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

const queryClient = new QueryClient();

describe("AddToScheduleModal", () => {
  const quarter = "20242";
  let mockOnAdd;
  let mockMutate;

  beforeEach(() => {
    mockOnAdd = vi.fn();
    mockMutate = vi.fn();

    useBackendMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
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

  test("calls onAdd when save is clicked in normal mode", () => {
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
        if (setHasSchedules) setHasSchedules(false);
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

    expect(screen.getByText("[Create Personal Schedule]")).toBeInTheDocument();
    expect(screen.getByText("[Create Personal Schedule]").tagName).toBe(
      "BUTTON",
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

  test("switches to auto-create mode when [Create Personal Schedule] is clicked", () => {
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
    fireEvent.click(screen.getByText("[Create Personal Schedule]"));

    expect(screen.getByText(/New Schedule:/)).toBeInTheDocument();
    expect(screen.getByText(/will be created\./)).toBeInTheDocument();
  });

  test("calls mutation.mutate when Save Changes is clicked in auto-create mode", () => {
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
    fireEvent.click(screen.getByText("[Create Personal Schedule]"));
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockMutate).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Auto-generated schedule",
        quarter: quarter,
      }),
    );
  });

  test("resets to normal mode when modal is closed and reopened", async () => {
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
    fireEvent.click(screen.getByText("[Create Personal Schedule]"));

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("Add to Schedule")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add"));
    expect(
      screen.getByText("There are no personal schedules for S24."),
    ).toBeInTheDocument();
  });

  test("onSuccess and onError work as expected", () => {
    const section = "test-section";
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal
          quarter={quarter}
          onAdd={mockOnAdd}
          schedules={[]}
          section={section}
        />
      </QueryClientProvider>,
    );

    const [, callbacks] = useBackendMutation.mock.lastCall;
    const { onSuccess, onError } = callbacks;

    const mockData = { id: 99, name: "Test Schedule" };
    onSuccess(mockData);
    expect(mockOnAdd).toHaveBeenCalledWith(section, 99);

    const mockError = { response: { data: { message: "Stub Error" } } };
    onError(mockError);
  });

  test("objectToAxiosParams works as expected", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal
          quarter={quarter}
          onAdd={mockOnAdd}
          schedules={[]}
        />
      </QueryClientProvider>,
    );

    const [objectToAxiosParams] = useBackendMutation.mock.lastCall;
    const mockSchedule = {
      name: "New Schedule",
      description: "Description",
      quarter: "20242",
    };

    const result = objectToAxiosParams(mockSchedule);

    expect(result).toEqual({
      url: "/api/personalschedules/post",
      method: "POST",
      params: {
        name: "New Schedule",
        description: "Description",
        quarter: "20242",
      },
    });
  });

  test("renders 'Creating...' when mutation is loading", () => {
    useBackendMutation.mockReturnValue({
      mutate: vi.fn(),
      isLoading: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal
          quarter={quarter}
          onAdd={mockOnAdd}
          schedules={[]}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    const saveButton = screen.getByTestId(
      "AddToScheduleModal-modal-save-button",
    );

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Creating...");
    expect(saveButton).toBeDisabled();
  });
});
