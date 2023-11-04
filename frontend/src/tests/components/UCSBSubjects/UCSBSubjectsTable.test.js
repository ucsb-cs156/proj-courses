import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import UCSBSubjectsTable from "main/components/UCSBSubjects/UCSBSubjectsTable";

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

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable
            subjects={ucsbSubjectsFixtures.threeSubjects}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "SubjectCode",
      "SubjectTranslation",
      "DeptCode",
      "CollegeCode",
      "RelatedDeptCode",
      "Inactive",
    ];
    const expectedFields = [
      "subjectCode",
      "subjectTranslation",
      "deptCode",
      "collegeCode",
      "relatedDeptCode",
      "inactive",
    ];
    const testId = "UCSBSubjectsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-subjectCode`),
    ).toHaveTextContent("GEOG");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-subjectCode`),
    ).toHaveTextContent("GER");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable
            subjects={ucsbSubjectsFixtures.threeSubjects}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`UCSBSubjectsTable-cell-row-0-col-subjectCode`),
    ).toHaveTextContent("GEOG");

    const editButton = screen.getByTestId(
      `UCSBSubjectsTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/UCSBSubjects/edit/GEOG"),
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable
            subjects={ucsbSubjectsFixtures.threeSubjects}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`UCSBSubjectsTable-cell-row-0-col-subjectCode`),
    ).toHaveTextContent("GEOG");

    const deleteButton = screen.getByTestId(
      `UCSBSubjectsTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });
});
