import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import CourseForm from "main/components/Courses/CourseForm";
import { coursesFixtures } from "fixtures/coursesFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("CourseForm tests", () => {
    test("renders correctly", async () => {
        render(
            <Router>
                <CourseForm />
            </Router>
        );

        expect(await screen.findByText(/Personal Schedule ID/)).toBeInTheDocument();
        expect(screen.getByText(/Enrollment Code/)).toBeInTheDocument();
        expect(screen.getByText(/Create/)).toBeInTheDocument();
    });

    test("renders correctly when passing in a Course", async () => {
        render(
            <Router>
                <CourseForm initialCourse={coursesFixtures.oneCourse} />
            </Router>
        );

        expect(await screen.findByTestId(/CourseForm-id/)).toBeInTheDocument();
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/CourseForm-id/)).toHaveValue("27");
    });

    test("Correct Error messages on missing input", async () => {
        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        expect(await screen.findByTestId("CourseForm-submit")).toBeInTheDocument();
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.click(submitButton);

        expect(await screen.findByText(/Personal Schedule ID is required./)).toBeInTheDocument();
        expect(screen.getByText(/Enroll Code is required./)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <CourseForm submitAction={mockSubmitAction} />
            </Router>
        );

        expect(await screen.findByTestId("CourseForm-psId")).toBeInTheDocument();

        const psId = screen.getByTestId("CourseForm-psId");
        const enrollCd = screen.getByTestId("CourseForm-enrollCd");
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.change(psId, { target: { value: 13 } });
        fireEvent.change(enrollCd, { target: { value: '20124' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Personal Schedule ID is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Enroll Code is required./)).not.toBeInTheDocument();
        expect(enrollCd).toHaveValue("20124");
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router>
                <CourseForm />
            </Router>
        );
        expect(await screen.findByTestId("CourseForm-cancel")).toBeInTheDocument();
        const cancelButton = screen.getByTestId("CourseForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});
