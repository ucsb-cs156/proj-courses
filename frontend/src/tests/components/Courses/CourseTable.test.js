import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CourseTable from "main/components/Courses/CourseTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const mockedMutate = jest.fn();

jest.mock('main/utils/useBackend', () => ({
    ...jest.requireActual('main/utils/useBackend'),
    useBackendMutation: () => ({mutate: mockedMutate})
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Has the expected colum headers and content for Ordinary User", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={coursesFixtures.twoCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "Enrollment Code","Personal Schedule ID"];
    const expectedFields = ["id", "enrollCd","psId"];
    const testId = "CourseTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("25");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("26");

    const deleteButton = screen.getByTestId(`CourseTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });
  
  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={coursesFixtures.twoCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "Enrollment Code","Personal Schedule ID"];
    const expectedFields = ["id", "enrollCd","psId"];
    const testId = "CourseTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("25");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("26");

    const deleteButton = screen.getByTestId(`CourseTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Delete button calls delete callback for ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={coursesFixtures.twoCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`CourseTable-cell-row-0-col-id`)).toHaveTextContent("25");

    const deleteButton = screen.getByTestId(`CourseTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });

  test("Delete button calls delete callback for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={coursesFixtures.twoCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`CourseTable-cell-row-0-col-id`)).toHaveTextContent("25");

    const deleteButton = screen.getByTestId(`CourseTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });
});
