import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CSVDownloadsPage from "main/pages/CSV/CSVDownloadsPage";

describe("CSVDownloadsPage tests", () => {
  const originalLocation = window.location;

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
  });

  const renderPage = () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CSVDownloadsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  const mockLocationAssign = () => {
    const assignMock = vi.fn();
    delete window.location;
    window.location = Object.assign(new URL("http://localhost:3000"), {
      assign: assignMock,
    });
    return assignMock;
  };

  test("renders correctly", async () => {
    renderPage();

    expect(await screen.findByText("CSV Downloads")).toBeInTheDocument();
  });

  test("quarter input must be exactly five digits to enable by-quarter download", async () => {
    renderPage();

    const quarterInput = screen.getAllByLabelText("Quarter (yyyyq)")[0];
    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];

    expect(quarterInput).toHaveValue("");
    expect(byQuarterButton).toBeDisabled();

    fireEvent.change(quarterInput, { target: { value: "20241x" } });
    expect(quarterInput).toHaveValue("20241x");
    expect(byQuarterButton).toBeDisabled();

    fireEvent.change(quarterInput, { target: { value: "x20241" } });
    expect(quarterInput).toHaveValue("x20241");
    expect(byQuarterButton).toBeDisabled();

    fireEvent.change(quarterInput, { target: { value: "20241" } });
    expect(quarterInput).toHaveValue("20241");
    expect(byQuarterButton).not.toBeDisabled();
  });

  test("submitting by-quarter form only downloads when quarter is valid", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    const quarterInput = screen.getAllByLabelText("Quarter (yyyyq)")[0];
    const byQuarterButton = screen.getAllByRole("button", {
      name: "Download CSV",
    })[0];
    const byQuarterForm = byQuarterButton.closest("form");

    fireEvent.change(quarterInput, { target: { value: "20241x" } });
    fireEvent.submit(byQuarterForm);
    expect(assignMock).not.toHaveBeenCalled();

    fireEvent.change(quarterInput, { target: { value: " 20241 " } });
    fireEvent.submit(byQuarterForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/quarter?yyyyq=20241",
    );
  });

  test("submitting by-quarter-and-subject form requires valid quarter and subject", () => {
    const assignMock = mockLocationAssign();
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Download all UCSB classes by Quarter and Subject Area",
      }),
    );

    const allDownloadButtons = screen.getAllByRole("button", {
      name: "Download CSV",
    });
    const byQuarterAndSubjectButton = allDownloadButtons[1];
    const byQuarterAndSubjectForm = byQuarterAndSubjectButton.closest("form");

    const quarterInput = screen.getAllByLabelText("Quarter (yyyyq)")[1];
    const subjectAreaInput = screen.getByLabelText("Subject Area");

    expect(subjectAreaInput).toHaveValue("");
    expect(byQuarterAndSubjectButton).toBeDisabled();

    fireEvent.change(quarterInput, { target: { value: "20241" } });
    expect(byQuarterAndSubjectButton).toBeDisabled();
    fireEvent.submit(byQuarterAndSubjectForm);
    expect(assignMock).not.toHaveBeenCalled();

    fireEvent.change(quarterInput, { target: { value: "20241x" } });
    fireEvent.change(subjectAreaInput, { target: { value: "cmpsc" } });
    expect(byQuarterAndSubjectButton).toBeDisabled();
    fireEvent.submit(byQuarterAndSubjectForm);
    expect(assignMock).not.toHaveBeenCalled();

    fireEvent.change(quarterInput, { target: { value: " 20241 " } });

    fireEvent.change(subjectAreaInput, {
      target: { value: " cmpsc " },
    });

    expect(byQuarterAndSubjectButton).not.toBeDisabled();
    fireEvent.submit(byQuarterAndSubjectForm);

    expect(assignMock).toHaveBeenCalledTimes(1);
    expect(assignMock).toHaveBeenCalledWith(
      "/api/courses/csv/byQuarterAndSubjectArea?yyyyq=20241&subjectArea=CMPSC",
    );
  });
});
