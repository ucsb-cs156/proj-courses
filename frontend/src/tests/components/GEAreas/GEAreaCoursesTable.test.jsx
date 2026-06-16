import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import GEAreaCoursesTable from "main/components/GEAreas/GEAreaCoursesTable";

const queryClient = new QueryClient();

describe("GEAreaCoursesTable tests", () => {
  const WrappedTable = ({ courses }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GEAreaCoursesTable courses={courses} />
      </MemoryRouter>
    </QueryClientProvider>
  );

  test("renders the expected table headers and course cells", () => {
    const courses = [
      {
        quarter: "20232",
        courseId: "MATH 1A",
        title: "Calculus I",
        description: "Intro to calculus",
        generalEducation: ["A1", "B"],
      },
      {
        quarter: "20233",
        courseId: "CHEM 2B",
        title: "General Chemistry",
        description: "Chemistry fundamentals",
        generalEducation: [{ geCode: "C1" }, null],
      },
    ];

    render(<WrappedTable courses={courses} />);

    expect(
      screen.getByTestId("GEAreaCoursesTable-header-quarter"),
    ).toHaveTextContent("Quarter");
    expect(
      screen.getByTestId("GEAreaCoursesTable-header-courseId"),
    ).toHaveTextContent("Course Id");
    expect(
      screen.getByTestId("GEAreaCoursesTable-header-title"),
    ).toHaveTextContent("Title");
    expect(
      screen.getByTestId("GEAreaCoursesTable-header-description"),
    ).toHaveTextContent("Description");
    expect(
      screen.getByTestId("GEAreaCoursesTable-header-generalEducationAreas"),
    ).toHaveTextContent("General Education Areas");

    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-quarter"),
    ).toHaveTextContent("S23");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-courseId"),
    ).toHaveTextContent("MATH 1A");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-title"),
    ).toHaveTextContent("Calculus I");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-description"),
    ).toHaveTextContent("Intro to calculus");
    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-0-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^A1, B$/);

    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-1-col-quarter"),
    ).toHaveTextContent("M23");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-1-col-courseId"),
    ).toHaveTextContent("CHEM 2B");
    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-1-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^C1$/);
  });

  test("renders empty and trimmed GE area values correctly", () => {
    const courses = [
      {
        quarter: "20234",
        courseId: "TEST 1",
        title: "Test One",
        description: "Empty areas",
        generalEducation: [],
      },
      {
        quarter: "20235",
        courseId: "TEST 2",
        title: "Test Two",
        description: "Trimmed string and object areas",
        generalEducation: [" A1 ", { geCode: " C1 " }],
      },
    ];

    render(<WrappedTable courses={courses} />);

    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-0-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^$/);
    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-1-col-generalEducationAreas",
      ).textContent,
    ).toBe("A1, C1");
  });

  test("renders array-like non-array generalEducation objects as blank", () => {
    const courses = [
      {
        quarter: "20234",
        courseId: "TEST 3",
        title: "Test Three",
        description: "Array-like generalEducation",
        generalEducation: {
          length: 0,
          map: () => ["SHOULD NOT SHOW"],
        },
      },
    ];

    render(<WrappedTable courses={courses} />);

    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-0-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^$/);
  });

  test("renders fallback values for non-array and object general education values", () => {
    const courses = [
      {
        quarter: "20234",
        courseId: "TEST 1",
        title: "Test One",
        description: "Non-array generalEducation",
        generalEducation: "A1",
      },
      {
        quarter: "20235",
        courseId: "TEST 2",
        title: "Test Two",
        description: "Object fallback generalEducation",
        generalEducation: [
          {
            toString: () => "CUSTOM",
          },
        ],
      },
    ];

    render(<WrappedTable courses={courses} />);

    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-0-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^$/);
    expect(
      screen.getByTestId(
        "GEAreaCoursesTable-cell-row-1-col-generalEducationAreas",
      ),
    ).toHaveTextContent(/^CUSTOM$/);
  });
});
