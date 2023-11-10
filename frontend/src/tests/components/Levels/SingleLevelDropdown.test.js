import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import SingleLevelDropdown from "main/components/Levels/SingleLevelDropdown";
import { allTheLevels } from "fixtures/levelsFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("SingleLevelDropdown tests", () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const level = jest.fn();
  const setLevel = jest.fn();

  test("renders without crashing", () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );
  });

  test("when I select an level, the value changes", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "U");
    expect(setLevel).toBeCalledWith("U");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
        onChange={onChange}
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "U");

    await waitFor(() => expect(setLevel).toBeCalledWith("U"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("U");
  });

  test("default label is Course Level", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    const expectedKey = "sld1-option-0";
    expect(await screen.findByTestId(expectedKey)).toBeInTheDocument();
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "U");

    const setLevelStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setLevelStateSpy]);

    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("U"));
  });

  test("when localstorage has no value, U is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setLevelStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setLevelStateSpy]);

    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("U"));
  });
});
