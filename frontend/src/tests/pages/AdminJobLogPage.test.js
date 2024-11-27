import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminJobLogPage from "main/pages/Admin/AdminJobLogPage";
import { useBackend } from "main/utils/useBackend";

jest.mock("main/utils/useBackend");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("AdminJobLogPage tests", () => {
  const queryClient = new QueryClient();

  test("renders the AdminJobLogPage with back button and header", async () => {
    useBackend.mockReturnValue({
      data: "Sample job log content",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/1"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<AdminJobLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Back to Job List")).toBeInTheDocument();
    expect(screen.getByText("Job Logs for Job 1")).toBeInTheDocument();
  });

  test("displays job logs when data is available", async () => {
    useBackend.mockReturnValue({
      data: "Sample job log content",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/1"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<AdminJobLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Sample job log content")).toBeInTheDocument()
    );
  });

  test("displays 'Loading...' text when job logs are not yet available", async () => {
    useBackend.mockReturnValue({
      data: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/1"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<AdminJobLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Ensure that loading text is shown when no data is returned
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("clicking 'Back to Job List' navigates back to /admin/jobs", async () => {
    useBackend.mockReturnValue({
      data: "Sample job log content",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/1"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<AdminJobLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const backButton = screen.getByText("Back to Job List");
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/jobs");
  });
});
