import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import UpdatesTable from "main/components/Updates/UpdatesTable.js";
import { updatesFixtures } from "fixtures/updatesFixtures.js";

describe("UpdatesTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "UpdatesTable";
  const expectedHeaders = [
    "Subject Area",
    "Quarter",
    "Saved",
    "Updated",
    "Errors",
    "Last Update",
  ];
  const expectedFields = [
    "subjectArea",
    "quarter",
    "saved",
    "updated",
    "errors",
    "lastUpdate",
  ];

  test("renders empty table correctly", () => {
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable Update={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers and content", () => {
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable Update={updatesFixtures.threeUpdates} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-subjectArea`),
    ).toHaveTextContent("GRAD W");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("F24");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-saved`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-updated`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-errors`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-lastUpdate`),
    ).toHaveTextContent("2024-11-10T02:37:30.677");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-subjectArea`),
    ).toHaveTextContent("IQB");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-quarter`),
    ).toHaveTextContent("F24");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-saved`),
    ).toHaveTextContent("11");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-updated`),
    ).toHaveTextContent("36");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-errors`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-lastUpdate`),
    ).toHaveTextContent("2024-11-10T02:37:30.467");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-subjectArea`),
    ).toHaveTextContent("W&L CSW");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-quarter`),
    ).toHaveTextContent("F24");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-saved`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-updated`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-errors`),
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-lastUpdate`),
    ).toHaveTextContent("2024-11-10T02:37:26.354");
  });
});
