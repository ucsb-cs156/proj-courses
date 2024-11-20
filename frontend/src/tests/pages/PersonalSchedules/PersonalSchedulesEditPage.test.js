import { fireEvent, waitFor, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import userEvent from "@testing-library/user-event";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("PersonalSchedulesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/personalschedules", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Personal Schedule");
      expect(
        screen.queryByTestId("PersonalSchedule-name"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/personalschedules", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          user: {
            id: 1,
            email: "phtcon@ucsb.edu",
            googleSub: "115856948234298493496",
            pictureUrl:
              "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
            fullName: "Phill Conrad",
            givenName: "Phill",
            familyName: "Conrad",
            emailVerified: true,
            locale: "en",
            hostedDomain: "ucsb.edu",
            admin: true,
          },
          description: "My Winter Courses",
          quarter: "20221",
          name: "CS156",
        });
      axiosMock.onPut("/api/personalschedules").reply(200, {
        id: 17,
        user: {
          id: 1,
          email: "phtcon@ucsb.edu",
          googleSub: "115856948234298493496",
          pictureUrl:
            "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
          fullName: "Phill Conrad",
          givenName: "Phill",
          familyName: "Conrad",
          emailVerified: true,
          locale: "en",
          hostedDomain: "ucsb.edu",
          admin: true,
        },
        description: "My Plan for Winter",
        quarter: "20221",
        name: "Winter Courses",
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
        </QueryClientProvider>,
      );
    });

    test("renders 'Back' button", () => {
      const queryClient = new QueryClient();
      axiosMock.onGet(`/api/personalschedules?id=17`).reply(200, []);
      axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, []);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toBeInTheDocument();

      // Optional: Test button functionality
      userEvent.click(backButton);
      // Add your assertions here to ensure that clicking the button triggers the expected action.
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("PersonalScheduleForm-id");

      const idField = screen.getByTestId("PersonalScheduleForm-id");
      const nameField = screen.getByTestId("PersonalScheduleForm-name");
      const descriptionField = screen.getByTestId(
        "PersonalScheduleForm-description",
      );
      const quarterField = screen.getByTestId("PersonalScheduleForm-quarter");
      const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("CS156");

      expect(descriptionField).toBeInTheDocument();
      expect(descriptionField).toHaveValue("My Winter Courses");

      expect(quarterField).toBeInTheDocument();

      expect(quarterField).toHaveValue("W22");
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(nameField, { target: { value: "Winter Courses" } });
      fireEvent.change(descriptionField, {
        target: { value: "My Plan for Winter" },
      });
      fireEvent.click(submitButton);

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/personalschedules/list",
        }),
      );

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          user: {
            id: 1,
            email: "phtcon@ucsb.edu",
            googleSub: "115856948234298493496",
            pictureUrl:
              "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
            fullName: "Phill Conrad",
            givenName: "Phill",
            familyName: "Conrad",
            emailVerified: true,
            locale: "en",
            hostedDomain: "ucsb.edu",
            admin: true,
          },
          name: "Winter Courses",
          description: "My Plan for Winter",
          quarter: "20221",
        }),
      ); // posted object
    });

    test("renders without crashing for user", () => {
      const queryClient = new QueryClient();
      axiosMock.onGet("/api/courses/user/all").reply(200, []);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });
    test("when the backend returns an error, user gets toast with error message", async () => {
      const queryClient = new QueryClient();
      axiosMock
        .onPut("/api/personalschedules")
        .reply(500, { message: "The backend is in a mood today" });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(
        await screen.findByText("Edit Personal Schedule"),
      ).toBeInTheDocument();

      const nameField = screen.getByTestId("PersonalScheduleForm-name");
      fireEvent.change(nameField, { target: { value: "Winter Courses" } });
      const idField = screen.getByTestId("PersonalScheduleForm-id");
      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

      expect(submitButton).toBeInTheDocument();

      fireEvent.click(submitButton);

      await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

      expect(mockToast).toHaveBeenCalledWith(
        "Error: The backend is in a mood today",
      );
    });

    test("renders without crashing for admin", () => {
      const queryClient = new QueryClient();
      axiosMock.onGet("/api/courses/admin/all").reply(200, []);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });
  });
});
