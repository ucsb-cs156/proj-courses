import { fireEvent, waitFor, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

//import { coursesFixtures } from "fixtures/pscourseFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
        }),
        Navigate: (x) => { mockNavigate(x); return null; },
    };
});

describe("PersonalSchedulesEditPage tests", () => {

  describe("when the backend doesn't return data", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
          axiosMock.reset();
          axiosMock.resetHistory();
          axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
          axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
          axiosMock.onGet("/api/personalschedules", { params: { id: 1 } }).timeout();
      });

      const queryClient = new QueryClient();
      test("renders header but table is not present", async () => {

          const restoreConsole = mockConsole();

          render(
              <QueryClientProvider client={queryClient}>
                  <MemoryRouter>
                      <PersonalSchedulesEditPage />
                  </MemoryRouter>
              </QueryClientProvider>
          );
          await screen.findByText("Edit Personal Schedule");
          expect(screen.queryByTestId("PersonalSchedule-name")).not.toBeInTheDocument();
          restoreConsole();
      });
  });

  describe("tests where backend is working normally", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
          axiosMock.reset();
          axiosMock.resetHistory();
          axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
          axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
          axiosMock.onGet("/api/personalschedules", { params: { id: 1 } }).reply(200, {
              id: 1,
              name: "TestName",
              description: "TestDescription",
              quarter: "W08"
          });
          axiosMock.onPut('/api/personalschedules').reply(200, {
              id: 1,
              name: "TestName6",
              description: "TestDescription6",
              quarter: "W08",
          });
      });

      const queryClient = new QueryClient();
      test("renders without crashing", () => {
        axiosMock.onGet("/api/personalschedules").reply(200, []);
          render(
              <QueryClientProvider client={queryClient}>
                  <MemoryRouter>
                      <PersonalSchedulesEditPage />
                  </MemoryRouter>
              </QueryClientProvider>
          );
      });

      test("Is populated with the data provided", async () => {
          render(
              <QueryClientProvider client={queryClient}>
                  <MemoryRouter>
                      <PersonalSchedulesEditPage />
                  </MemoryRouter>
              </QueryClientProvider>
          );

          await screen.findByTestId("PersonalScheduleForm-id");

          const idField = screen.getByTestId("PersonalScheduleForm-id");
          const nameField = screen.getByTestId("PersonalScheduleForm-name");
          const descriptionField = screen.getByTestId(
            "PersonalScheduleForm-description",
          );
         // const quarterField = document.querySelector(
           // "#PersonalScheduleForm-quarter",
          //);
          const quarterField = screen.getByTestId("PersonalScheduleForm-quarter");
          const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

          expect(idField).toBeInTheDocument();
          expect(idField).toHaveValue("1");
          expect(nameField).toBeInTheDocument();
          expect(nameField).toHaveValue("TestName");
          expect(descriptionField).toBeInTheDocument();
          expect(descriptionField).toHaveValue("TestDescription");
          expect(quarterField).toBeInTheDocument();

          expect(submitButton).toHaveTextContent("Update");

          fireEvent.change(nameField, { target: { value: "TestName6" } });
          fireEvent.change(descriptionField, { target: { value: "TestDescription6" } });
          fireEvent.click(submitButton);

          await waitFor(() => expect(mockToast).toBeCalled());
          expect(mockToast).toBeCalledWith("PersonalSchedule Updated - id: 1 name: TestName6");

          expect(mockNavigate).toBeCalledWith({ "to": "/personalschedules/list" });

          expect(axiosMock.history.put.length).toBe(1); // times called
          expect(axiosMock.history.put[0].params).toEqual({ id : 1 });
          expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
              id: 1,
              name: "TestName6",
              description: "TestDescription6",
              quarter: "W08"
          })); // posted object


      });

      test("Changes when you click Update", async () => {
          render(
              <QueryClientProvider client={queryClient}>
                  <MemoryRouter>
                      <PersonalSchedulesEditPage />
                  </MemoryRouter>
              </QueryClientProvider>
          );

          await screen.findByTestId("PersonalScheduleForm-id");

          const idField = screen.getByTestId("PersonalScheduleForm-id");
          const nameField = screen.getByTestId("PersonalScheduleForm-name");
          const descriptionField = screen.getByTestId(
            "PersonalScheduleForm-description",
          );
         // const quarterField = document.querySelector(
           // "#PersonalScheduleForm-quarter",
          //);
          const quarterField = screen.getByTestId("PersonalScheduleForm-quarter");

          const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

          expect(idField).toBeInTheDocument();
          expect(idField).toHaveValue("1");
          expect(nameField).toBeInTheDocument();
          expect(nameField).toHaveValue("TestName");
          expect(descriptionField).toBeInTheDocument();
          expect(descriptionField).toHaveValue("TestDescription");
          expect(quarterField).toBeInTheDocument();

          fireEvent.change(nameField, { target: { value: "TestName6" } });
          fireEvent.change(descriptionField, { target: { value: "TestDescription6" } });

          fireEvent.click(submitButton);

          await waitFor(() => expect(mockToast).toBeCalled());
          expect(mockToast).toBeCalledWith("PersonalSchedule Updated - id: 1 name: TestName6");
          expect(mockNavigate).toBeCalledWith({ "to": "/personalschedules/list" });
          }); // posted object

      });


  });
