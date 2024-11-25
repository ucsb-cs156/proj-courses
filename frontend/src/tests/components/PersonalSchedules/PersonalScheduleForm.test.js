import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("PersonalScheduleForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20154",
      endQtrYYYYQ: "20244",
    });
  });

  const queryClient = new QueryClient();

  test("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Name/)).toBeInTheDocument();
    expect(screen.getByText(/Description/)).toBeInTheDocument();
    expect(screen.getByText(/Quarter/)).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
    expect(screen.getByText("S22")).toBeInTheDocument();
  });

  test("renders correctly when passing in a PersonalSchedule", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm
            initialPersonalSchedule={
              personalSchedulesFixtures.onePersonalSchedule
            }
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(/PersonalScheduleForm-id/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/PersonalScheduleForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId("PersonalScheduleForm-submit"),
    ).toBeInTheDocument();
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Name is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("PersonalScheduleForm-name"),
    ).toBeInTheDocument();

    const name = screen.getByTestId("PersonalScheduleForm-name");
    const description = screen.getByTestId("PersonalScheduleForm-description");
    const quarter = document.querySelector("#PersonalScheduleForm-quarter");
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(name, { target: { value: "test" } });
    fireEvent.change(description, { target: { value: "test" } });
    fireEvent.change(quarter, { target: { value: "20124" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Description is required./),
    ).not.toBeInTheDocument();
    expect(quarter).toHaveValue("20154");
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId("PersonalScheduleForm-cancel"),
    ).toBeInTheDocument();
    const cancelButton = screen.getByTestId("PersonalScheduleForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("Fallback hardcoded values for startQtr and endQtr work when systemInfo doesn't provide any", async () => {
    const mockSubmitAction = jest.fn();

    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: null, // use fallback value
      endQtrYYYYQ: null, // use fallback value
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("PersonalScheduleForm-name"),
    ).toBeInTheDocument();

    const name = screen.getByTestId("PersonalScheduleForm-name");
    const description = screen.getByTestId("PersonalScheduleForm-description");
    const quarter = document.querySelector("#PersonalScheduleForm-quarter");
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(name, { target: { value: "test" } });
    fireEvent.change(description, { target: { value: "test" } });
    fireEvent.change(quarter, { target: { value: "20124" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Description is required./),
    ).not.toBeInTheDocument();
    expect(quarter).toHaveValue("20211");
  });

  test("Shows error message when name exceeds maximum length", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm />
        </Router>
      </QueryClientProvider>,
    );

    const nameInput = screen.getByTestId("PersonalScheduleForm-name");
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(nameInput, { target: { value: "ThisNameIsWayTooLong" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Max length 15 characters"),
    ).toBeInTheDocument();
  });

  test("Form has initialPersonalSchedule content with Fall quarter", async () => {
    const queryClient = new QueryClient();
    const content = {
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
      description: "My Plan for Fall",
      quarter: "20224",
      name: "Fall Courses",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm initialPersonalSchedule={content} />
        </Router>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("PersonalScheduleForm-quarter")).toHaveValue(
        "F22",
      );
    });
  });

  test("Form has initialPersonalSchedule content with Spring quarter", async () => {
    const queryClient = new QueryClient();
    const content = {
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
      description: "My Plan for Spring",
      quarter: "20222",
      name: "Spring Courses",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm initialPersonalSchedule={content} />
        </Router>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("PersonalScheduleForm-quarter")).toHaveValue(
        "S22",
      );
    });
  });

  test("Form has initialPersonalSchedule content with Summer quarter", async () => {
    const queryClient = new QueryClient();
    const content = {
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
      description: "My Plan for M",
      quarter: "20223",
      name: "M Courses",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleForm initialPersonalSchedule={content} />
        </Router>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("PersonalScheduleForm-quarter")).toHaveValue(
        "M22",
      );
    });
  });
});
