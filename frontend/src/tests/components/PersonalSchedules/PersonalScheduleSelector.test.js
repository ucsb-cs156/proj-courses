import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PersonalScheduleSelector from "main/components/PersonalSchedules/PersonalScheduleSelector";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

//jest.mock("main/utils/quarterUtilities.js");
jest.mock("main/utils/quarterUtilities.js", () => ({
  yyyyqToQyy: jest.fn(),
}));

describe("PersonalScheduleSelector", () => {
  const filteringSchedules = [
    { id: "schedule1", quarter: "20241", name: "Schedule 1" },
    { id: "schedule2", quarter: "20242", name: "Schedule 2" },
  ];

  const emptyfilteringSchedules = [];

  beforeEach(() => {
    yyyyqToQyy.mockReturnValue("S24");
  });

  test("sets the initial schedule from the schedule prop", () => {
    render(
      <PersonalScheduleSelector 
      filteringSchedules={filteringSchedules}
      schedule="schedule1" 
      setSchedule={() => {}}  
      />,
    );

  expect(screen.getByDisplayValue("S24 Schedule 1")).toBeInTheDocument();
  });

  test("updates the schedule state and calls setSchedule when a schedule is selected", () => {
    const setSchedule = jest.fn();
    render(
      <PersonalScheduleSelector
        controlId="controlId"
        setSchedule={setSchedule}
        filteringSchedules={filteringSchedules} //Change
      />,
    );
    fireEvent.change(screen.getByLabelText("Schedule"), {
      target: { value: "schedule1" }, //Change
    });
    expect(localStorage.getItem("controlId")).toBe("schedule1"); //Change
    expect(setSchedule).toHaveBeenCalledWith("schedule1"); //Change
  });

  test("updates the schedule state, calls setSchedule, and calls onChange when a schedule is selected", () => {
    const setSchedule = jest.fn();
    const onChange = jest.fn();
    render(
      <PersonalScheduleSelector
        controlId="controlId"
        setSchedule={setSchedule}
        onChange={onChange}
        filteringSchedules={filteringSchedules} //Change
      />,
    );
    const selectElement = screen.getByLabelText("Schedule", {
      selector: "select",
    });
    fireEvent.change(selectElement, { target: { value: "schedule1" } }); //Change

    expect(localStorage.getItem("controlId")).toBe("schedule1"); //Change
    expect(setSchedule).toHaveBeenCalledWith("schedule1"); //Change
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test("sets the initial schedule when schedules are loaded", () => {
    const setSchedule = jest.fn();

    const { rerender } = render(
      <PersonalScheduleSelector 
      filteringSchedules={emptyfilteringSchedules}
      setSchedule={`setSchedule`} />,

    );

    expect(setSchedule).not.toHaveBeenCalled();

    rerender(<PersonalScheduleSelector 
      filteringSchedules={filteringSchedules}
      setSchedule={setSchedule} />);

    expect(setSchedule).toHaveBeenCalledWith("schedule1");
  });
});
