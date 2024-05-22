import { render, screen } from "@testing-library/react";
import CourseGradeDistTable from "main/components/CourseGradeDist/CourseGradeDistTable";

const mockGradeDist = [
  {
    id: 1,
    yyyyq: "20231",
    course: "CMPSC 130B",
    instructor: "Bob Test1",
    grade: "A+",
    count: 3,
    subjectArea: "CMPSC",
    courseNum: "130B",
  },
  {
    id: 2,
    yyyyq: "20232",
    course: "CMPSC 130B",
    instructor: "Jane Test2",
    grade: "A",
    count: 2,
    subjectArea: "CMPSC",
    courseNum: "130B",
  },
  {
    id: 3,
    yyyyq: "20233",
    course: "CMPSC 130B",
    instructor: "Jack Test3",
    grade: "A-",
    count: 1,
    subjectArea: "CMPSC",
    courseNum: "130B",
  },
  {
    id: 4,
    yyyyq: "20234",
    course: "CMPSC 130B",
    instructor: "James Test4",
    grade: "B+",
    count: 6,
    subjectArea: "CMPSC",
    courseNum: "130B",
  },
];

describe("CourseGradeDistTable tests", () => {
  test("renders without crashing", () => {
    render(<CourseGradeDistTable gradeData={mockGradeDist} />);
  });

  test("displays the distribution correctly for 4 data points all with different sessions", () => {
    render(<CourseGradeDistTable gradeData={mockGradeDist} />);

    const testId = "CourseGradeDistTable";
    const expectedHeaders = [
      "id",
      "Session",
      "Course",
      "Instructor",
      "Grade",
      "Count",
    ];
    const expectedFields = [
      "id",
      "session",
      "course",
      "instructor",
      "grade",
      "count",
    ];

    expectedHeaders.forEach((headerTxt) => {
      const header = screen.getByText(headerTxt);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    // Check course displaying as expected (all rows should have the same course)
    for (let row = 0; row < 4; row++) {
      expect(
        screen.getByTestId(`${testId}-cell-row-${row}-col-course`),
      ).toHaveTextContent("CMPSC 130B");
    }

    // Check instructor, grade, count displaying as expected
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("Bob Test1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-grade`),
    ).toHaveTextContent("A+");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-count`),
    ).toHaveTextContent("3");

    // Check sessions displaying as expected
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-session`),
    ).toHaveTextContent("Winter 2023");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-session`),
    ).toHaveTextContent("Spring 2023");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-session`),
    ).toHaveTextContent("Summer 2023");
    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-session`),
    ).toHaveTextContent("Fall 2023");
  });
});
