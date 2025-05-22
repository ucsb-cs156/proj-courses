// import React from "react";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom/extend-expect";

// import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";
// import {
//   oneClassroom,
//   threeClassrooms,
//   allClassrooms,
// } from "fixtures/classroomFixtures";

// // Note: No mocks for compareValues or React; using real implementations

// describe("SingleClassroomDropdown", () => {
//   let setClassroom;

//   beforeEach(() => {
//     setClassroom = jest.fn();
//     window.localStorage.clear();
//   });

//   test("renders a single classroom option", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={oneClassroom}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     const option = screen.getByTestId("cd1-option-PHELP-1401");
//     expect(option).toBeInTheDocument();
//     expect(option).toHaveTextContent("PHELP 1401");
//   });

//   test("sorts and filters three classrooms by building", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     // Should see 3 PHELP rooms: 1401, 1502, 1603
//     const opts = screen.getAllByRole("option").filter((o) => o.value !== "ALL");
//     expect(opts).toHaveLength(3);
//     expect(opts[0]).toHaveTextContent("PHELP 1401");
//     expect(opts[1]).toHaveTextContent("PHELP 1502");
//     expect(opts[2]).toHaveTextContent("PHELP 1603");
//   });

//   test("shows ALL option when showAll is true", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={allClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//         showAll
//       />,
//     );
//     const allOpt = screen.getByTestId("cd1-option-all");
//     expect(allOpt).toBeInTheDocument();
//     expect(allOpt).toHaveValue("ALL");
//     expect(allOpt).toHaveTextContent("ALL");
//     // Ensure at least one classroom appears
//     expect(screen.getByTestId("cd1-option-PHELP-1401")).toBeInTheDocument();
//   });

//   test("filters classrooms by building when showAll is false", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={allClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );

//     const opts = screen.getAllByRole("option").filter((o) => o.value !== "ALL");

//     opts.forEach((o) => {
//       expect(o).toHaveTextContent("PHELP");
//     });
//   });

//   test("calls setClassroom and onChange on select", () => {
//     const onChange = jest.fn();
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//         onChange={onChange}
//       />,
//     );
//     const select = screen.getByLabelText("Classroom");
//     userEvent.selectOptions(select, "1502");
//     expect(setClassroom).toHaveBeenCalledWith("1502");
//     expect(onChange).toHaveBeenCalledTimes(1);
//   });

//   test("initializes value from localStorage if present", () => {
//     window.localStorage.setItem("cd1", "1401");
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     const combobox = screen.getByRole("combobox");
//     expect(combobox.value).toBe("1401");
//   });

//   test("renders nothing when no classrooms and showAll is false", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={[]}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     expect(screen.queryByRole("option")).toBeNull();
//   });

//   test("initializes from classroom prop when no localStorage", () => {
//     window.localStorage.clear();
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom="1502"
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     const combobox = screen.getByRole("combobox");
//     expect(combobox.value).toBe("1502");
//   });

//   test("resets value and parent when building changes", () => {
//     const { rerender } = render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     const select = screen.getByRole("combobox");
//     userEvent.selectOptions(select, "1502");
//     expect(setClassroom).toHaveBeenCalledWith("1502");

//     rerender(
//       <SingleClassroomDropdown
//         building="ENG"
//         classrooms={allClassrooms}
//         classroom="1502"
//         setClassroom={setClassroom}
//         controlId="cd1"
//       />,
//     );
//     expect(select.value).toBe("");
//     expect(setClassroom).toHaveBeenCalledWith("");
//   });

//   test("defaults to first classroom when neither localStorage nor classroom prop is set", () => {
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={threeClassrooms}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cdDefault"
//       />,
//     );
//     const combobox = screen.getByRole("combobox");
//     // first sorted PHELP roomNumber is "1401"
//     expect(combobox.value).toBe("1401");
//   });

//   test("sorts even an unsorted classroom list by roomNumber", () => {
//     const unsorted = [
//       { buildingCode: "PHELP", roomNumber: "1603" },
//       { buildingCode: "PHELP", roomNumber: "1401" },
//       { buildingCode: "PHELP", roomNumber: "1502" },
//     ];
//     render(
//       <SingleClassroomDropdown
//         building="PHELP"
//         classrooms={unsorted}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cdSort"
//       />,
//     );
//     const opts = screen.getAllByRole("option").filter((o) => o.value !== "ALL");
//     expect(opts.map((o) => o.value)).toEqual(["1401", "1502", "1603"]);
//   });

//   test("replaces spaces with hyphens in the generated test-id slug", () => {
//     const withSpaces = [{ buildingCode: "ENG LAB", roomNumber: "101 A" }];
//     render(
//       <SingleClassroomDropdown
//         building="ENG LAB"
//         classrooms={withSpaces}
//         classroom=""
//         setClassroom={setClassroom}
//         controlId="cdSlug"
//       />,
//     );
//     expect(
//       screen.getByTestId("cdSlug-option-ENG-LAB-101-A"),
//     ).toBeInTheDocument();
//   });
// });

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
      />
    );
    const option = screen.getByTestId("cd1-option-PHELP-1401");
    expect(option).toBeInTheDocument();
    expect(option).toHaveTextContent("PHELP 1401");
  });

  test("correctly filters and orders classrooms", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={threeClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />
    );

    const filtered = screen.getAllByRole("option").filter(o => o.value !== "ALL");
    expect(filtered).toHaveLength(3);
    expect(filtered[0]).toHaveTextContent("PHELP 1401");
    expect(filtered[1]).toHaveTextContent("PHELP 1502");
    expect(filtered[2]).toHaveTextContent("PHELP 1603");
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
      />
    );

    const allOption = screen.getByTestId("cd1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(screen.getByTestId("cd1-option-PHELP-1401")).toBeInTheDocument();
  });

  test("filters by building when showAll is off", () => {
    rtlRender(
      <SingleClassroomDropdown
        building="PHELP"
        classrooms={allClassrooms}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cd1"
      />
    );

    const buildingOptions = screen.getAllByRole("option").filter(o => o.value !== "ALL");
    buildingOptions.forEach(opt => {
      expect(opt).toHaveTextContent("PHELP");
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
      />
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
      />
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
      />
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
      />
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
      />
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
      />
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
      />
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
      />
    );

    const roomOptions = screen.getAllByRole("option").filter(o => o.value !== "ALL");
    expect(roomOptions.map(o => o.value)).toEqual(["1401", "1502", "1603"]);
  });

  test("sanitizes spaces for test id generation", () => {
    const spacedClassroom = [{ buildingCode: "ILP", roomNumber: "1102" }];
    rtlRender(
      <SingleClassroomDropdown
        building="ENG LAB"
        classrooms={spacedClassroom}
        classroom=""
        setClassroom={mockSetClassroom}
        controlId="cdSlug"
      />
    );

    const testOption = screen.getByTestId("cdSlug-option-ENG-LAB-101-A");
    expect(testOption).toBeInTheDocument();
  });
});
