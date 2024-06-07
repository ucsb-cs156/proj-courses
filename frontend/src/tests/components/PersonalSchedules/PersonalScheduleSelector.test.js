import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PersonalScheduleSelector from "main/components/PersonalSchedules/PersonalScheduleSelector";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

jest.mock("main/utils/quarterUtilities.js");

describe("PersonalScheduleSelector", () => {
  const filteredSchedules = [
    { id: "schedule1", quarter: "20242", name: "Schedule 1" },
    { id: "schedule2", quarter: "20241", name: "Schedule 2" },
  ];

  const emptyFilteredSchedules = [];
  beforeEach(() => {
    yyyyqToQyy.mockReturnValue("W24");
  });

  test("sets the initial schedule from the filtered schedule prop if quarters match", () => {
    render(
      <PersonalScheduleSelector
        filteredSchedules={filteredSchedules}
        schedule="schedule1"
        setSchedule={() => {}}
      />,
    );

    expect(screen.getByDisplayValue("W24 Schedule 1")).toBeInTheDocument();
  });

  test("updates the schedule state and calls setSchedule when a schedule is selected", () => {
    const setSchedule = jest.fn();
    render(
      <PersonalScheduleSelector
        filteredSchedules={filteredSchedules}
        controlId="controlId"
        setSchedule={setSchedule}
      />,
    );
    fireEvent.change(screen.getByLabelText("Schedule"), {
      target: { value: "schedule1" },
    });

    expect(localStorage.getItem("controlId")).toBe("schedule1");
    expect(setSchedule).toHaveBeenCalledWith("schedule1");
  });

  test("updates the schedule state, calls setSchedule, and calls onChange when a schedule is selected", () => {
    const setSchedule = jest.fn();
    const onChange = jest.fn();
    render(
      <PersonalScheduleSelector
        filteredSchedules={filteredSchedules}
        controlId="controlId"
        setSchedule={setSchedule}
        onChange={onChange}
      />,
    );
    const selectElement = screen.getByLabelText("Schedule", {
      selector: "select",
    });
    fireEvent.change(selectElement, { target: { value: "schedule1" } });

    expect(localStorage.getItem("controlId")).toBe("schedule1");
    expect(setSchedule).toHaveBeenCalledWith("schedule1");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object)); // Event object
  });

  test("sets the initial schedule when schedules are loaded", () => {
    const setSchedule = jest.fn();

    // Render the component with an empty schedules array
    const { rerender } = render(
      <PersonalScheduleSelector
        filteredSchedules={emptyFilteredSchedules}
        setSchedule={`setSchedule`}
      />,
    );

    // Assert that setSchedule is not called when schedules array is empty
    expect(setSchedule).not.toHaveBeenCalled();

    // Rerender the component with the updated schedules array
    rerender(
      <PersonalScheduleSelector
        filteredSchedules={filteredSchedules}
        setSchedule={setSchedule}
      />,
    );

    // Assert that setSchedule is called with the first schedule id when schedules array is not empty
    expect(setSchedule).toHaveBeenCalledWith("schedule1");
  });
});
