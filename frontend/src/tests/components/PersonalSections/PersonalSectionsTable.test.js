import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";

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

describe("PersonalSectionsTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "PersonalSectionsTable";

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={[]}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={[]}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={[]}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Course ID",
      "Enroll Code",
      "Section",
      "Title",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Delete",
    ];

    expectedHeaders.forEach((headerText) => {
      const headers = screen.getAllByText(headerText);
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  test("Has the expected content in the first row", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = [
      "courseId",
      "classSections[0].enrollCode",
      "classSections[0].section",
      "title",
      "enrolled",
      "location",
      "classSections[0].timeLocations[0].days",
      "time",
      "instructor",
    ];

    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseId`),
    ).toHaveTextContent("ECE 1A");
    expect(
      screen.getByTestId(
        `${testId}-cell-row-0-col-classSections[0].enrollCode`,
      ),
    ).toHaveTextContent("12583");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-classSections[0].section`),
    ).toHaveTextContent("0100");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("COMP ENGR SEMINAR");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-location`),
    ).toHaveTextContent("BUCHN 1930");
    expect(
      screen.getByTestId(
        `${testId}-cell-row-0-col-classSections[0].timeLocations[0].days`,
      ),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("WANG L C");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-instructor`),
    ).toHaveTextContent("STEPHANSON B, BUCKWALTER J");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("renders delete button for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(3); // Assuming there are 3 rows
  });

  test("renders delete button for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(3); // Assuming there are 3 rows
  });

  test("Delete button is rendered in each row", async () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButtons = screen.getAllByTestId(/Delete-button/i);
    expect(deleteButtons.length).toBe(3); // Assuming there are 3 rows
    deleteButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("btn-danger");
    });
  });

  personalSectionsFixtures.threePersonalSections.forEach((section, index) => {
    test(`Delete button is present for row ${index}`, async () => {
      const currentUser = currentUserFixtures.userOnly;

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSectionsTable
              personalSections={personalSectionsFixtures.threePersonalSections}
              currentUser={currentUser}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const deleteButton = await screen.findByTestId(
        `${testId}-cell-row-${index}-col-Delete-button`,
      );
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
    });
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });
});
