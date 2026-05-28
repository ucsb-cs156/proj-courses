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

    expect(screen.getByTestId("GEAreaCoursesTable-header-quarter")).toBeInTheDocument();
    expect(screen.getByTestId("GEAreaCoursesTable-header-courseId")).toBeInTheDocument();
    expect(screen.getByTestId("GEAreaCoursesTable-header-title")).toBeInTheDocument();
    expect(screen.getByTestId("GEAreaCoursesTable-header-description")).toBeInTheDocument();
    expect(
      screen.getByTestId("GEAreaCoursesTable-header-generalEducationAreas"),
    ).toBeInTheDocument();

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
      screen.getByTestId("GEAreaCoursesTable-cell-row-0-col-generalEducationAreas"),
    ).toHaveTextContent("A1, B");

    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-1-col-quarter"),
    ).toHaveTextContent("M23");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-1-col-courseId"),
    ).toHaveTextContent("CHEM 2B");
    expect(
      screen.getByTestId("GEAreaCoursesTable-cell-row-1-col-generalEducationAreas"),
    ).toHaveTextContent("C1");
  });
});
