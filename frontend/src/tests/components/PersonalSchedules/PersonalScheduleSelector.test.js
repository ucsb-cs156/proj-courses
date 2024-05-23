import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PersonalScheduleSelector from "main/components/PersonalSchedules/PersonalScheduleSelector";
import { useBackend } from "main/utils/useBackend";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

jest.mock("main/utils/useBackend");
jest.mock("main/utils/quarterUtilities.js");

describe("PersonalScheduleSelector", () => {
  beforeEach(() => {
    localStorage.clear();
    /*useBackend.mockReturnValue({
      data: [
        { id: "schedule1", quarter: "20221", name: "Schedule 1" },
        { id: "schedule2", quarter: "20222", name: "Schedule 2" },
      ],
      error: null,
      status: "success",
    });*/
    const quarter = "F21";

    global.localStorage.getItem = jest.fn(() => quarter);
    yyyyqToQyy.mockReturnValue("Q1 2022");
  });

  test("sets the initial schedule from local storage if match", () => {
    localStorage.setItem("controlId", "schedule2");
    render(
      <PersonalScheduleSelector controlId="controlId" setSchedule={() => {}} />,
    );
    expect(screen.getByDisplayValue("Q1 2022 Schedule 2")).toBeInTheDocument();
  });

  test("sets the initial schedule from the schedule prop", () => {
    render(
      <PersonalScheduleSelector schedule="schedule1" setSchedule={() => {}} />,
    );
    expect(screen.getByDisplayValue("Q1 2022 Schedule 1")).toBeInTheDocument();
  });

  test("calls setSchedule with the first schedule when schedules are loaded", () => {
    const setSchedule = jest.fn();
    render(<PersonalScheduleSelector setSchedule={setSchedule} />);
    expect(setSchedule).toHaveBeenCalledWith("schedule1");
  });

  test("updates the schedule state and calls setSchedule when a schedule is selected", () => {
    const setSchedule = jest.fn();
    render(
      <PersonalScheduleSelector
        controlId="controlId"
        setSchedule={setSchedule}
      />,
    );
    fireEvent.change(screen.getByLabelText("Schedule"), {
      target: { value: "schedule2" },
    });
    expect(localStorage.getItem("controlId")).toBe("schedule2");
    expect(setSchedule).toHaveBeenCalledWith("schedule2");
  });

  test("updates the schedule state, calls setSchedule, and calls onChange when a schedule is selected", () => {
    const setSchedule = jest.fn();
    const onChange = jest.fn();
    render(
      <PersonalScheduleSelector
        controlId="controlId"
        setSchedule={setSchedule}
        onChange={onChange}
      />,
    );
    const selectElement = screen.getByLabelText("Schedule", {
      selector: "select",
    });
    fireEvent.change(selectElement, { target: { value: "schedule2" } });

    expect(localStorage.getItem("controlId")).toBe("schedule2");
    expect(setSchedule).toHaveBeenCalledWith("schedule2");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object)); // Event object
  });

  test("sets the initial schedule when schedules are loaded", () => {
    const setSchedule = jest.fn();

    // Mock the useBackend hook to return an empty schedules array initially
    useBackend.mockReturnValueOnce({
      data: [],
      error: null,
      status: "success",
    });

    // Render the component with an empty schedules array
    const { rerender } = render(
      <PersonalScheduleSelector setSchedule={`setSchedule`} />,
    );

    // Assert that setSchedule is not called when schedules array is empty
    expect(setSchedule).not.toHaveBeenCalled();

    // Mock the useBackend hook to return a non-empty schedules array
    useBackend.mockReturnValueOnce({
      data: [
        { id: "schedule1", quarter: "20221", name: "Schedule 1" },
        { id: "schedule2", quarter: "20222", name: "Schedule 2" },
      ],
      error: null,
      status: "success",
    });

    // Rerender the component with the updated schedules array
    rerender(<PersonalScheduleSelector setSchedule={setSchedule} />);

    // Assert that setSchedule is called with the first schedule id when schedules array is not empty
    expect(setSchedule).toHaveBeenCalledWith("schedule1");
  });
});
