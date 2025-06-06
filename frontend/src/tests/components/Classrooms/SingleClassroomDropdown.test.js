import React from "react";
import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";
import {
  oneClassroom,
  threeClassrooms,
  allClassrooms,
} from "fixtures/classroomFixtures";

describe("SingleClassroomDropdown behavior tests", () => {
  let mockSetClassroom;

  beforeEach(() => {
    mockSetClassroom = jest.fn();
    localStorage.clear();
  });

  test("displays single classroom correctly", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={oneClassroom}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );
    const option = screen.getByTestId("cd1-option-1401");
    expect(option).toBeInTheDocument();
    expect(option).toHaveTextContent("1401");
  });

  test("correctly filters and orders classrooms", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    const filtered = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "ALL");
    expect(filtered).toHaveLength(3);
    expect(filtered[0]).toHaveTextContent("1401");
    expect(filtered[1]).toHaveTextContent("1502");
    expect(filtered[2]).toHaveTextContent("1603");
  });

  test("includes 'ALL' option when enabled", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={allClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
        showAll={true}
      />,
    );

    const allOption = screen.getByTestId("cd1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(screen.getByTestId("cd1-option-1401")).toBeInTheDocument();
  });

  test("filters by building when showAll is off", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={allClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    const buildingOptions = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "ALL");

    const expectedRooms = allClassrooms
      .filter((c) => c.buildingCode === "PHELP")
      .map((c) => c.roomNumber);

    expect(buildingOptions).not.toHaveLength(0);

    buildingOptions.forEach((opt) => {
      expect(expectedRooms).toContain(opt.textContent);
    });
  });

  test("invokes callbacks when selection changes", () => {
    const mockOnChange = jest.fn();
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
        onChange={mockOnChange}
      />,
    );

    const dropdown = screen.getByLabelText("Classroom");
    userEvent.selectOptions(dropdown, "1502");

    expect(mockSetClassroom).toHaveBeenCalledWith("1502");
    expect(mockOnChange).toHaveBeenCalled();
  });

  test("prefills from localStorage", () => {
    localStorage.setItem("cd1", "1401");

    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    const box = screen.getByRole("combobox");
    expect(box.value).toBe("1401");
  });

  test("renders no classrooms if input list is empty", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={[]}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    expect(screen.queryByRole("option")).toBeNull();
  });

  test("uses prop value if no localStorage key", () => {
    localStorage.clear();

    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom="1502"
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    expect(screen.getByRole("combobox").value).toBe("1502");
  });

  test("clears value when building input is changed", () => {
    const { rerender } = rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    const dropdown = screen.getByRole("combobox");
    userEvent.selectOptions(dropdown, "1502");
    expect(mockSetClassroom).toHaveBeenCalledWith("1502");

    rerender(
      <SingleClassroomDropdown
        building="ENG"
        classrooms={allClassrooms}
        classroom="1502"
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />,
    );

    expect(dropdown.value).toBe("");
    expect(mockSetClassroom).toHaveBeenCalledWith("");
  });

  test("defaults to top classroom if no values are given", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cdDefault"
      />,
    );

    expect(screen.getByRole("combobox").value).toBe("1401");
  });

  test("orders classrooms numerically even if unsorted", () => {
    const outOfOrder = [
      { buildingCode: "PHELP", roomNumber: "1603" },
      { buildingCode: "PHELP", roomNumber: "1401" },
      { buildingCode: "PHELP", roomNumber: "1502" },
    ];

    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={outOfOrder}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cdSort"
      />,
    );

    const roomOptions = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "ALL");
    expect(roomOptions.map((o) => o.value)).toEqual(["1401", "1502", "1603"]);
  });

  test("sanitizes spaces for test id generation", () => {
    const spacedClassroom = [{ buildingCode: "ILP", roomNumber: "11 02" }];
    rtlRender(
      <SingleClassroomDropdown
        building="ILP"
        classrooms={spacedClassroom}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cdSlug"
      />,
    );

    const testOption = screen.getByTestId("cdSlug-option-1102");
    expect(testOption).toBeInTheDocument();
    expect(testOption.textContent).toBe("11 02");
  });
});
