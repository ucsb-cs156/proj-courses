import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";
import axios from "axios";

import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";

jest.mock("axios");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("SingleClassroomDropdown tests", () => {
  const buildingCode = "GIRV";
  const quarter = "20221";
  const classrooms = ["1116", "2120", "2210"];
  const classroom = jest.fn();
  const setClassroom = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: classrooms });
    useState.mockImplementation(jest.requireActual("react").useState);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error.mockRestore();
  });

  test("renders without crashing", async () => {
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
      />,
    );

    const select = await screen.findByLabelText("Classroom");
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
  });

  test("shows sorted classroom options with hyphenated keys and correct order", async () => {
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
      />,
    );

    const option1116 = await screen.findByTestId("scd1-option-1116");
    const option2120 = await screen.findByTestId("scd1-option-2120");
    const option2210 = await screen.findByTestId("scd1-option-2210");

    expect(option1116).toBeInTheDocument();
    expect(option2120).toBeInTheDocument();
    expect(option2210).toBeInTheDocument();

    const options = screen
      .getAllByRole("option")
      .map((o) => o.value)
      .filter((v) => v !== "");
    expect(options).toEqual(["1116", "2120", "2210"]);
  });

  test('renders "ALL" option when showAll is true', async () => {
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
        showAll={true}
      />,
    );

    const allOption = screen.queryByTestId("scd1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(allOption).toHaveTextContent("ALL");
  });

  test('no "ALL" option when showAll is false', async () => {
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
        showAll={false}
      />,
    );

    await screen.findByLabelText("Classroom");

    const allOption = screen.queryByTestId("scd1-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test("default label is Classroom", async () => {
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
      />,
    );

    const select = await screen.findByLabelText("Classroom");
    expect(select).toBeInTheDocument();

    const label = screen.getByText("Classroom");
    expect(label.tagName.toLowerCase()).toBe("label");
  });

  test("calls setClassroom and onChange when selection changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
        onChange={onChange}
      />,
    );

    const select = await screen.findByLabelText("Classroom");
    userEvent.selectOptions(select, "2210");

    await waitFor(() => expect(setClassroom).toHaveBeenCalledWith("2210"));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("2210");
  });

  test("handles change without crashing when onChange is not provided", async () => {
    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    const dropdown = await screen.findByLabelText("Classroom");
    userEvent.selectOptions(dropdown, "2120");

    expect(dropdown.value).toBe("2120");
  });

  test("gracefully handles axios failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("fail"));
    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
      />,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching classrooms:",
        expect.any(Error),
      );
    });
  });

  test("logs error if axios request fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("fetch failed"));
    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching classrooms:",
        expect.any(Error),
      ),
    );
  });

  test("uses value from localStorage", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "2120");

    const setClassroomStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setClassroomStateSpy]);

    render(
      <SingleClassroomDropdown
        buildingCode={buildingCode}
        quarter={quarter}
        classroom={classroom}
        setClassroom={setClassroom}
        controlId="scd1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("2120"));
  });

  test("does not fetch classrooms when buildingCode is missing", async () => {
    axios.get.mockClear();

    render(
      <SingleClassroomDropdown
        buildingCode=""
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await waitFor(() => {
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  test("passes correct params to axios", async () => {
    axios.get.mockClear();

    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "/api/public/classrooms/roomnumbers",
        expect.objectContaining({
          params: {
            quarter: "20221",
            buildingCode: "GIRV",
          },
        }),
      ),
    );
  });

  test("renders correctly when API returns empty classroom list", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await screen.findByLabelText("Classroom");

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Select a classroom");
  });
  test("classroom names with spaces render hyphenated testIds", async () => {
    axios.get.mockResolvedValueOnce({ data: ["Room A"] });

    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    const option = await screen.findByTestId("scd1-option-Room-A");
    expect(option).toBeInTheDocument();
    expect(option).toHaveTextContent("Room A");
  });
  test("no classrooms shown before API resolves", async () => {
    const slowResolve = new Promise(() => {});
    axios.get.mockReturnValueOnce(slowResolve);

    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Select a classroom");
  });
  test("classrooms are sorted alphabetically", async () => {
    axios.get.mockResolvedValueOnce({ data: ["2220", "1110", "1990"] });

    render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await waitFor(() => {
      const options = screen.getAllByRole("option");
      const values = options
        .map((o) => o.value)
        .filter((v) => v && v !== "ALL");
      expect(values).toEqual(["1110", "1990", "2220"]);
    });
  });

  test("refetches classrooms when buildingCode changes", async () => {
    const { rerender } = render(
      <SingleClassroomDropdown
        buildingCode="GIRV"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await screen.findByLabelText("Classroom");
    expect(axios.get).toHaveBeenCalledTimes(1);

    axios.get.mockClear();

    rerender(
      <SingleClassroomDropdown
        buildingCode="PHELP"
        quarter="20221"
        classroom=""
        setClassroom={() => {}}
        controlId="scd1"
      />,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    expect(axios.get).toHaveBeenCalledWith(
      "/api/public/classrooms/roomnumbers",
      expect.objectContaining({
        params: expect.objectContaining({
          buildingCode: "PHELP",
        }),
      }),
    );
  });
});
