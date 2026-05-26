import { vi } from "vitest";
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { QueryClient, QueryClientProvider } from "react-query";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";
import { BrowserRouter as Router } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

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
    vi.clearAllMocks();

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

  test("useBackendMutation is wired with query invalidation key", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddToScheduleModal
          quarter={quarter}
          onAdd={mockOnAdd}
          schedules={[]}
        />
      </QueryClientProvider>,
    );

    expect(useBackendMutation).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
      ["/api/personalschedules/all"],
    );
  });

  test("onSuccess and onError work as expected", async () => {
    const section = "test-section";
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={[]}
            section={section}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add to Schedule")).toBeInTheDocument();

    const [, callbacks] = useBackendMutation.mock.lastCall;
    const { onSuccess, onError } = callbacks;

    const mockData = { id: 99, name: "Test Schedule" };
    onSuccess(mockData);
    expect(toast).toHaveBeenCalledWith('Schedule "Test Schedule" Created');
    expect(mockOnAdd).toHaveBeenCalledWith(section, 99);
    await waitFor(() => {
      expect(screen.queryByText("Add to Schedule")).not.toBeInTheDocument();
    });

    const mockError = { response: { data: { message: "Stub Error" } } };
    onError(mockError);
    expect(toast).toHaveBeenCalledWith("Error: Stub Error");
  });

  test("has correct inline styles for create button", () => {
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
    const createBtn = screen.getByText("[Create Personal Schedule]");

    expect(createBtn).toHaveStyle("color: rgb(0, 123, 255)");
    expect(createBtn.style.backgroundColor).toBe("transparent");
    expect(createBtn.style.borderStyle).toBe("none");
    expect(createBtn.style.verticalAlign).toBe("baseline");
    expect(createBtn.style.textDecoration).toContain("underline");
  });

  test("shows no-schedules message with formatted quarter", () => {
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
      screen.getByTestId("AddToScheduleModal-no-schedules"),
    ).toHaveTextContent("There are no personal schedules for S24.");
  });

  test("formats the timeString correctly in auto-create mode", () => {
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

    const text = screen.getByText(/New Schedule:/).textContent;
    expect(text).toMatch(
      /[A-Z][a-z]{2} \d{1,2}, \d{1,2}:\d{2}[\s\u202F]?(AM|PM) Schedule/,
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
    expect(screen.getByText(/New Schedule:/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("Add to Schedule")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add"));
    expect(screen.queryByText(/New Schedule:/)).not.toBeInTheDocument();
    expect(screen.getByText("[Create Personal Schedule]")).toBeInTheDocument();
  });

  test("shows schedule selector when schedules exist for the quarter", () => {
    const schedules = [{ id: 1, name: "Plan A", quarter: "20242" }];
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={schedules}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByLabelText("Select Schedule")).toBeInTheDocument();
    expect(
      screen.queryByText("[Create Personal Schedule]"),
    ).not.toBeInTheDocument();
  });

  test("switches to auto-create mode when Create Personal Schedule is clicked", () => {
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
    expect(screen.getByText("[Create Personal Schedule]")).toBeInTheDocument();

    fireEvent.click(screen.getByText("[Create Personal Schedule]"));
    expect(
      screen.queryByText("[Create Personal Schedule]"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/New Schedule:/)).toBeInTheDocument();
  });

  test("calls handleModalSave when save is clicked in normal mode with selection", async () => {
    const schedules = [{ id: 1, name: "Plan A", quarter: "20242" }];
    const section = "test-section";
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal
            quarter={quarter}
            onAdd={mockOnAdd}
            schedules={schedules}
            section={section}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(screen.getByLabelText("Select Schedule")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(section, 1);
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test("calls mutation.mutate with correct initial state when auto-creating", () => {
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

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).not.toHaveBeenCalled();
    const mutateArgs = mockMutate.mock.calls[0][0];

    expect(mutateArgs.description).toBe("Auto-generated schedule");
    expect(mutateArgs.name).toMatch(/Schedule/);
    expect(mutateArgs.quarter).toBe(quarter);
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

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent("Creating...");
  });

  test("renders 'Save Changes' when mutation is not loading", () => {
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

    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent("Save Changes");
  });
});
