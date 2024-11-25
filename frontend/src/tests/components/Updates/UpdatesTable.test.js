import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import UpdatesTable from "main/components/Updates/UpdatesTable.js";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { updatesFixtures } from "fixtures/updatesFixtures.js";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockedMutate = jest.fn();

jest.mock("main/utils/useBackend", () => ({
  ...jest.requireActual("main/utils/useBackend"),
  useBackendMutation: () => ({ mutate: mockedMutate }),
}));

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

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", async () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesTable
            updates={updatesFixtures.threeUpdates}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

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
    ).toHaveTextContent("CMPSC");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W21");
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
  });
});
