import { render, screen } from "@testing-library/react";
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

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

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

  test("Has the expected column headers and content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable
            personalSections={personalSectionsFixtures.threePersonalSections}
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
    ];
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
    const testId = "PersonalSectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
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
  });
});
