import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("PersonalScheduleForm tests", () => {
    test("renders correctly", async () => {
        render(
            <Router>
                <PersonalScheduleForm />
            </Router>
        );

        expect(await screen.findByText(/Name/)).toBeInTheDocument();
        expect(screen.getByText(/Description/)).toBeInTheDocument();
        expect(screen.getByText(/Quarter/)).toBeInTheDocument();
        expect(screen.getByText(/Create/)).toBeInTheDocument();
    });

    test("renders correctly when passing in a PersonalSchedule", async () => {
        render(
            <Router>
                <PersonalScheduleForm initialPersonalSchedule={personalSchedulesFixtures.onePersonalSchedule} />
            </Router>
        );

        expect(await screen.findByTestId(/PersonalScheduleForm-id/)).toBeInTheDocument();
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/PersonalScheduleForm-id/)).toHaveValue("1");
    });

    test("Correct Error messages on missing input", async () => {
        render(
            <Router  >
                <PersonalScheduleForm />
            </Router>
        );
        expect(await screen.findByTestId("PersonalScheduleForm-submit")).toBeInTheDocument();
        const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

        fireEvent.click(submitButton);

        expect(await screen.findByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Description is required./)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <PersonalScheduleForm submitAction={mockSubmitAction} />
            </Router>
        );

        expect(await screen.findByTestId("PersonalScheduleForm-name")).toBeInTheDocument();

        const name = screen.getByTestId("PersonalScheduleForm-name");
        const description = screen.getByTestId("PersonalScheduleForm-description");
        const quarter = document.querySelector("#PersonalScheduleForm-quarter");
        const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

        fireEvent.change(name, { target: { value: 'test' } });
        fireEvent.change(description, { target: { value: 'test' } });
        fireEvent.change(quarter, { target: { value: '20124' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Description is required./)).not.toBeInTheDocument();
        expect(quarter).toHaveValue("20124");
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router>
                <PersonalScheduleForm />
            </Router>
        );
        expect(await screen.findByTestId("PersonalScheduleForm-cancel")).toBeInTheDocument();
        const cancelButton = screen.getByTestId("PersonalScheduleForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});
