import { render, screen } from "@testing-library/react";
import BasicDescriptionTable from "main/components/Courses/CourseDescriptionTable";

const mockCourse = {
  description: "Test course description",
};

describe("CourseDescriptionTable tests", () => {
  test("renders without crashing", () => {
    render(<BasicDescriptionTable course={mockCourse} />);
  });

  test("displays the course description", () => {
    render(<BasicDescriptionTable course={mockCourse} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText("Test course description")).toBeInTheDocument();
  });
});
