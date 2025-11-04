import React from "react";

export default function CourseDescriptionComponent({ course }) {
  return (
    <div>
      <h5>Course Description</h5>
      <p>{course.description}</p>
    </div>
  );
}
