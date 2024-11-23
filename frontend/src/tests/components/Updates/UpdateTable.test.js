import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import UpdateTable from "main/components/Updates/UpdateTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { updateFixtures } from "fixtures/updateFixtures";

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

describe("UpdateTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdateTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdateTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdateTable updates={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", async () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdateTable
            updates={updateFixtures.threeUpdates}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

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
    const testId = "UpdateTable";

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
    ).toHaveTextContent("EARTH");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W23");
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
    ).toHaveTextContent("2022-10-21T11:39:10");
  });
});
