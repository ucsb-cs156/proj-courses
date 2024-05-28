import { render, screen } from "@testing-library/react";
import GradeHistoryTable from "main/components/GradeHistory/GradeHistoryTable";

const mockGrades = [
    {
        id: 1,
        yyyyq: "20094",
        course: "CMPSC  130A",
        instructor: "GONZALEZ T F",
        grade: "A",
        count: 1,
        subjectArea: "CMPSC",
        courseNum: "130A",
    },
    {
        id: 2,
        yyyyq: "20104",
        course: "CMPSC  130A",
        instructor: "GONZALEZ T F",
        grade: "B",
        count: 3,
        subjectArea: "CMPSC",
        courseNum: "130A",
    },
    {
        id: 3,
        yyyyq: "20113",
        course: "CMPSC  130A",
        instructor: "GONZALEZ T F",
        grade: "B+",
        count: 7,
        subjectArea: "CMPSC",
        courseNum: "130A",
    },
];

describe("GradeHistoryTable tests", () => {
    test("renders without crashing", () => {
        render(<GradeHistoryTable grades={mockGrades}/>);
    });
    test("renders without crashing for empty table", () => {
        render(<GradeHistoryTable grades={[]} />);
    });
    test("displays history of 3 different quarters correctly", () => {
        render(<GradeHistoryTable grades={mockGrades} />);

        const expectedHeaders = [
            "Quarter",
            "Course ID",
            "Instructor",
            "Grade",
            "Count",
        ];

        const expectedFields = [
            "quarter",
            "course",
            "instructor",
            "grade",
            "count",
        ];

        const testId = "GradeHistoryTable"

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });
      
        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-course`),
            ).toHaveTextContent("CMPSC 130A");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-course`),
            ).toHaveTextContent("CMPSC 130A");
        expect(
            screen.getByTestId(`${testId}-cell-row-2-col-course`),
            ).toHaveTextContent("CMPSC 130A");

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
            ).toHaveTextContent("GONZALEZ T F");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-grade`),
            ).toHaveTextContent("A");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-count`),
            ).toHaveTextContent("1");

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
            ).toHaveTextContent("FALL 2009");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-quarter`),
            ).toHaveTextContent("FALL 2010");
        expect(
            screen.getByTestId(`${testId}-cell-row-2-col-quarter`),
            ).toHaveTextContent("SUMMER 2011");
    });
});