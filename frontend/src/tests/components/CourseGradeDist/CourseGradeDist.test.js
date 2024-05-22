import { render, screen } from "@testing-library/react";
import CourseGradeDistTable from "main/components/CourseGradeDist/CourseGradeDistTable";
import { gradeDistFixtures } from "fixtures/courseGradeDistFixtures";

const mockGradeDist = gradeDistFixtures.oneGradeDist;

describe("CourseGradeDistTable tests", () => {
  test("renders without crashing", () => {
    render(<CourseGradeDistTable gradeData={mockGradeDist} />);
  });

  test("displays the distribution", () => {
    render(<CourseGradeDistTable gradeData={mockGradeDist} />);
    expect(screen.getByText("Placeholder")).toBeInTheDocument();
  });
});
