import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RateLimitedIPsTable from "main/components/RateLimitedIPs/RateLimitedIPsTable";
import rateLimitedIPFixtures from "fixtures/rateLimitedIPFixtures";

describe("RateLimitedIPsTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty list", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RateLimitedIPsTable rateLimitedIPs={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders correctly for three rate-limited IPs", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RateLimitedIPsTable
            rateLimitedIPs={rateLimitedIPFixtures.threeIPs}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testid = "RateLimitedIPsTable";

    // Check column headers by text content
    const expectedHeaders = ["IP Address", "Request Count", "Last Request At"];
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(
      await screen.findByTestId(`${testid}-header-ipAddress`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-requestCount`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-Last Request At`),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-ipAddress`),
    ).toHaveTextContent("192.168.1.1");
    expect(screen.getByRole("link", { name: "192.168.1.1" })).toHaveAttribute(
      "href",
      "https://tools.keycdn.com/geo?host=192.168.1.1",
    );
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-requestCount`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-ipAddress`),
    ).toHaveTextContent("10.0.0.1");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-requestCount`),
    ).toHaveTextContent("12");

    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-ipAddress`),
    ).toHaveTextContent("172.16.0.5");
    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-requestCount`),
    ).toHaveTextContent("1");
  });
});
