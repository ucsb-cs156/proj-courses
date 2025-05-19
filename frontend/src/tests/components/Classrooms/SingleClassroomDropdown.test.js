import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";
import { oneClassroom, threeClassrooms, allClassrooms } from "fixtures/classroomFixtures";

// Note: No mocks for compareValues or React; using real implementations

describe("SingleClassroomDropdown", () => {
  let setClassroom;

  beforeEach(() => {
    setClassroom = jest.fn();
    window.localStorage.clear();
  });

  test("renders a single classroom option", () => {
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={oneClassroom}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
      />
    );
    const option = screen.getByTestId("cd1-option-ILP-1101");
    expect(option).toBeInTheDocument();
    expect(option).toHaveTextContent("ILP 1101");
  });

  test("sorts and filters three classrooms by building", () => {
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
      />
    );
    // Should see 3 ILP rooms: 1101, 3211, 3316
    const opts = screen.getAllByRole("option").filter(o => o.value !== "ALL");
    expect(opts).toHaveLength(3);
    expect(opts[0]).toHaveTextContent("ILP 1101");
    expect(opts[1]).toHaveTextContent("ILP 3211");
    expect(opts[2]).toHaveTextContent("ILP 3316");
  });

  test("shows ALL option when showAll is true", () => {
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={allClassrooms}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
        showAll
      />
    );
    const allOpt = screen.getByTestId("cd1-option-all");
    expect(allOpt).toBeInTheDocument();
    expect(allOpt).toHaveValue("ALL");
    expect(allOpt).toHaveTextContent("ALL");
    // Ensure at least one classroom appears
    expect(screen.getByTestId("cd1-option-ILP-1101")).toBeInTheDocument();
  });

  test("filters classrooms by building when showAll is false", () => {
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={allClassrooms}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
      />
    );
    const opts = screen.getAllByRole("option");
    opts.forEach(o => {
      if (o.value !== "ALL") {
        expect(o.textContent).toContain("ILP");
      }
    });
  });

  test("calls setClassroom and onChange on select", () => {
    const onChange = jest.fn();
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
        onChange={onChange}
      />
    );
    const select = screen.getByLabelText("Classroom");
    userEvent.selectOptions(select, "3211");
    expect(setClassroom).toHaveBeenCalledWith("3211");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("initializes value from localStorage if present", () => {
    window.localStorage.setItem("cd1", "1101");
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
      />
    );
    const combobox = screen.getByRole("combobox");
    expect(combobox.value).toBe("1101");
  });

  test("renders nothing when no classrooms and showAll is false", () => {
    render(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={[]}
        classroom=""
        setClassroom={setClassroom}
        controlId="cd1"
      />
    );
    expect(screen.queryByRole("option")).toBeNull();
  });
});
