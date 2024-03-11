import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import PersonalScheduleSelector from "main/components/PersonalSchedules/PersonalScheduleSelector";
import { useBackend } from "main/utils/useBackend";

jest.mock("main/utils/useBackend");

describe("PersonalScheduleSelector", () => {
  let setSchedule;
  let setHasSchedules;

  beforeEach(() => {
    setSchedule = jest.fn();
    setHasSchedules = jest.fn();
    useBackend.mockReturnValue({
      data: [{ id: "1", name: "Test Schedule" }],
      error: null,
      status: "success",
    });
  });

  it("renders without crashing", () => {
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />,
    );
  });

  it("calls setSchedule and setHasSchedules on mount if schedules are available", async () => {
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />,
    );
    await waitFor(() => expect(setSchedule).toHaveBeenCalledWith("1"));
    expect(setHasSchedules).toHaveBeenCalledWith(true);
  });

  it("calls setSchedule and setHasSchedules on mount if schedules are not available", async () => {
    useBackend.mockReturnValueOnce({
      data: [],
      error: null,
      status: "success",
    });
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />,
    );
    await waitFor(() => expect(setSchedule).not.toHaveBeenCalled());
    expect(setHasSchedules).toHaveBeenCalledWith(false);
  });

  it("updates schedule state and localStorage on select change", async () => {
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />,
    );
    const select = screen.getByLabelText("Schedule");
    fireEvent.change(select, { target: { value: "1" } });
    expect(localStorage.getItem("test")).toBe("1");
    expect(setSchedule).toHaveBeenCalledWith("1");
  });

  it("calls the provided onChange function when the select changes", () => {
    const onChange = jest.fn();
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
        onChange={onChange}
      />,
    );
    const select = screen.getByLabelText("Schedule");
    fireEvent.change(select, { target: { value: "1" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("does not call onChange if it is null", () => {
    render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />,
    );
    const select = screen.getByLabelText("Schedule");
    fireEvent.change(select, { target: { value: "1" } });
    // No assertion necessary as we're just verifying that no error is thrown
  });
});
