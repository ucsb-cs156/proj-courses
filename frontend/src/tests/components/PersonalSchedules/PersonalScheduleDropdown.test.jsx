import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import PersonalScheduleDropdown from "main/components/PersonalSchedules/PersonalScheduleDropdown";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  compareValues: jest.fn(),
}));

describe("SingleSubjectDropdown tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  const schedule = jest.fn();
  const setSchedule = jest.fn();

  test("renders without crashing on one schedule", () => {
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.onePersonalSchedule}
        schedule={personalScheduleFixtures.onePersonalSchedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );
  });

  test("renders without crashing on three schedules", () => {
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd2"
      />,
    );
  });

  test("when I select an object, the value changes", async () => {
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd3"
      />,
    );
    expect(await screen.findByLabelText("Schedule")).toBeInTheDocument();
    const selectSchedule = screen.getByLabelText("Schedule");
    userEvent.selectOptions(selectSchedule, "1");
    expect(setSchedule).toBeCalledWith("1");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
        onChange={onChange}
      />,
    );

    expect(await screen.findByLabelText("Schedule")).toBeInTheDocument();
    const selectSchedule = screen.getByLabelText("Schedule");
    userEvent.selectOptions(selectSchedule, "1");
    await waitFor(() => expect(setSchedule).toBeCalledWith("1"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("1");
  });

  test("default label is Schedule", async () => {
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );

    expect(await screen.findByLabelText("Schedule")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );

    const expectedKey = "psd1-option-0";
    expect(await screen.findByTestId(expectedKey)).toBeInTheDocument();
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "1");

    const setScheduleStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setScheduleStateSpy]);

    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("1"));
  });

  test("when localstorage has no value, first element of schedule is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setScheduleStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setScheduleStateSpy]);

    render(
      <PersonalScheduleDropdown
        schedules={personalScheduleFixtures.threePersonalSchedules}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );

    await waitFor(() =>
      expect(useState).toBeCalledWith(expect.objectContaining({})),
    );
  });

  test("When no schedules, dropdown is blank", async () => {
    render(
      <PersonalScheduleDropdown
        schedules={[]}
        schedule={schedule}
        setSchedule={setSchedule}
        controlId="psd1"
      />,
    );

    const expectedKey = "psd1";
    expect(screen.queryByTestId(expectedKey)).toBeNull();
  });
});
