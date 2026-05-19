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
    const expectedHeaders = [
      "IP Address",
      "Host Name",
      "Request Count",
      "Country",
      "City",
      "State",
      "Postal Code",
      "Latitude",
      "Longitude",
      "Last Request At",
    ];
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(
      await screen.findByTestId(`${testid}-header-ipAddress`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testid}-header-hostname`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-requestCount`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testid}-header-country`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testid}-header-city`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testid}-header-state`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-postalCode`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testid}-header-latitude`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-longitude`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testid}-header-Last Request At`),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-ipAddress`),
    ).toHaveTextContent("192.168.1.1");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-hostname`),
    ).toHaveTextContent("dns1.example.com");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-requestCount`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-country`),
    ).toHaveTextContent("United States");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-city`),
    ).toHaveTextContent("Santa Barbara");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-state`),
    ).toHaveTextContent("California");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-postalCode`),
    ).toHaveTextContent("93106");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-latitude`),
    ).toHaveTextContent("34.414");
    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-longitude`),
    ).toHaveTextContent("-119.8489");

    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-ipAddress`),
    ).toHaveTextContent("10.0.0.1");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-hostname`),
    ).toHaveTextContent("dns2.example.com");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-requestCount`),
    ).toHaveTextContent("12");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-country`),
    ).toHaveTextContent("Canada");

    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-ipAddress`),
    ).toHaveTextContent("172.16.0.5");
    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-hostname`),
    ).toHaveTextContent("dns3.example.com");
    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-requestCount`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testid}-cell-row-2-col-country`),
    ).toHaveTextContent("Mexico");
  });
});
