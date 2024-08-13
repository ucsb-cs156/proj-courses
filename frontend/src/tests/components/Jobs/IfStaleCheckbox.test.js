import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import IfStaleCheckbox from "main/components/Jobs/IfStaleCheckBox";

describe("IfStaleCheckbox tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected content", () => {
    const mockSetIfStale = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IfStaleCheckbox onChange={null} setIfStale={mockSetIfStale} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    checkbox.click(); // needed for coverage of when onChange is null
    expect(screen.getByText(/Update only if stale/)).toBeInTheDocument();
  });

  test("Toggles Correctly", async () => {
    var ifStale = true;
    const setIfStale = (stale) => {
      ifStale = stale;
    };

    const mockOnChange = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IfStaleCheckbox
            ifStale={ifStale}
            setIfStale={setIfStale}
            onChange={mockOnChange}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(ifStale).toBe(true);
    checkbox.click();
    expect(ifStale).toBe(false);
    checkbox.click();
    expect(ifStale).toBe(true);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });
});
