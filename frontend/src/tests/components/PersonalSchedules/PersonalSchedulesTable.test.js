import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

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
          <PersonalSchedulesTable personalSchedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Has the expected colum headers and content for Ordinary User", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "Name","Description","Quarter"];
    const expectedFields = ["id", "name","description","quarter"];
    const testId = "PersonalSchedulesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });
  
  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["id", "Name","Description","Quarter"];
    const expectedFields = ["id", "name","description","quarter"];
    const testId = "PersonalSchedulesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for Ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`PersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1");

    const editButton = screen.getByTestId(`PersonalSchedulesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/personalschedules/edit/1'));
  });
  test("Edit button navigates to the details page for Ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`PersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1");

    const detailsButton = screen.getByTestId(`PersonalSchedulesTable-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    
    fireEvent.click(detailsButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/personalschedules/details/1'));
  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`PersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1");

    const editButton = screen.getByTestId(`PersonalSchedulesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/personalschedules/edit/1'));
  });

  test("Delete button calls delete callback for ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`PersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1");

    const deleteButton = screen.getByTestId(`PersonalSchedulesTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });

  test("Delete button calls delete callback for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesTable personalSchedules={personalScheduleFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`PersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1");

    const deleteButton = screen.getByTestId(`PersonalSchedulesTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });
});
